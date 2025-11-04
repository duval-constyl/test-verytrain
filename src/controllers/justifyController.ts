import { Request, Response } from 'express';
import { TextJustifier } from '../utils/justify';

// Reçoit un texte en plain text et retourne le texte justifié
export const justifyText = (req: Request, res: Response) => {
  try {
    // Récupère le texte depuis la requête
    const text = req.body as string;
    
    // Vérifie que le texte est présent et de type string
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texte invalide' });
    }

    // Utilise la classe TextJustifier pour justifier le texte
    const justifiedText = TextJustifier.justifyText(text);

    // Retourne le texte justifié
    res.type('text/plain').send(justifiedText);
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};