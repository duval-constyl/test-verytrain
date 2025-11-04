import { Request, Response } from 'express';
import { tokenManager } from '../models/token';

// Reçoit un email et retourne un token unique
export const generateToken = (req: Request, res: Response) => {
  try {
    // Récupère le mail depuis la requête
    const { email } = req.body;
    
    // Vérifie que ça respecte le format d'un mail
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Génère et stocke un token unique associé à l'email
    const token = tokenManager.generateToken(email);

    // Retourne le token au format JSON
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};