import { getDriver } from '../config/database.js';

/**
 * Signal Weight & Severity Definitions
 * Note: Risk score is a transparent rule-based heuristic for investigative prioritization,
 * not a statistical probability or regulatory determination.
 */
export const SIGNAL_CONFIG = {
  CIRCULAR_TRANSFER: { weight: 40, severity: 'HIGH', description: 'A bounded circular transfer path was detected within a concentrated time window.' },
  FAN_IN_DISPERSAL:  { weight: 30, severity: 'HIGH', description: 'Multiple inbound transfers were received in a concentrated window followed by rapid outbound dispersal.' },
  SHARED_DEVICE:     { weight: 15, severity: 'MEDIUM', description: 'Account shares a hardware device or digital fingerprint with multiple other accounts.' },
  SHARED_PHONE:      { weight: 10, severity: 'MEDIUM', description: 'Account owner shares a phone number with multiple other registered persons.' },
  SHARED_ADDRESS:    { weight: 5,  severity: 'LOW',    description: 'Account owner shares a residential or physical address with multiple other registered persons.' },
};

/**
 * Maps an aggregate numerical score (0–100) to an aggregate risk level band.
 */
export function calculateRiskLevel(score) {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'LOW';
}

/**
 * Verifies if an account exists in the graph database.
 *
 * @param {string} accountId
 * @returns {Promise<{exists: boolean, account?: object}>}
 */
export async function accountExists(accountId) {
  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (a:Account {id: $accountId})
      RETURN a.id AS id,
             a.accountNumber AS accountNumber,
             a.bank AS bank,
             a.balance AS balance,
             a.riskScore AS baseRiskScore,
             a.isFlagged AS isFlagged,
             a.createdAt AS createdAt
    `;
    const res = await session.run(cypher, { accountId });
    if (res.records.length === 0) {
      return { exists: false };
    }
    const acc = res.records[0].toObject();
    return { exists: true, account: acc };
  } finally {
    await session.close();
  }
}

/**
 * Detects circular transfer routing rings starting and ending at the given account.
 * Uses bounded variable-length Cypher traversal with chronological ordering and temporal window verification.
 *
 * @param {string} accountId
 * @param {object} options
 * @param {number} [options.maxCycleWindowHours=24]
 * @returns {Promise<{detected: boolean, cycles: Array}>}
 */
export async function detectCycles(accountId, options = {}) {
  const { maxCycleWindowHours = 24 } = options;
  const maxWindowSeconds = Math.round(maxCycleWindowHours * 3600);

  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (start:Account {id: $accountId})
      MATCH path = (start)-[r1:TRANSFERRED_TO]->(next:Account)-[:TRANSFERRED_TO*2..5]->(start)
      WITH start, r1, path,
           [start.id] + [n IN nodes(path) | n.id] AS cycleNodes,
           [r1] + relationships(path) AS allRels
      WHERE all(i IN range(0, size(allRels)-2) WHERE datetime((allRels[i]).timestamp) <= datetime((allRels[i+1]).timestamp))
        AND duration.inSeconds(datetime((allRels[0]).timestamp), datetime((allRels[-1]).timestamp)).seconds <= $maxWindowSeconds
      RETURN DISTINCT cycleNodes AS cyclePath,
             size(allRels) AS hopCount,
             [r IN allRels | {
               transactionId: r.transactionId,
               amount: r.amount,
               timestamp: r.timestamp
             }] AS transactions,
             duration.inSeconds(datetime((allRels[0]).timestamp), datetime((allRels[-1]).timestamp)).seconds / 3600.0 AS durationHours
      ORDER BY hopCount ASC
      LIMIT 5
    `;

    const result = await session.run(cypher, {
      accountId,
      maxWindowSeconds,
    });

    const cycles = result.records.map((r) => ({
      cyclePath: r.get('cyclePath'),
      hopCount: r.get('hopCount').toNumber ? r.get('hopCount').toNumber() : Number(r.get('hopCount')),
      durationHours: Number(r.get('durationHours').toFixed(2)),
      transactions: r.get('transactions'),
    }));

    return {
      detected: cycles.length > 0,
      cycles,
    };
  } finally {
    await session.close();
  }
}

/**
 * Detects hardware devices shared between the specified account and other accounts.
 *
 * @param {string} accountId
 * @param {object} options
 * @param {number} [options.minAccountThreshold=3]
 * @returns {Promise<{detected: boolean, sharedDevices: Array}>}
 */
export async function detectSharedDevice(accountId, options = {}) {
  const { minAccountThreshold = 3 } = options;

  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (acc:Account {id: $accountId})<-[:OWNS]-(p:Person)
      MATCH (acc)-[:USED_DEVICE]->(dev:Device)<-[:USED_DEVICE]-(otherAcc:Account)<-[:OWNS]-(otherP:Person)
      WHERE otherP.id <> p.id
      WITH dev,
           collect(DISTINCT otherAcc.id) AS otherAccounts,
           collect(DISTINCT otherP.id) AS otherPersons
      WHERE size(otherAccounts) + 1 >= $minAccountThreshold
      RETURN dev.id AS deviceId,
             dev.deviceId AS hardwareId,
             dev.ipAddress AS ipAddress,
             dev.deviceType AS deviceType,
             otherAccounts AS relatedAccounts,
             size(otherAccounts) + 1 AS totalAccountCount,
             size(otherPersons) + 1 AS totalPersonCount
      ORDER BY totalAccountCount DESC
    `;

    const result = await session.run(cypher, {
      accountId,
      minAccountThreshold: minAccountThreshold > 0 ? minAccountThreshold : 1,
    });

    const sharedDevices = result.records.map((r) => ({
      deviceId: r.get('deviceId'),
      hardwareId: r.get('hardwareId'),
      ipAddress: r.get('ipAddress'),
      deviceType: r.get('deviceType'),
      relatedAccounts: r.get('relatedAccounts'),
      totalAccountCount: r.get('totalAccountCount').toNumber ? r.get('totalAccountCount').toNumber() : Number(r.get('totalAccountCount')),
      totalPersonCount: r.get('totalPersonCount').toNumber ? r.get('totalPersonCount').toNumber() : Number(r.get('totalPersonCount')),
    }));

    return {
      detected: sharedDevices.length > 0,
      sharedDevices,
    };
  } finally {
    await session.close();
  }
}

/**
 * Detects phone numbers shared by the person owning the target account with other persons.
 *
 * @param {string} accountId
 * @param {object} options
 * @param {number} [options.minPersonThreshold=3]
 * @returns {Promise<{detected: boolean, sharedPhones: Array}>}
 */
export async function detectSharedPhone(accountId, options = {}) {
  const { minPersonThreshold = 3 } = options;

  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (acc:Account {id: $accountId})<-[:OWNS]-(p:Person)-[:REGISTERED_WITH]->(ph:PhoneNumber)<-[:REGISTERED_WITH]-(otherP:Person)
      WHERE otherP.id <> p.id
      OPTIONAL MATCH (otherP)-[:OWNS]->(otherAcc:Account)
      WITH ph,
           collect(DISTINCT otherP.id) AS otherPersonIds,
           collect(DISTINCT otherAcc.id) AS otherAccountIds
      WHERE size(otherPersonIds) + 1 >= $minPersonThreshold
      RETURN ph.id AS phoneId,
             ph.number AS phoneNumber,
             otherPersonIds AS relatedPersonIds,
             [id IN otherAccountIds WHERE id IS NOT NULL] AS relatedAccountIds,
             size(otherPersonIds) + 1 AS totalPersonCount
      ORDER BY totalPersonCount DESC
    `;

    const result = await session.run(cypher, {
      accountId,
      minPersonThreshold: minPersonThreshold > 0 ? minPersonThreshold : 1,
    });

    const sharedPhones = result.records.map((r) => ({
      phoneId: r.get('phoneId'),
      phoneNumber: r.get('phoneNumber'),
      relatedPersonIds: r.get('relatedPersonIds'),
      relatedAccountIds: r.get('relatedAccountIds'),
      totalPersonCount: r.get('totalPersonCount').toNumber ? r.get('totalPersonCount').toNumber() : Number(r.get('totalPersonCount')),
    }));

    return {
      detected: sharedPhones.length > 0,
      sharedPhones,
    };
  } finally {
    await session.close();
  }
}

/**
 * Detects residential/physical addresses shared by the person owning the target account with other persons.
 *
 * @param {string} accountId
 * @param {object} options
 * @param {number} [options.minPersonThreshold=3]
 * @returns {Promise<{detected: boolean, sharedAddresses: Array}>}
 */
export async function detectSharedAddress(accountId, options = {}) {
  const { minPersonThreshold = 3 } = options;

  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (acc:Account {id: $accountId})<-[:OWNS]-(p:Person)-[:LIVES_AT]->(addr:Address)<-[:LIVES_AT]-(otherP:Person)
      WHERE otherP.id <> p.id
      OPTIONAL MATCH (otherP)-[:OWNS]->(otherAcc:Account)
      WITH addr,
           collect(DISTINCT otherP.id) AS otherPersonIds,
           collect(DISTINCT otherAcc.id) AS otherAccountIds
      WHERE size(otherPersonIds) + 1 >= $minPersonThreshold
      RETURN addr.id AS addressId,
             addr.street AS street,
             addr.city AS city,
             addr.postalCode AS postalCode,
             otherPersonIds AS relatedPersonIds,
             [id IN otherAccountIds WHERE id IS NOT NULL] AS relatedAccountIds,
             size(otherPersonIds) + 1 AS totalPersonCount
      ORDER BY totalPersonCount DESC
    `;

    const result = await session.run(cypher, {
      accountId,
      minPersonThreshold: minPersonThreshold > 0 ? minPersonThreshold : 1,
    });

    const sharedAddresses = result.records.map((r) => ({
      addressId: r.get('addressId'),
      street: r.get('street'),
      city: r.get('city'),
      postalCode: r.get('postalCode'),
      relatedPersonIds: r.get('relatedPersonIds'),
      relatedAccountIds: r.get('relatedAccountIds'),
      totalPersonCount: r.get('totalPersonCount').toNumber ? r.get('totalPersonCount').toNumber() : Number(r.get('totalPersonCount')),
    }));

    return {
      detected: sharedAddresses.length > 0,
      sharedAddresses,
    };
  } finally {
    await session.close();
  }
}

/**
 * Detects smurfing / fan-in patterns and rapid outbound fund dispersal for an account.
 * Analyzes multi-sender inbound transactions within a concentrated window and subsequent rapid outbound transfers.
 *
 * @param {string} accountId
 * @param {object} options
 * @param {number} [options.minInboundCount=3]
 * @param {number} [options.maxInboundWindowHours=6]
 * @param {number} [options.maxDispersalDelayHours=6]
 * @returns {Promise<{detected: boolean, smurfingPattern: object|null}>}
 */
export async function detectSmurfing(accountId, options = {}) {
  const {
    minInboundCount = 3,
    maxInboundWindowHours = 6,
    maxDispersalDelayHours = 6,
  } = options;

  const driver = getDriver();
  if (!driver) throw new Error('Database driver is not initialized');

  const session = driver.session();
  try {
    const cypher = `
      MATCH (acc:Account {id: $accountId})
      OPTIONAL MATCH (inSender:Account)-[inTx:TRANSFERRED_TO]->(acc)
      OPTIONAL MATCH (acc)-[outTx:TRANSFERRED_TO]->(outReceiver:Account)
      WITH acc,
           collect(DISTINCT {
             transactionId: inTx.transactionId,
             fromAccountId: inSender.id,
             amount: inTx.amount,
             timestamp: inTx.timestamp
           }) AS rawIn,
           collect(DISTINCT {
             transactionId: outTx.transactionId,
             toAccountId: outReceiver.id,
             amount: outTx.amount,
             timestamp: outTx.timestamp
           }) AS rawOut
      RETURN acc.id AS accountId,
             [tx IN rawIn WHERE tx.transactionId IS NOT NULL] AS inboundTxs,
             [tx IN rawOut WHERE tx.transactionId IS NOT NULL] AS outboundTxs
    `;

    const result = await session.run(cypher, { accountId });
    if (result.records.length === 0) {
      return { detected: false, smurfingPattern: null };
    }

    const record = result.records[0].toObject();
    const inboundTxs = record.inboundTxs || [];
    const outboundTxs = record.outboundTxs || [];

    if (inboundTxs.length < minInboundCount) {
      return { detected: false, smurfingPattern: null };
    }

    // Sort chronologically
    const sortedIn = [...inboundTxs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const sortedOut = [...outboundTxs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const detectedClusters = [];

    for (let i = 0; i < sortedIn.length; i++) {
      const windowStart = new Date(sortedIn[i].timestamp);
      const windowEndLimit = new Date(windowStart.getTime() + maxInboundWindowHours * 3600 * 1000);

      const windowInTxs = sortedIn.filter((tx) => {
        const t = new Date(tx.timestamp);
        return t >= windowStart && t <= windowEndLimit;
      });

      const distinctSenders = new Set(windowInTxs.map((tx) => tx.fromAccountId));

      if (windowInTxs.length >= minInboundCount && distinctSenders.size >= minInboundCount) {
        const latestInTime = new Date(windowInTxs[windowInTxs.length - 1].timestamp);
        const dispersalLimit = new Date(latestInTime.getTime() + maxDispersalDelayHours * 3600 * 1000);

        const matchingOutTxs = sortedOut.filter((tx) => {
          const t = new Date(tx.timestamp);
          return t >= latestInTime && t <= dispersalLimit;
        });

        if (matchingOutTxs.length > 0) {
          const totalInboundAmount = windowInTxs.reduce((sum, tx) => sum + tx.amount, 0);
          const totalOutboundAmount = matchingOutTxs.reduce((sum, tx) => sum + tx.amount, 0);
          const earliestInbound = windowInTxs[0].timestamp;
          const latestInbound = windowInTxs[windowInTxs.length - 1].timestamp;
          const earliestOutbound = matchingOutTxs[0].timestamp;
          const latestOutbound = matchingOutTxs[matchingOutTxs.length - 1].timestamp;

          detectedClusters.push({
            inboundCount: windowInTxs.length,
            distinctSenderCount: distinctSenders.size,
            sourceAccountIds: Array.from(distinctSenders),
            totalInboundAmount,
            earliestInboundTimestamp: earliestInbound,
            latestInboundTimestamp: latestInbound,
            inboundWindowHours: Number(((latestInTime - windowStart) / (3600 * 1000)).toFixed(2)),
            outboundCount: matchingOutTxs.length,
            destinationAccountIds: Array.from(new Set(matchingOutTxs.map((tx) => tx.toAccountId))),
            totalOutboundAmount,
            earliestOutboundTimestamp: earliestOutbound,
            latestOutboundTimestamp: latestOutbound,
            dispersalDelayHours: Number(((new Date(earliestOutbound) - latestInTime) / (3600 * 1000)).toFixed(2)),
            inboundTransactions: windowInTxs,
            outboundTransactions: matchingOutTxs,
          });
        }
      }
    }

    if (detectedClusters.length === 0) {
      return { detected: false, smurfingPattern: null };
    }

    // Return the cluster with highest inbound count
    detectedClusters.sort((a, b) => b.inboundCount - a.inboundCount);
    return {
      detected: true,
      smurfingPattern: detectedClusters[0],
    };
  } finally {
    await session.close();
  }
}

/**
 * Aggregates all 5 fraud detection signals for an account into an investigative report.
 * Evaluates rule-based heuristic risk scoring and maps to aggregate risk level bands.
 *
 * @param {string} accountId
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function investigateAccount(accountId, options = {}) {
  // 1. Check account existence
  const { exists, account } = await accountExists(accountId);
  if (!exists) {
    return { exists: false };
  }

  // 2. Run all individual detectors concurrently
  const [cycleRes, devRes, phoneRes, addrRes, smurfRes] = await Promise.all([
    detectCycles(accountId, options),
    detectSharedDevice(accountId, options),
    detectSharedPhone(accountId, options),
    detectSharedAddress(accountId, options),
    detectSmurfing(accountId, options),
  ]);

  // 3. Assemble triggered signals with evidence
  const signals = [];
  let scoreSum = 0;

  if (cycleRes.detected) {
    const config = SIGNAL_CONFIG.CIRCULAR_TRANSFER;
    scoreSum += config.weight;
    signals.push({
      signal: 'CIRCULAR_TRANSFER',
      severity: config.severity,
      weight: config.weight,
      description: config.description,
      evidence: {
        cyclesDetected: cycleRes.cycles.length,
        cycles: cycleRes.cycles,
      },
    });
  }

  if (smurfRes.detected) {
    const config = SIGNAL_CONFIG.FAN_IN_DISPERSAL;
    scoreSum += config.weight;
    signals.push({
      signal: 'FAN_IN_DISPERSAL',
      severity: config.severity,
      weight: config.weight,
      description: config.description,
      evidence: smurfRes.smurfingPattern,
    });
  }

  if (devRes.detected) {
    const config = SIGNAL_CONFIG.SHARED_DEVICE;
    scoreSum += config.weight;
    signals.push({
      signal: 'SHARED_DEVICE',
      severity: config.severity,
      weight: config.weight,
      description: config.description,
      evidence: {
        sharedDeviceCount: devRes.sharedDevices.length,
        sharedDevices: devRes.sharedDevices,
      },
    });
  }

  if (phoneRes.detected) {
    const config = SIGNAL_CONFIG.SHARED_PHONE;
    scoreSum += config.weight;
    signals.push({
      signal: 'SHARED_PHONE',
      severity: config.severity,
      weight: config.weight,
      description: config.description,
      evidence: {
        sharedPhoneCount: phoneRes.sharedPhones.length,
        sharedPhones: phoneRes.sharedPhones,
      },
    });
  }

  if (addrRes.detected) {
    const config = SIGNAL_CONFIG.SHARED_ADDRESS;
    scoreSum += config.weight;
    signals.push({
      signal: 'SHARED_ADDRESS',
      severity: config.severity,
      weight: config.weight,
      description: config.description,
      evidence: {
        sharedAddressCount: addrRes.sharedAddresses.length,
        sharedAddresses: addrRes.sharedAddresses,
      },
    });
  }

  // Cap score at 100
  const riskScore = Math.min(100, scoreSum);
  const riskLevel = calculateRiskLevel(riskScore);

  // Determine highest single signal severity for investigative clarity
  let highestSignalSeverity = 'NONE';
  if (signals.some((s) => s.severity === 'HIGH')) {
    highestSignalSeverity = 'HIGH';
  } else if (signals.some((s) => s.severity === 'MEDIUM')) {
    highestSignalSeverity = 'MEDIUM';
  } else if (signals.some((s) => s.severity === 'LOW')) {
    highestSignalSeverity = 'LOW';
  }

  return {
    exists: true,
    accountId,
    accountInfo: account,
    riskScore,
    riskLevel,
    highestSignalSeverity,
    signalCount: signals.length,
    signals,
    evaluatedAt: new Date().toISOString(),
  };
}

export default {
  accountExists,
  detectCycles,
  detectSharedDevice,
  detectSharedPhone,
  detectSharedAddress,
  detectSmurfing,
  investigateAccount,
  SIGNAL_CONFIG,
  calculateRiskLevel,
};
