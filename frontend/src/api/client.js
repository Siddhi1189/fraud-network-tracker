/**
 * Centralized API client for FraudNet Tracker frontend.
 * Interacts with backend authentication, fraud detection, and health endpoints.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Custom API error with HTTP status and user-friendly message.
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Helper to build query string from options object.
 */
function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  }
  const str = query.toString();
  return str ? `?${str}` : '';
}

/**
 * Generic request helper with JSON parsing and authentication headers.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('fraudnet_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMessage =
        (data && typeof data === 'object' && data.error) ||
        (res.status === 401
          ? 'Your session has expired. Please sign in again.'
          : res.status === 404
          ? 'Account not found.'
          : res.status === 503
          ? 'Service temporarily unavailable. Please try again.'
          : `Request failed with status ${res.status}`);

      throw new ApiError(errorMessage, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network or offline error
    throw new ApiError('Unable to connect to the server. Please check your network connection.', 0);
  }
}

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Log in with email and password
   */
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register a new user
   */
  async register(email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Fetch current authenticated operator profile
   */
  async getMe() {
    return request('/auth/me', {
      method: 'GET',
    });
  },
};

/**
 * Fraud Detection API endpoints
 */
export const fraudApi = {
  /**
   * Run comprehensive multi-signal investigation for an account
   * @param {string} accountId
   * @param {object} options
   */
  async investigate(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/investigate/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Detect circular fund transfers for an account
   */
  async detectCycles(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/detect-cycles/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Detect shared hardware devices for an account
   */
  async detectSharedDevice(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/shared-device/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Detect shared phone numbers for an account
   */
  async detectSharedPhone(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/shared-phone/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Detect shared addresses for an account
   */
  async detectSharedAddress(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/shared-address/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Detect fan-in and rapid dispersal smurfing patterns for an account
   */
  async detectSmurfing(accountId, options = {}) {
    const qs = buildQueryString(options);
    return request(`/fraud/smurfing/${encodeURIComponent(accountId)}${qs}`, {
      method: 'GET',
    });
  },
};

/**
 * Health check endpoint
 */
export const healthApi = {
  async checkHealth() {
    return request('/health', {
      method: 'GET',
    });
  },
};

export default {
  auth: authApi,
  fraud: fraudApi,
  health: healthApi,
};
