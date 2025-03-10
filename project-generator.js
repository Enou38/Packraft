// simple-generator.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration du projet
const projectConfig = {
  name: 'packraft-bikeraft-app',
  description: 'Application web pour la gestion de traces GPX de packraft et bikeraft',
  supabaseUrl: 'https://mhkpryzngkucfcgfqhms.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3ByeXpuZ2t1Y2ZjZ2ZxaG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjExMDQsImV4cCI6MjA1NzEzNzEwNH0.hktzmaqi8UkXRuCA5FyTSUJpmeS-315rlUYXsAY7duM'
};

console.log('🚀 Création du projet Packraft/Bikeraft\n');

const projectDir = path.join(process.cwd(), projectConfig.name);

// Créer le répertoire du projet s'il n'existe pas
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
  console.log(`📁 Répertoire du projet créé: ${projectDir}`);
} else {
  console.log(`⚠️ Le répertoire ${projectDir} existe déjà. Continuation dans ce répertoire.`);
}

process.chdir(projectDir);

try {
  // Initialiser un projet Next.js
  console.log('📦 Initialisation du projet Next.js...');
  execSync('npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --no-git', { stdio: 'inherit' });

  // Installer les dépendances supplémentaires
  console.log('📦 Installation des dépendances supplémentaires...');
  execSync('npm install @supabase/supabase-js @supabase/auth-helpers-nextjs leaflet react-leaflet @types/leaflet gpxparser next-auth', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/react-leaflet', { stdio: 'inherit' });

  // Créer les répertoires nécessaires
  const directories = [
    'src/app/(auth)/login',
    'src/app/(auth)/register',
    'src/app/(auth)/profile',
    'src/app/admin',
    'src/app/traces',
    'src/app/traces/[id]',
    'src/app/carte',
    'src/app/recherche',
    'src/app/api/auth',
    'src/app/api/traces',
    'src/app/api/upload',
    'src/components/auth',
    'src/components/layout',
    'src/components/map',
    'src/components/traces',
    'src/components/ui',
    'src/components/forms',
    'src/lib/supabase',
    'src/lib/gpx',
    'src/utils',
    'src/types',
    'src/hooks',
    'public/icons',
    'supabase/migrations'
  ];

  console.log('📁 Création de la structure des répertoires...');
  directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  // Créer le fichier .env.local.example
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=${projectConfig.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${projectConfig.supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=votre-jwt-secret-secure-aleatoire
`;

  fs.writeFileSync('.env.local.example', envContent);
  console.log('📄 Fichier .env.local.example créé');

  // Créer le fichier README.md avec des instructions
  const readmeContent = `# ${projectConfig.name}

${projectConfig.description}

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

\`\`\`bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

## Structure du projet

- \`/src/app\` - Pages de l'application
- \`/src/components\` - Composants React réutilisables
- \`/src/lib\` - Bibliothèques et intégrations
- \`/src/utils\` - Fonctions utilitaires

## Déploiement

\`\`\`bash
# Construire l'application pour la production
npm run build

# Démarrer l'application en production
npm start
\`\`\`
`;

  fs.writeFileSync('README.md', readmeContent);
  console.log('📄 Fichier README.md créé');

  // Créer un fichier supabase-schema.sql
  const schemaPath = path.join(projectDir, 'supabase-schema.sql');
  fs.writeFileSync(schemaPath, `-- Table des utilisateurs (extension de la table auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  pseudo VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des traces GPX
CREATE TABLE public.traces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  difficulte VARCHAR(50), -- Classe 1,2,3,4,5
  temps_descente VARCHAR(100),
  point_depart VARCHAR(255),
  point_arrivee VARCHAR(255),
  stations_hydro TEXT[],
  categorie VARCHAR(50), -- Packraft/Bikeraft
  region VARCHAR(100),
  departement VARCHAR(100),
  file_path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.profiles(id),
  is_featured BOOLEAN DEFAULT false,
  coordinates JSONB
);

-- Table des navigations (journal des descentes)
CREATE TABLE public.navigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id UUID REFERENCES public.traces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  date_navigation DATE NOT NULL,
  pseudo VARCHAR(255),
  temp_air DECIMAL(5,2),
  temp_eau DECIMAL(5,2),
  description TEXT,
  debit DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des photos
CREATE TABLE public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id UUID REFERENCES public.traces(id) ON DELETE CASCADE,
  navigation_id UUID REFERENCES public.navigations(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.profiles(id)
);

-- Triggers pour mettre à jour les champs updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_traces_updated_at
BEFORE UPDATE ON public.traces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Politiques de sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Les utilisateurs peuvent voir tous les profils"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politiques pour traces
CREATE POLICY "Tout le monde peut voir les traces"
  ON public.traces FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des traces"
  ON public.traces FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les admin peuvent modifier toutes les traces"
  ON public.traces FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Les admin peuvent supprimer toutes les traces"
  ON public.traces FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Politiques pour navigations
CREATE POLICY "Tout le monde peut voir les navigations"
  ON public.navigations FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des navigations"
  ON public.navigations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres navigations"
  ON public.navigations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Les admin peuvent modifier toutes les navigations"
  ON public.navigations FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Politiques pour photos
CREATE POLICY "Tout le monde peut voir les photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des photos"
  ON public.photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les admin peuvent modifier ou supprimer les photos"
  ON public.photos FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Les admin peuvent supprimer les photos"
  ON public.photos FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
`);
  console.log('📄 Fichier supabase-schema.sql créé');

  // Créer un fichier de base pour client Supabase
  const supabaseClientPath = path.join(projectDir, 'src/lib/supabase/client.ts');
  fs.writeFileSync(supabaseClientPath, `import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
`);
  console.log('📄 Fichier client Supabase créé');

  // Créer un fichier de types de base
  const typesPath = path.join(projectDir, 'src/types/index.ts');
  fs.writeFileSync(typesPath, `export interface Profile {
  id: string;
  nom?: string;
  prenom?: string;
  pseudo?: string;
  email?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Trace {
  id: string;
  titre: string;
  description?: string;
  difficulte?: string; // Classe 1,2,3,4,5
  temps_descente?: string;
  point_depart?: string;
  point_arrivee?: string;
  stations_hydro?: string[];
  categorie: 'Packraft' | 'Bikeraft';
  region?: string;
  departement?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_featured: boolean;
  coordinates?: any; // Coordonnées GPX en format JSON
}

export interface Navigation {
  id: string;
  trace_id: string;
  user_id: string;
  date_navigation: string;
  pseudo?: string;
  temp_air?: number;
  temp_eau?: number;
  description?: string;
  debit?: number;
  created_at: string;
}

export interface Photo {
  id: string;
  trace_id?: string;
  navigation_id?: string;
  file_path: string;
  description?: string;
  created_at: string;
  user_id: string;
}

export type DifficulteClass = '1' | '2' | '3' | '4' | '5';
`);
  console.log('📄 Fichier de types créé');

  // Créer un fichier layout de base
  const layoutPath = path.join(projectDir, 'src/app/layout.tsx');
  fs.writeFileSync(layoutPath, `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Packraft & Bikeraft - Traces GPX',
  description: 'Base de données parcours dédiée au packraft et bikeraft',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Packraft & Bikeraft</h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto">
              <p>© {new Date().getFullYear()} - Application Packraft & Bikeraft</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
`);
  console.log('📄 Fichier layout de base créé');

  // Créer une page d'accueil simple
  const homepagePath = path.join(projectDir, 'src/app/page.tsx');
  fs.writeFileSync(homepagePath, `export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenue sur Packraft & Bikeraft</h1>
      <p className="text-lg">
        Explorez et partagez vos parcours de packraft et bikeraft. 
        Cette application vous permet de gérer des traces GPX avec descriptions, 
        niveaux de difficulté, et bien plus encore.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Parcours</h2>
          <p>Explorez les parcours existants ou ajoutez les vôtres.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Carte</h2>
          <p>Visualisez tous les parcours sur une carte interactive.</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Recherche</h2>
          <p>Trouvez des parcours par région ou département.</p>
        </div>
      </div>
    </div>
  );
}
`);
  console.log('📄 Page d\'accueil créée');

  console.log('\n✅ Structure de base du projet créée avec succès!');
  console.log('\nPour continuer le développement:');
  console.log('1. Créez un fichier .env.local à partir du fichier .env.local.example');
  console.log('2. Configurez votre base de données Supabase en utilisant le script SQL fourni');
  console.log('3. Développez les composants et les pages restantes selon vos besoins');
  console.log('\nPour démarrer le serveur de développement:');
  console.log('cd ' + projectConfig.name);
  console.log('npm run dev');

} catch (error) {
  console.error('❌ Une erreur est survenue lors de la création du projet:', error);
}