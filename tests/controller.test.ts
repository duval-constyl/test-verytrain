import request from 'supertest';
import app from '../src/app';

describe('API Controllers', () => {
  // Tests pour l'endpoint de génération de token
  describe('POST /api/token', () => {

    // Test de génération d'un token pour un email valide
    test('should generate token for valid email', async () => {
      const response = await request(app)
        .post('/api/token')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(10);
    });

    // Test d'erreur 400 pour format d'email invalide
    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/token')
        .send({ email: 'invalid-email' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email invalide');
    });

    // Test d'erreur 400 pour email manquant
    test('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/token')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email invalide');
    });

    // Test d'erreur 400 pour email non-string
    test('should return 400 for non-string email', async () => {
      const response = await request(app)
        .post('/api/token')
        .send({ email: 12345 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email invalide');
    });

    // Test de génération de tokens différents pour emails différents
    test('should generate different tokens for different emails', async () => {
      const response1 = await request(app)
        .post('/api/token')
        .send({ email: 'test1@example.com' });
      
      const response2 = await request(app)
        .post('/api/token')
        .send({ email: 'test2@example.com' });
      
      expect(response1.body.token).not.toBe(response2.body.token);
    });
  });

  describe('POST /api/justify', () => {
    let validToken: string;

    beforeEach(async () => {
      // Get a valid token before each test
      const response = await request(app)
        .post('/api/token')
        .send({ email: 'test@example.com' });
      validToken = response.body.token;
    });

    // Test : Justification de texte avec token valide
    test('should justify text with valid token', async () => {
      const text = "This is a test text that should be justified properly when sent to the API endpoint.";
      
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', validToken)
        .set('Content-Type', 'text/plain')
        .send(text);
      
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toContain('\n');
      
      // Vérifier la longueur des lignes (justification à 80 caractères)
      const lines = response.text.split('\n');
      lines.forEach(line => {
        if (line.length > 0) {
          expect(line.length).toBeLessThanOrEqual(80);
        }
      });
    });

    // Test d'erreur 401 sans en-tête d'autorisation
    test('should return 401 without authorization header', async () => {
      const response = await request(app)
        .post('/api/justify')
        .set('Content-Type', 'text/plain')
        .send('Test text');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token manquant');
    });

    // Test d'erreur 401 avec token invalide
    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', 'invalid-token-123')
        .set('Content-Type', 'text/plain')
        .send('Test text');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token invalide ou manquant');
    });

    // Test d'erreur 400 pour texte vide
    test('should return 400 for empty text', async () => {
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', validToken)
        .set('Content-Type', 'text/plain')
        .send('');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Texte invalide');
    });

    // Test d'erreur 400 pour texte non-string
    test('should return 400 for non-string text', async () => {
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', validToken)
        .set('Content-Type', 'text/plain')
        .send({ text: 'not a string' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Texte invalide');
    });

    // Test de gestion du format Bearer token
    test('should handle Bearer token format', async () => {
      const response = await request(app)
        .post('/api/justify')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'text/plain')
        .send('Test text with bearer token');
      
      expect(response.status).toBe(200);
    });
  });
});