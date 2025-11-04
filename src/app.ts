import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le texte brut et JSON
app.use(express.text({ type: 'text/plain' }));
app.use(express.json());
app.use('/api', routes); // Routes de l'API préfixées par /api

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;