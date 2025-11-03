### API de Justification de Texte

Une API REST qui justifie automatiquement du texte selon les règles typographiques françaises, avec système d'authentification et limitation de débit.

### Fonctionnalités

- Justification de texte à 80 caractères par ligne
- Système d'authentification par token unique
- Rate limiting configurable (80,000 mots / jour par défaut)
- Sans dépendances externes pour l'algorithme de justification
- TypeScript pour une meilleure maintenabilité
- Tests unitaires avec couverture de code
- Déploiement prêt pour les environments cloud

### Démarrage rapide
# Prérequis 
- Node.js, 
- npm / yarn

# Installation
Cloner le repository
```bash
git clone https://github.com/duval-constyl/test-verytrain.git
```
Installer les dépendances
```bash
npm install
```
Développement
```bash
npm run dev
```
Production
```bash
npm run build
npm start
```