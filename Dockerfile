# Étape de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Installer toutes les dépendances
RUN npm ci

# Copier le code source
COPY src/ ./src/
COPY tests/ ./tests/

# Exécuter les tests
RUN npm test

# Builder l'application
RUN npm run build

# Étape de production
FROM node:18-alpine AS production

WORKDIR /app

# Installer uniquement les dépendances de production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier les fichiers compilés
COPY --from=builder /app/dist ./dist

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Donner les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/token', (res) => { process.exit(res.statusCode === 405 ? 0 : 1) })"

# Commande de démarrage
CMD ["node", "dist/app.js"]