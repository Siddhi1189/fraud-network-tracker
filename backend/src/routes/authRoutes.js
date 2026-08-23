import express from 'express';
import { registerUser, loginUser, getUserProfile, AuthError } from '../services/authService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Public endpoint to register a new application operator account.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await registerUser(email, password);
    return res.status(201).json({ user });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('[Auth Route] Unexpected registration error:', err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * POST /api/auth/login
 * Public endpoint to authenticate and receive a stateless JWT token.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('[Auth Route] Unexpected login error:', err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

/**
 * GET /api/auth/me
 * Protected endpoint returning the profile of the authenticated operator.
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({ user });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('[Auth Route] Unexpected profile retrieval error:', err.message);
    return res.status(503).json({ error: 'Database service unavailable' });
  }
});

export default router;
