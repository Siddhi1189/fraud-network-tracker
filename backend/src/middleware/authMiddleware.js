import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../services/authService.js';

/**
 * Authentication Middleware
 * Validates the stateless JWT bearer token in the Authorization header.
 * Attaches safe user identity { id, email, role } to req.user upon successful verification.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid authorization format. Expected "Bearer <token>"' });
  }

  const token = parts[1];
  if (!token || token.trim().length === 0) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export default authenticateToken;
