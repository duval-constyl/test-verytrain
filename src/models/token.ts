export interface Token {
  value: string;
  email: string;
  createdAt: Date;
  wordCount: number;
  lastReset: Date;
}

// Gestionnaire des tokens d'authentification
export class TokenManager {
  // Stocke les tokens en mémoire
  private tokens: Map<string, Token> = new Map();

  // Nombre limite de token par jour
  private readonly DAILY_LIMIT = 80000;

  generateToken(email: string): string {
    // Génére un token unique combinant random et timestamp
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.tokens.set(token, {
      value: token,
      email,
      createdAt: new Date(),
      wordCount: 0,
      lastReset: new Date()
    });
    console.log('Token generated:', token); // Debug
    console.log('Total tokens stored:', this.tokens.size); // Debug
    return token;
  }

  // Vérifie si un token existe et est valide
  validateToken(token: string): boolean {
    const isValid = this.tokens.has(token);
    console.log('Token validation:', token, '->', isValid); // Debug
    return isValid;
  }

  // Vérifie si un token peut traiter un certain nombre de mots
  canUseToken(token: string, wordCount: number): boolean {
    const tokenData = this.tokens.get(token);
    if (!tokenData) return false;

    this.resetIfNeeded(tokenData);

    // Vérifie si l'ajout des mots ne dépasse pas la limite quotidienne
    return tokenData.wordCount + wordCount <= this.DAILY_LIMIT;
  }

  // Incrémente le compteur de mots pour un token
  incrementWordCount(token: string, wordCount: number): void {
    const tokenData = this.tokens.get(token);
    if (tokenData) {
      tokenData.wordCount += wordCount;
    }
  }

  // Réinitialise le compteur de mots si un nouveau jour est détecté
  private resetIfNeeded(tokenData: Token): void {
    const now = new Date();
    if (now.toDateString() !== tokenData.lastReset.toDateString()) {
      tokenData.wordCount = 0;
      tokenData.lastReset = now;
    }
  }
}

// Exporte une instance unique
export const tokenManager = new TokenManager();