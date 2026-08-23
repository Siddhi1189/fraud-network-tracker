/**
 * Session-only investigation history manager.
 * Stores recent investigation results in browser sessionStorage.
 * Results are generated on demand and are not persisted on the backend.
 */

const STORAGE_KEY = 'fraudnet_recent_investigations';
const MAX_HISTORY = 20;

/**
 * Maps raw backend signal enum to user-friendly label.
 */
export function formatSignalName(signalKey) {
  switch (signalKey) {
    case 'FAN_IN_DISPERSAL':
      return 'Fan-in / Smurfing';
    case 'CIRCULAR_TRANSFER':
      return 'Circular Transfer';
    case 'SHARED_DEVICE':
      return 'Shared Device';
    case 'SHARED_PHONE':
      return 'Shared Phone';
    case 'SHARED_ADDRESS':
      return 'Shared Address';
    default:
      return signalKey || 'No Significant Signal';
  }
}

/**
 * Retrieves list of recently investigated accounts from sessionStorage.
 * @returns {Array} Array of investigation records (newest first)
 */
export function getRecentInvestigations() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[SessionHistory] Failed to parse sessionStorage records:', err);
    return [];
  }
}

/**
 * Records an investigation report into sessionStorage.
 * @param {object} report Real backend investigation response
 */
export function addRecentInvestigation(report) {
  if (!report || !report.accountId) return;

  try {
    const existing = getRecentInvestigations();

    // Determine top signal and signal summary from real response
    let topSignal = 'No Significant Signal';
    let signalsSummary = 'No suspicious signals';

    if (Array.isArray(report.signals) && report.signals.length > 0) {
      // Find highest severity or first signal
      const sorted = [...report.signals].sort((a, b) => (b.weight || 0) - (a.weight || 0));
      topSignal = formatSignalName(sorted[0].signal);

      const count = report.signals.length;
      signalsSummary = `${count} signal${count === 1 ? '' : 's'} detected`;
      
      // If fan-in, mention inbound/outbound if available
      const fanIn = report.signals.find(s => s.signal === 'FAN_IN_DISPERSAL');
      if (fanIn?.evidence) {
        const inCount = fanIn.evidence.inboundCount || 0;
        const outCount = fanIn.evidence.outboundCount || 0;
        signalsSummary = `${inCount} inbound / ${outCount} outbound`;
      } else if (report.signals.some(s => s.signal === 'CIRCULAR_TRANSFER')) {
        signalsSummary = 'Cycle routing detected';
      }
    } else if (report.accountInfo?.isFlagged === false && report.riskScore === 0) {
      topSignal = 'Low Activity';
      signalsSummary = 'Normal activity profile';
    }

    const newRecord = {
      accountId: report.accountId,
      riskScore: typeof report.riskScore === 'number' ? report.riskScore : 0,
      riskLevel: report.riskLevel || 'LOW',
      topSignal,
      signalCount: typeof report.signalCount === 'number' ? report.signalCount : (report.signals?.length || 0),
      signalsSummary,
      evaluatedAt: report.evaluatedAt || null,
      timestamp: new Date().toISOString(), // Client session timestamp
    };

    // Filter out previous entry for the same account ID to move it to the top
    const filtered = existing.filter((item) => item.accountId !== report.accountId);
    const updated = [newRecord, ...filtered].slice(0, MAX_HISTORY);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch event so all listening components update reactively
    window.dispatchEvent(new CustomEvent('fraudnet_history_updated'));
  } catch (err) {
    console.warn('[SessionHistory] Failed to save record to sessionStorage:', err);
  }
}

/**
 * Clears all investigation records from sessionStorage.
 */
export function clearRecentInvestigations() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('fraudnet_history_updated'));
  } catch (err) {
    console.warn('[SessionHistory] Failed to clear sessionStorage:', err);
  }
}

/**
 * Calculates a clean relative time string from a client session ISO timestamp.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';

  try {
    const past = new Date(isoString).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - past) / 1000));

    if (diffSeconds < 45) return 'Just now';
    if (diffSeconds < 90) return '1 min ago';

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
}

/**
 * Formats ISO timestamp to local readable date and time.
 */
export function formatLocalDateTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export default {
  getRecentInvestigations,
  addRecentInvestigation,
  clearRecentInvestigations,
  formatSignalName,
  formatRelativeTime,
  formatLocalDateTime,
};
