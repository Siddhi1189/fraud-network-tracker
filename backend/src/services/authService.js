import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDriver } from '../config/database.js';

const BCRYPT_WORK_FACTOR = 12;
const DEFAULT_USER_ROLE = 'investigator';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Custom application error with HTTP status code.
 */
export class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Normalizes an email address by trimming whitespace and lowercasing.
 *
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Retrieves and validates the JWT secret from environment configuration.
 * Fails safely if missing or empty — never uses fallback or hardcoded secrets.
 *
 * @returns {string}
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new AuthError('Authentication service configuration error', 500);
  }
  return secret.trim();
}

/**
 * Registers a new application operator user.
 *
 * @param {string} rawEmail
 * @param {string} rawPassword
 * @returns {Promise<{id: string, email: string, role: string, createdAt: string}>}
 */
export async function registerUser(rawEmail, rawPassword) {
  const email = normalizeEmail(rawEmail);

  // 1. Validation
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new AuthError('A valid email address is required.', 400);
  }

  if (!rawPassword || typeof rawPassword !== 'string' || rawPassword.length < 8) {
    throw new AuthError('Password must be at least 8 characters long.', 400);
  }

  const driver = getDriver();
  if (!driver) {
    throw new AuthError('Database service unavailable', 503);
  }

  const session = driver.session();
  try {
    // 2. Existing-user pre-check
    const checkQuery = `
      MATCH (u:User {email: $email})
      RETURN u.id AS id
      LIMIT 1
    `;
    const checkRes = await session.run(checkQuery, { email });
    if (checkRes.records.length > 0) {
      throw new AuthError('An account with this email already exists.', 409);
    }

    // 3. Hash password securely with work factor 12
    const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_WORK_FACTOR);

    // 4. Create User node with secure random UUID and server-defined role
    const userId = `USR-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const role = DEFAULT_USER_ROLE;

    const createQuery = `
      CREATE (u:User {
        id: $id,
        email: $email,
        passwordHash: $passwordHash,
        role: $role,
        createdAt: $createdAt,
        updatedAt: $updatedAt
      })
      RETURN u.id AS id, u.email AS email, u.role AS role, u.createdAt AS createdAt
    `;

    try {
      const createRes = await session.run(createQuery, {
        id: userId,
        email,
        passwordHash,
        role,
        createdAt: now,
        updatedAt: now,
      });

      const record = createRes.records[0].toObject();
      console.log('[Auth] User registered successfully.');
      return {
        id: record.id,
        email: record.email,
        role: record.role,
        createdAt: record.createdAt,
      };
    } catch (dbErr) {
      // Race-condition safety: catch database uniqueness constraint violation
      const msg = (dbErr.message || '').toLowerCase();
      if (
        msg.includes('constraint') ||
        msg.includes('already exists') ||
        dbErr.code === 'Neo.ClientError.Schema.ConstraintValidationFailed'
      ) {
        throw new AuthError('An account with this email already exists.', 409);
      }
      throw dbErr;
    }
  } catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('[Auth] Database error during registration.');
    throw new AuthError('Database service unavailable', 503);
  } finally {
    await session.close();
  }
}

/**
 * Authenticates an application user and issues a stateless JWT.
 *
 * @param {string} rawEmail
 * @param {string} rawPassword
 * @returns {Promise<{token: string, user: {id: string, email: string, role: string}}>}
 */
export async function loginUser(rawEmail, rawPassword) {
  const email = normalizeEmail(rawEmail);

  if (!email || !rawPassword || typeof rawPassword !== 'string') {
    throw new AuthError('Invalid email or password.', 401);
  }

  const driver = getDriver();
  if (!driver) {
    throw new AuthError('Database service unavailable', 503);
  }

  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {email: $email})
      RETURN u.id AS id,
             u.email AS email,
             u.passwordHash AS passwordHash,
             u.role AS role
      LIMIT 1
    `;

    const result = await session.run(query, { email });

    // Generic 401 error message prevents user enumeration
    if (result.records.length === 0) {
      console.log('[Auth] Invalid credentials.');
      throw new AuthError('Invalid email or password.', 401);
    }

    const user = result.records[0].toObject();

    // Verify password against bcrypt hash
    const isValid = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!isValid) {
      console.log('[Auth] Invalid credentials.');
      throw new AuthError('Invalid email or password.', 401);
    }

    // Generate JWT token with minimal payload
    const jwtSecret = getJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, {
      algorithm: 'HS256',
      expiresIn,
    });

    console.log('[Auth] Login successful.');
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('[Auth] Database error during login.');
    throw new AuthError('Database service unavailable', 503);
  } finally {
    await session.close();
  }
}

/**
 * Retrieves the safe profile of an authenticated user by ID.
 *
 * @param {string} userId
 * @returns {Promise<{id: string, email: string, role: string, createdAt: string}>}
 */
export async function getUserProfile(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new AuthError('Invalid user ID', 400);
  }

  const driver = getDriver();
  if (!driver) {
    throw new AuthError('Database service unavailable', 503);
  }

  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {id: $userId})
      RETURN u.id AS id,
             u.email AS email,
             u.role AS role,
             u.createdAt AS createdAt
      LIMIT 1
    `;

    const result = await session.run(query, { userId });
    if (result.records.length === 0) {
      throw new AuthError('User profile not found', 404);
    }

    const user = result.records[0].toObject();
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    console.error('[Auth] Database error during profile retrieval.');
    throw new AuthError('Database service unavailable', 503);
  } finally {
    await session.close();
  }
}

export default {
  registerUser,
  loginUser,
  getUserProfile,
  normalizeEmail,
  getJwtSecret,
  AuthError,
};
