import { Request, Response, NextFunction } from 'express';
import { tokenManager } from '../models/token';

// Vérifie la validité du token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
 // Récupère le token depuis les headers Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  // Supporte à la fois "Bearer token" et le token seul
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;

  console.log('Extracted token:', token); // Debug
  console.log('Valid tokens:', Array.from(tokenManager['tokens'].keys())); // Debug
  
  // Vérifie la présence et la validité du token
  if (!token || !tokenManager.validateToken(token)) {
    return res.status(401).json({ error: 'Token invalide ou manquant' });
  }
  
  next();
};

//  Vérifie les quotas d'utilisation
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization as string;
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

  // Récupère le texte depuis le corps de la requête
  const text = req.body as string;

  // Calcule le nombre de mots puis sépare par les espaces et filtre les chaînes vides
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  // Vérifie si le token peut traiter ce nombre de mots
  if (!tokenManager.canUseToken(token, wordCount)) {
    return res.status(402).json({ error: 'Limite quotidienne dépassée' });
  }

  // Incrémente le compteur de mots pour ce token
  tokenManager.incrementWordCount(token, wordCount);
  next();
};