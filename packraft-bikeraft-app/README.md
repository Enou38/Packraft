# packraft-bikeraft-app

Application web pour la gestion de traces GPX de packraft et bikeraft

## Technologies utilisées

- Next.js 14+ (React framework)
- TypeScript
- Tailwind CSS
- Supabase (Base de données, Authentification, Stockage)
- Leaflet / React-Leaflet (Cartes OSM)
- GPXParser (Analyse des fichiers GPX)

## Configuration

1. Copiez le fichier .env.local.example en .env.local et configurez les variables d'environnement
2. Exécutez le script SQL dans l'interface SQL de Supabase pour créer les tables et les politiques de sécurité

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

- `/src/app` - Pages de l'application
- `/src/components` - Composants React réutilisables
- `/src/lib` - Bibliothèques et intégrations
- `/src/utils` - Fonctions utilitaires

## Déploiement

```bash
# Construire l'application pour la production
npm run build

# Démarrer l'application en production
npm start
```
