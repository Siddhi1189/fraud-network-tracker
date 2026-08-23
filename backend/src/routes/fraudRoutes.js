import express from 'express';
import {
  accountExists,
  detectCycles,
  detectSharedDevice,
  detectSharedPhone,
  detectSharedAddress,
  detectSmurfing,
  investigateAccount,
} from '../services/fraudDetectionService.js';

const router = express.Router();

/**
 * Validates the account ID parameter format.
 */
function validateAccountId(req, res, next) {
  const accountId = req.params.id;
  if (!accountId || typeof accountId !== 'string' || accountId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid account ID format' });
  }
  req.accountId = accountId.trim();
  next();
}

/**
 * GET /api/fraud/detect-cycles/:id
 * Analyzes circular fund transfers for an account.
 */
router.get('/detect-cycles/:id', validateAccountId, async (req, res) => {
  try {
    const { exists, account } = await accountExists(req.accountId);
    if (!exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const options = {};
    if (req.query.maxCycleWindowHours) {
      const parsed = parseFloat(req.query.maxCycleWindowHours);
      if (!isNaN(parsed) && parsed > 0) options.maxCycleWindowHours = parsed;
    }

    const result = await detectCycles(req.accountId, options);
    return res.status(200).json({
      accountId: req.accountId,
      accountNumber: account?.accountNumber,
      detected: result.detected,
      cycleCount: result.cycles.length,
      cycles: result.cycles,
    });
  } catch (err) {
    console.error(`[Fraud API] Cycle detection error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/fraud/shared-device/:id
 * Identifies devices shared by the target account with other accounts.
 */
router.get('/shared-device/:id', validateAccountId, async (req, res) => {
  try {
    const { exists, account } = await accountExists(req.accountId);
    if (!exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const options = {};
    if (req.query.minAccountThreshold) {
      const parsed = parseInt(req.query.minAccountThreshold, 10);
      if (!isNaN(parsed) && parsed > 0) options.minAccountThreshold = parsed;
    }

    const result = await detectSharedDevice(req.accountId, options);
    return res.status(200).json({
      accountId: req.accountId,
      accountNumber: account?.accountNumber,
      detected: result.detected,
      sharedDeviceCount: result.sharedDevices.length,
      sharedDevices: result.sharedDevices,
    });
  } catch (err) {
    console.error(`[Fraud API] Shared device error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/fraud/shared-phone/:id
 * Identifies phone numbers shared across multiple persons and their accounts.
 */
router.get('/shared-phone/:id', validateAccountId, async (req, res) => {
  try {
    const { exists, account } = await accountExists(req.accountId);
    if (!exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const options = {};
    if (req.query.minPersonThreshold) {
      const parsed = parseInt(req.query.minPersonThreshold, 10);
      if (!isNaN(parsed) && parsed > 0) options.minPersonThreshold = parsed;
    }

    const result = await detectSharedPhone(req.accountId, options);
    return res.status(200).json({
      accountId: req.accountId,
      accountNumber: account?.accountNumber,
      detected: result.detected,
      sharedPhoneCount: result.sharedPhones.length,
      sharedPhones: result.sharedPhones,
    });
  } catch (err) {
    console.error(`[Fraud API] Shared phone error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/fraud/shared-address/:id
 * Identifies addresses shared across multiple registered persons and their accounts.
 */
router.get('/shared-address/:id', validateAccountId, async (req, res) => {
  try {
    const { exists, account } = await accountExists(req.accountId);
    if (!exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const options = {};
    if (req.query.minPersonThreshold) {
      const parsed = parseInt(req.query.minPersonThreshold, 10);
      if (!isNaN(parsed) && parsed > 0) options.minPersonThreshold = parsed;
    }

    const result = await detectSharedAddress(req.accountId, options);
    return res.status(200).json({
      accountId: req.accountId,
      accountNumber: account?.accountNumber,
      detected: result.detected,
      sharedAddressCount: result.sharedAddresses.length,
      sharedAddresses: result.sharedAddresses,
    });
  } catch (err) {
    console.error(`[Fraud API] Shared address error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/fraud/smurfing/:id
 * Evaluates fan-in fund aggregation and subsequent rapid dispersal behavior.
 */
router.get('/smurfing/:id', validateAccountId, async (req, res) => {
  try {
    const { exists, account } = await accountExists(req.accountId);
    if (!exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const options = {};
    if (req.query.minInboundCount) {
      const parsed = parseInt(req.query.minInboundCount, 10);
      if (!isNaN(parsed) && parsed > 0) options.minInboundCount = parsed;
    }
    if (req.query.maxInboundWindowHours) {
      const parsed = parseFloat(req.query.maxInboundWindowHours);
      if (!isNaN(parsed) && parsed > 0) options.maxInboundWindowHours = parsed;
    }
    if (req.query.maxDispersalDelayHours) {
      const parsed = parseFloat(req.query.maxDispersalDelayHours);
      if (!isNaN(parsed) && parsed > 0) options.maxDispersalDelayHours = parsed;
    }

    const result = await detectSmurfing(req.accountId, options);
    return res.status(200).json({
      accountId: req.accountId,
      accountNumber: account?.accountNumber,
      detected: result.detected,
      smurfingPattern: result.smurfingPattern,
    });
  } catch (err) {
    console.error(`[Fraud API] Smurfing detection error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/fraud/investigate/:id
 * Runs comprehensive multi-signal fraud investigation aggregating all 5 detectors.
 */
router.get('/investigate/:id', validateAccountId, async (req, res) => {
  try {
    const options = {};
    if (req.query.maxCycleWindowHours) {
      const parsed = parseFloat(req.query.maxCycleWindowHours);
      if (!isNaN(parsed) && parsed > 0) options.maxCycleWindowHours = parsed;
    }
    if (req.query.minAccountThreshold) {
      const parsed = parseInt(req.query.minAccountThreshold, 10);
      if (!isNaN(parsed) && parsed > 0) options.minAccountThreshold = parsed;
    }
    if (req.query.minPersonThreshold) {
      const parsed = parseInt(req.query.minPersonThreshold, 10);
      if (!isNaN(parsed) && parsed > 0) options.minPersonThreshold = parsed;
    }
    if (req.query.minInboundCount) {
      const parsed = parseInt(req.query.minInboundCount, 10);
      if (!isNaN(parsed) && parsed > 0) options.minInboundCount = parsed;
    }
    if (req.query.maxInboundWindowHours) {
      const parsed = parseFloat(req.query.maxInboundWindowHours);
      if (!isNaN(parsed) && parsed > 0) options.maxInboundWindowHours = parsed;
    }
    if (req.query.maxDispersalDelayHours) {
      const parsed = parseFloat(req.query.maxDispersalDelayHours);
      if (!isNaN(parsed) && parsed > 0) options.maxDispersalDelayHours = parsed;
    }

    const report = await investigateAccount(req.accountId, options);
    if (!report.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json(report);
  } catch (err) {
    console.error(`[Fraud API] Investigation error for ${req.accountId}:`, err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

export default router;
