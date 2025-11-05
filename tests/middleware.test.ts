import request from 'supertest';
import app from '../src/app';
import { tokenManager } from '../src/models/token';

describe('Authentication Middleware', () => {
  // Tests pour la limitation de débit
  describe('Rate Limiting', () => {
    let token: string;

    // Configurer avant chaque test
    beforeEach(async () => {

      // Générer un token pour les tests de rate limiting
      const response = await request(app)
        .post('/api/token')
        .send({ email: 'ratelimit@test.com' });
      token = response.body.token;
      
      // Réinitialiser le compteur de mots pour des tests cohérents
      const tokenData = (tokenManager as any).tokens.get(token);
      if (tokenData) {
        tokenData.wordCount = 0;
      }
    });

    // Test pour autorisation des requêtes sous la limite quotidienne
    test('should allow requests under daily limit', async () => {
      const text = "Short text"; // 2 words
      
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', token)
        .set('Content-Type', 'text/plain')
        .send(text);
      
      expect(response.status).toBe(200);
    });

    // Test de refus avec statut 402 quand la limite quotidienne est dépassée
    test('should return 402 when daily limit exceeded', async () => {
      // Création d'un texte long qui dépasse la limite (80 001 mots)
      const longText = "word ".repeat(80001).trim();
      
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', token)
        .set('Content-Type', 'text/plain')
        .send(longText);
      
      expect(response.status).toBe(402);
      expect(response.body).toHaveProperty('error', 'Payment Required');
    });

    // Test pour vérifier le comptage correct des mots
    test('should track word count correctly', async () => {
      const text1 = "First batch of words"; // 4 words
      const text2 = "Second batch"; // 2 mots
      
      // First request
      await request(app)
        .post('/api/justify')
        .set('Authorization', token)
        .set('Content-Type', 'text/plain')
        .send(text1);
      
      // Second request
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', token)
        .set('Content-Type', 'text/plain')
        .send(text2);
      
      expect(response.status).toBe(200);
      
      // Vérifier que le compteur de mots a été correctement incrémenté
      const tokenData = (tokenManager as any).tokens.get(token);
      expect(tokenData.wordCount).toBe(6);
    });

    // Test de gestion correcte des textes avec espaces multiples
    test('should handle text with multiple spaces correctly', async () => {
      const text = "Word1   Word2    Word3"; // 3 mots malgré les espaces multiples
      
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', token)
        .set('Content-Type', 'text/plain')
        .send(text);

      // Vérifier que la requête est acceptée
      expect(response.status).toBe(200);
      
      // Vérifier que seuls 3 mots sont comptés (espaces multiples ignorés)
      const tokenData = (tokenManager as any).tokens.get(token);
      expect(tokenData.wordCount).toBe(3);
    });
  });
});