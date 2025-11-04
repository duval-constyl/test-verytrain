// src/routes/index.ts
import { Router } from 'express';
import { generateToken } from '../controllers/tokenController';
import { justifyText } from '../controllers/justifyController';
import { authenticateToken, rateLimit } from '../middleware/auth';

const router = Router();

router.post('/token', generateToken); // Route pour générer un token

// Route pour justifier un texte
router.post('/justify', authenticateToken, rateLimit, justifyText);

export default router;