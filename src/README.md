# API de Justification de Texte

Une API REST qui justifie automatiquement du texte selon les règles typographiques françaises, avec système d'authentification et limitation de débit.

# Fonctionnalités

- Justification de texte à 80 caractères par ligne
- Système d'authentification par token unique
- Rate limiting configurable (80,000 mots / jour par défaut)
- Sans dépendances externes pour l'algorithme de justification
- TypeScript pour une meilleure maintenabilité
- Tests unitaires avec couverture de code
- Containerisation Docker pour un déploiement facile
- Déploiement prêt pour les environments cloud

# Démonstration

L'API est déployée et accessible à l'adresse :
```bash 
https://test-verytrain.onrender.com 
```
### Exemple d'utilisation :
```bash 
# Obtenir un token
curl -X POST https://test-verytrain.onrender.com/api/token \
  -H "Content-Type: application/json" \
  -d '{"email":"votre@email.com"}'

# Justifier un texte (remplacez TOKEN par votre token)
curl -X POST https://test-verytrain.onrender.com/api/justify \
  -H "Authorization: VOTRE_TOKEN" \
  -H "Content-Type: text/plain" \
  -d "Votre texte à justifier ici..."
```

# Démarrage rapide
### Prérequis 
- Node.js, 
- npm / yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/duval-constyl/test-verytrain.git
cd test-verytrain

# Installer les dépendances
npm install

# Développement (avec rechargement automatique)
npm run dev

# Production
npm run build
npm start
```
# Déploiement avec Docker

### Construction et exécution
```bash
# Build l'image
docker build -t justify-api .

# Lancer le conteneur
docker run -p 3000:3000 justify-api

# Avec docker-compose
docker-compose up -d
```

# API Documentation

### Base URL
```bash
https://test-verytrain.onrender.com/api
```

### Endpoints
1. Obtenir un token d'authentification
Endpoint: POST /api/token
Body:
```bash
{
  "email": "foo@bar.com"
}
```

Response:
```bash
{
   "token": "abc123def456ghi789"
}
```

2. Justifier un texte
Endpoint: POST /api/justify
Headers:
```bash
Authorization: abc123def456ghi789
Content-Type: text/plain
```

Body: Votre texte à justifier
Response: Texte justifié (content-type: text/plain)
Exemple:
```text
Input:  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
Output: "Lorem  ipsum  dolor  sit  amet,  consectetur  adipiscing  elit."
```

# Tests

### Exécution des tests
```bash
# Tous les tests
npm test

# Tests avec rechargement automatique
npm run test:watch

# Rapport de couverture
npm run test:coverage

# Tests en mode verbeux
npm run test:verbose
```

### Tests avec Docker
```bash
# Lancer les tests dans un conteneur
docker-compose up justify-api-test
```

# Structure du projet
```text
test-verytrain/
├── src/
│   ├── controllers/          # Contrôleurs des endpoints
│   │   ├── justifyController.ts
│   │   └── tokenController.ts
│   ├── middleware/           # Middlewares Express
│   │   └── auth.ts
│   ├── models/              # Modèles de données
│   │   └── token.ts
│   ├── routes/              # Définition des routes
│   │   └── index.ts
│   ├── utils/               # Utilitaires
│   │   └── justify.ts       # Algorithme de justification
│   └── app.ts              # Application principale
├── tests/                   # Tests unitaires
│   └── justify.test.ts
├── Dockerfile              # Configuration Docker production
├── Dockerfile.dev          # Configuration Docker développement
├── docker-compose.yml      # Orchestration Docker
├── jest.config.js          # Configuration Jest
├── tsconfig.json           # Configuration TypeScript
└── package.json
```