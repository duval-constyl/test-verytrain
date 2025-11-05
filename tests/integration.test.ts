import request from 'supertest';
import app from '../src/app';
import { tokenManager } from '../src/models/token';

describe('Full Integration Tests', () => {
  
  // Test de flux complet de l'application
  test('complete flow: token -> justify -> rate limit', async () => {
    // Étape 1 : Générer le token
    const tokenResponse = await request(app)
      .post('/api/token')
      .send({ email: 'integration@test.com' });
    
    // Vérifier de la génération du token
    expect(tokenResponse.status).toBe(200);
    const token = tokenResponse.body.token;
    
    // Étape 2 : Utiliser le token pour justifier un texte
    const text = "This is a comprehensive integration test that verifies the complete flow from token generation through text justification and rate limiting functionality.";
    
    const justifyResponse = await request(app)
      .post('/api/justify')
      .set('Authorization', token)
      .set('Content-Type', 'text/plain')
      .send(text);
    
    // Vérifier la justification réussie
    expect(justifyResponse.status).toBe(200);
    expect(justifyResponse.text).toContain('\n'); // Vérifie la présence de sauts de ligne (texte justifié)
    
    // Étape 3 : Vérifier que le rate limiting suit le comptage des mots
    const tokenData = (tokenManager as any).tokens.get(token);
    expect(tokenData.wordCount).toBeGreaterThan(0); // Le compteur doit avoir été incrémenté
    
    // Étape 4 : Test de réutilisation du même token
    const secondJustifyResponse = await request(app)
      .post('/api/justify')
      .set('Authorization', token)
      .set('Content-Type', 'text/plain')
      .send('Another text');
    
    // Vérifier que le token reste valide pour une seconde utilisation
    expect(secondJustifyResponse.status).toBe(200);
  });

  // Test de flux d'erreur avec token invalide
  test('error flow: invalid token -> justify', async () => {
    // Tentative d'utilisation d'un token complètement invalide
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', 'completely-invalid-token')
      .set('Content-Type', 'text/plain')
      .send('Some text');
    
    // Vérifier le rejet avec statut 401 Unauthorized
    expect(response.status).toBe(401);
  });

  // Test de flux multi-utilisateurs
  test('multiple users flow', async () => {
    // Utilisateur 1
    const token1Response = await request(app)
      .post('/api/token')
      .send({ email: 'user1@test.com' });
    const token1 = token1Response.body.token;
    
    // Utilisateur 2  
    const token2Response = await request(app)
      .post('/api/token')
      .send({ email: 'user2@test.com' });
    const token2 = token2Response.body.token;
    
    // Vérifier que les deux utilisateurs peuvent fonctionner indépendamment
    const response1 = await request(app)
      .post('/api/justify')
      .set('Authorization', token1)
      .set('Content-Type', 'text/plain')
      .send('User 1 text');
    
    const response2 = await request(app)
      .post('/api/justify')
      .set('Authorization', token2)
      .set('Content-Type', 'text/plain')
      .send('User 2 text');
    
    // Vérifier que les deux requêtes sont traitées avec succès
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
  });
});