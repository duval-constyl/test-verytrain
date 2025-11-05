import { TokenManager, Token } from '../src/models/token';

describe('Token Manager', () => {
  let tokenManager: TokenManager;

  // Réinitialiser le gestionnaire avant chaque test
  beforeEach(() => {
    tokenManager = new TokenManager();
  });

  // Tests pour la génération de tokens
  describe('generateToken', () => {
    test('should generate unique token for email', () => {
      // Générer deux tokens pour deux emails différents
      const token1 = tokenManager.generateToken('test1@example.com');
      const token2 = tokenManager.generateToken('test2@example.com');
      
      // Vérifier la base sur les tokens générés
      expect(token1).toBeDefined(); 
      expect(token2).toBeDefined(); 
      expect(token1).not.toBe(token2);
      expect(typeof token1).toBe('string');
      expect(token1.length).toBeGreaterThan(10);
    });

    test('should store token with correct data', () => {
      const email = 'test@example.com';
      const token = tokenManager.generateToken(email);
      
      // Accès direct à la structure interne pour vérification
      const tokens = (tokenManager as any).tokens;
      const tokenData: Token = tokens.get(token);
      
      // Vérifier toutes les propriétés du token stocké
      expect(tokenData).toBeDefined();
      expect(tokenData.email).toBe(email);
      expect(tokenData.value).toBe(token); 
      expect(tokenData.wordCount).toBe(0);
      expect(tokenData.createdAt).toBeInstanceOf(Date);
      expect(tokenData.lastReset).toBeInstanceOf(Date);
    });
  });

  // Tests pour la validation de tokens
  describe('validateToken', () => {
    test('should return true for valid token', () => {
      // Créer un token valide
      const token = tokenManager.generateToken('test@example.com');
      const isValid = tokenManager.validateToken(token);
      
      expect(isValid).toBe(true); // Le token valide doit être accepté
    });

    test('should return false for invalid token', () => {
      // Test avec un token invalide
      const isValid = tokenManager.validateToken('invalid-token');
      
      expect(isValid).toBe(false); // Le token invalide doit être rejeté
    });

    test('should return false for empty token', () => {
      // Test avec un token vide
      const isValid = tokenManager.validateToken('');
      
      expect(isValid).toBe(false); // Le token vide doit être rejeté
    });
  });

  // Tests pour vérifier utilisation (rate limiting)
  describe('canUseToken', () => {
    test('should allow usage under limit', () => {
      const token = tokenManager.generateToken('test@example.com');
      // Test avec 1000 mots (sous la limite de 80k)
      const canUse = tokenManager.canUseToken(token, 1000);
      
      expect(canUse).toBe(true); // L'usage doit être autorisé
    });

    test('should deny usage over limit', () => {
      const token = tokenManager.generateToken('test@example.com');
      // Test avec 90k mots (au-dessus de la limite de 80k)
      const canUse = tokenManager.canUseToken(token, 90000);
      
      expect(canUse).toBe(false); // L'usage doit être refusé
    });

    test('should return false for invalid token', () => {
      // Test avec un token invalide
      const canUse = tokenManager.canUseToken('invalid-token', 1000);
      
      expect(canUse).toBe(false); // Doit retourner false pour token invalide
    });

    test('should reset word count on new day', () => {
      const token = tokenManager.generateToken('test@example.com');
      const tokens = (tokenManager as any).tokens;
      const tokenData: Token = tokens.get(token);
      
      // Simulation d'un jour précédent en modifiant la date de reset
      tokenData.lastReset = new Date(Date.now() - 24 * 60 * 60 * 1000); // Hier
      tokenData.wordCount = 80000; // Limite atteinte le jour précédent
      
      // Test d'utilisation le jour suivant
      const canUse = tokenManager.canUseToken(token, 1000);
      
      expect(canUse).toBe(true); // Doit autoriser car reset quotidien
      expect(tokenData.wordCount).toBe(0); // Le compteur doit être réinitialisé
    });
  });

  // Tests pour incrémenter du compteur de mots
  describe('incrementWordCount', () => {
    test('should increment word count for valid token', () => {
      const token = tokenManager.generateToken('test@example.com');
      const tokens = (tokenManager as any).tokens;
      const tokenData: Token = tokens.get(token);
      
      // Incrémenter 500 mots
      tokenManager.incrementWordCount(token, 500);
      
      expect(tokenData.wordCount).toBe(500); // Le compteur doit être à 500
    });

    test('should not increment for invalid token', () => {
      const token = tokenManager.generateToken('test@example.com');
      const tokens = (tokenManager as any).tokens;
      const tokenData: Token = tokens.get(token);
      const initialCount = tokenData.wordCount; // Sauvegarde du compteur initial
      
      // Tentative d'incrémentation avec token invalide
      tokenManager.incrementWordCount('invalid-token', 500);
      
      expect(tokenData.wordCount).toBe(initialCount); // Le compteur ne doit pas changer
    });

    test('should handle multiple increments', () => {
      const token = tokenManager.generateToken('test@example.com');
      
      // Incrémentations multiples
      tokenManager.incrementWordCount(token, 100);
      tokenManager.incrementWordCount(token, 200);
      tokenManager.incrementWordCount(token, 300);
      
      const tokens = (tokenManager as any).tokens;
      const tokenData: Token = tokens.get(token);
      
      expect(tokenData.wordCount).toBe(600);
    });
  });
});