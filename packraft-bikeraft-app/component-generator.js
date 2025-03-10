// component-generator.js
// Exécuter avec: node component-generator.js
// Ce script doit être exécuté après le simple-generator.js, dans le même dossier du projet

const fs = require('fs');
const path = require('path');

// Définir le répertoire du projet
const projectDir = path.join(process.cwd());
console.log(`Génération des composants dans: ${projectDir}`);

// Vérifier que nous sommes dans un projet Next.js
if (!fs.existsSync(path.join(projectDir, 'package.json'))) {
  console.error('❌ Erreur: Ce script doit être exécuté dans un projet Next.js existant.');
  console.error('Exécutez d\'abord simple-generator.js pour créer la structure de base du projet.');
  process.exit(1);
}

// Fonction pour créer un fichier et son répertoire parent si nécessaire
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`📄 Fichier créé: ${filePath}`);
}

// Générer les fichiers de base pour l'authentification
function generateAuthFiles() {
  // Composant de formulaire de connexion
  const loginFormContent = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Connexion</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p>
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}`;

  // Composant de formulaire d'inscription
  const registerFormContent = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase/client';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Inscrire l'utilisateur
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      // Rediriger vers la page de connexion avec un message de succès
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Inscription</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pseudo" className="block text-gray-700 font-medium mb-2">
            Pseudo
          </label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            minLength={6}
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p>
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}`;

  // Pages d'authentification
  const loginPageContent = `import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Connexion</h1>
      <LoginForm />
    </div>
  );
}`;

  const registerPageContent = `import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Créer un compte</h1>
      <RegisterForm />
    </div>
  );
}`;

  // Créer les fichiers
  createFile(path.join(projectDir, 'src/components/auth/LoginForm.jsx'), loginFormContent);
  createFile(path.join(projectDir, 'src/components/auth/RegisterForm.jsx'), registerFormContent);
  createFile(path.join(projectDir, 'src/app/(auth)/login/page.jsx'), loginPageContent);
  createFile(path.join(projectDir, 'src/app/(auth)/register/page.jsx'), registerPageContent);
}

// Générer les composants de la barre de navigation et du pied de page
function generateLayoutComponents() {
  const navbarContent = `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/carte', label: 'Carte' },
    { href: '/recherche', label: 'Recherche' },
    { href: '/traces', label: 'Parcours' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Packraft & Bikeraft</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={\`px-3 py-2 rounded-md text-sm font-medium \${
                    pathname === link.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }\`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/traces/creer"
                        className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      >
                        Ajouter un parcours
                      </Link>
                      <Link
                        href="/profile"
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Mon profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/login"
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/register"
                        className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Inscription
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={\`\${isOpen ? 'hidden' : 'block'} h-6 w-6\`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={\`\${isOpen ? 'block' : 'hidden'} h-6 w-6\`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={\`\${isOpen ? 'block' : 'hidden'} md:hidden bg-white pb-4 pt-2\`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={\`block px-3 py-2 rounded-md text-base font-medium \${
                pathname === link.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }\`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-4 space-y-2">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/traces/creer"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Ajouter un parcours
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}`;

  const footerContent = `export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Packraft & Bikeraft</h3>
            <p className="text-gray-300">
              Une base de données collaborative pour les amateurs de packraft et bikeraft.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Accueil</a></li>
              <li><a href="/carte" className="hover:text-white">Carte</a></li>
              <li><a href="/recherche" className="hover:text-white">Recherche</a></li>
              <li><a href="/traces" className="hover:text-white">Parcours</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/mentions-legales" className="hover:text-white">Mentions légales</a></li>
              <li><a href="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="/conditions-utilisation" className="hover:text-white">Conditions d'utilisation</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Packraft & Bikeraft. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}`;

  const layoutContent = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}`;

  // Créer les fichiers
  createFile(path.join(projectDir, 'src/components/layout/Navbar.jsx'), navbarContent);
  createFile(path.join(projectDir, 'src/components/layout/Footer.jsx'), footerContent);
  createFile(path.join(projectDir, 'src/app/layout.tsx'), layoutContent);
}

// Générer les utilitaires pour parser les fichiers GPX
function generateGpxUtilities() {
  const gpxParserContent = `'use client';

import { useEffect, useState } from 'react';

interface GPXData {
  coordinates: Array<{lat: number, lon: number, ele?: number}>;
  metadata: {
    name?: string;
    desc?: string;
    time?: string;
    author?: string;
    distance?: number;
    elevation?: {
      gain: number;
      loss: number;
      max: number;
      min: number;
    };
  };
}

interface UseGPXParserProps {
  file?: File | null;
  fileUrl?: string;
}

export const useGPXParser = ({ file, fileUrl }: UseGPXParserProps) => {
  const [gpxData, setGpxData] = useState<GPXData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseGPX = async () => {
      if (!file && !fileUrl) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Dynamiquement importer gpxParser car c'est une bibliothèque côté client
        const gpxParserModule = await import('gpxparser');
        const GpxParser = gpxParserModule.default;
        const gpx = new GpxParser();
        
        let gpxContent: string;
        
        if (file) {
          gpxContent = await file.text();
        } else if (fileUrl) {
          const response = await fetch(fileUrl);
          gpxContent = await response.text();
        } else {
          throw new Error('Aucun fichier ou URL fourni');
        }
        
        gpx.parse(gpxContent);
        
        // Extraire les coordonnées
        const coordinates = gpx.tracks.flatMap(track => 
          track.points.map(point => ({
            lat: point.lat,
            lon: point.lon,
            ele: point.ele
          }))
        );
        
        // Calculer les métadonnées supplémentaires
        const metadata = {
          name: gpx.metadata.name,
          desc: gpx.metadata.desc,
          time: gpx.metadata.time,
          author: gpx.author?.name,
          distance: gpx.tracks.reduce((acc, track) => acc + track.distance.total, 0),
          elevation: {
            gain: gpx.tracks.reduce((acc, track) => acc + track.elevation.pos, 0),
            loss: Math.abs(gpx.tracks.reduce((acc, track) => acc + track.elevation.neg, 0)),
            max: Math.max(...gpx.tracks.flatMap(track => track.points.map(p => p.ele || 0))),
            min: Math.min(...gpx.tracks.flatMap(track => track.points.filter(p => p.ele !== undefined).map(p => p.ele || Infinity)))
          }
        };
        
        setGpxData({ coordinates, metadata });
      } catch (err) {
        console.error('Erreur lors du parsing du fichier GPX:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    parseGPX();
  }, [file, fileUrl]);
  
  return { gpxData, loading, error };
};`;

  // Créer le fichier
  createFile(path.join(projectDir, 'src/utils/gpxParser.ts'), gpxParserContent);
}

// Générer les composants de carte
function generateMapComponents() {
  const leafletMapContent = `'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trace } from '@/types';
import Link from 'next/link';

interface LeafletMapProps {
  traces: Trace[];
}

export default function LeafletMap({ traces }: LeafletMapProps) {
  // Obtenir les coordonnées du centre de la France
  const defaultCenter: [number, number] = [46.603354, 1.888334];
  const defaultZoom = 6;

  useEffect(() => {
    // Fix pour les icônes Leaflet dans Next.js
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Fonction pour déterminer la couleur de la trace selon sa catégorie et difficulté
  const getTraceColor = (trace: Trace) => {
    const difficulty = trace.difficulte ? parseInt(trace.difficulte.replace('Classe ', '')) : 1;
    
    // Couleur par catégorie
    if (trace.categorie === 'Bikeraft') {
      return '#10B981'; // Vert pour Bikeraft
    }
    
    // Pour Packraft, couleur par difficulté
    if (difficulty <= 2) return '#3B82F6'; // Bleu pour classes 1-2
    if (difficulty <= 4) return '#F97316'; // Orange pour classes 3-4
    return '#EF4444'; // Rouge pour classe 5
  };

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={defaultZoom} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {traces.map((trace) => {
        // Vérifier si les coordonnées sont disponibles
        if (trace.coordinates && Array.isArray(trace.coordinates)) {
          const positions = trace.coordinates.map((coord) => [coord.lat, coord.lon]);
          const color = getTraceColor(trace);
          
          // Obtenir le premier point pour le marqueur (point de départ)
          const startPoint = positions[0];
          
          return (
            <div key={trace.id}>
              <Polyline 
                positions={positions} 
                color={color}
                weight={4}
              />
              {startPoint && (
                <Marker position={startPoint}>
                  <Popup>
                    <div className="max-w-xs">
                      <h3 className="font-bold text-lg">{trace.titre}</h3>
                      <p className="text-sm text-gray-600">
                        {trace.categorie} • {trace.difficulte || 'Non spécifié'}
                      </p>
                      <p className="mt-2">{trace.description?.substring(0, 100)}...</p>
                      <Link 
                        href={\`/traces/\${trace.id}\`}
                        className="inline-block mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )}
            </div>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}`;

  const traceMapContent = `'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Trace } from '@/types';

interface TraceMapProps {
  trace: Trace;
}

export default function TraceMap({ trace }: TraceMapProps) {
  // Fix pour les icônes Leaflet dans Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Vérifier si nous avons des coordonnées
  if (!trace.coordinates || !Array.isArray(trace.coordinates) || trace.coordinates.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p>Aucune coordonnée disponible pour ce parcours</p>
      </div>
    );
  }

  // Convertir les coordonnées pour Leaflet
  const positions = trace.coordinates.map(coord => [coord.lat, coord.lon]);
  
  // Obtenir le centre de la carte (premier point de la trace)
  const center = positions[0];
  
  // Obtenir les points de départ et d'arrivée
  const startPoint = positions[0];
  const endPoint = positions[positions.length - 1];

  // Déterminer la couleur de la trace selon sa catégorie
  const getTraceColor = () => {
    if (trace.categorie === 'Bikeraft') {
      return '#10B981'; // Vert pour Bikeraft
    }
    
    // Pour Packraft, couleur par difficulté
    const difficulty = trace.difficulte ? parseInt(trace.difficulte.replace('Classe ', '')) : 1;
    if (difficulty <= 2) return '#3B82F6'; // Bleu pour classes 1-2
    if (difficulty <= 4) return '#F97316'; // Orange pour classes 3-4
    return '#EF4444'; // Rouge pour classe 5
  };

  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Polyline 
        positions={positions}
        color={getTraceColor()}
        weight={4}
      />
      
      <Marker position={startPoint}>
        <Popup>
          <div>
            <strong>Point de départ</strong>
            <p>{trace.point_depart || 'Non spécifié'}</p>
          </div>
        </Popup>
      </Marker>
      
      <Marker position={endPoint}>
        <Popup>
          <div>
            <strong>Point d'arrivée</strong>
            <p>{trace.point_arrivee || 'Non spécifié'}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}`;

  const mapPageContent = `'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import supabase from '@/lib/supabase/client';
import { Trace } from '@/types';

// Import dynamique de react-leaflet pour éviter les erreurs SSR
const MapWithNoSSR = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">Chargement de la carte...</div>
});

export default function MapPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTraces() {
      try {
        const { data, error } = await supabase
          .from('traces')
          .select('*');

        if (error) throw error;
        setTraces(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des traces:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTraces();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Chargement des traces...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Carte des parcours</h1>
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapWithNoSSR traces={traces} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Légende</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span>Packraft - Classes 1-2</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span>Packraft - Classes 3-4</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Packraft - Classe 5</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Bikeraft</span>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  // Créer les fichiers
  createFile(path.join(projectDir, 'src/components/map/LeafletMap.tsx'), leafletMapContent);
  createFile(path.join(projectDir, 'src/components/map/TraceMap.tsx'), traceMapContent);
  createFile(path.join(projectDir, 'src/app/carte/page.tsx'), mapPageContent);
}

// Générer les formulaires pour les traces et les navigations
function generateFormComponents() {
  const createTraceFormContent = `'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import { useGPXParser } from '@/utils/gpxParser';
import { Trace, DifficulteClass } from '@/types';

export default function CreateTraceForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulte, setDifficulte] = useState<DifficulteClass>('1');
  const [tempsDescente, setTempsDescente] = useState('');
  const [pointDepart, setPointDepart] = useState('');
  const [pointArrivee, setPointArrivee] = useState('');
  const [stationsHydro, setStationsHydro] = useState('');
  const [categorie, setCategorie] = useState<'Packraft' | 'Bikeraft'>('Packraft');
  const [region, setRegion] = useState('');
  const [departement, setDepartement] = useState('');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parser le fichier GPX
  const { gpxData, loading: gpxLoading, error: gpxError } = useGPXParser({ file: gpxFile });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setGpxFile(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!gpxFile || !gpxData) {
      setError('Veuillez sélectionner un fichier GPX valide');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/traces/creer');
        return;
      }
      
      // 2. Uploader le fichier GPX
      const fileExt = gpxFile.name.split('.').pop();
      const fileName = \`\${Math.random().toString(36).substring(2, 15)}_\${Date.now()}.\${fileExt}\`;
      const filePath = \`gpx/\${fileName}\`;
      
      const { error: uploadError } = await supabase.storage
        .from('gpx')
        .upload(filePath, gpxFile);
        
      if (uploadError) throw uploadError;
      
      // 3. Créer l'entrée de trace dans la base de données
      const newTrace: Partial<Trace> = {
        titre: title,
        description,
        difficulte: \`Classe \${difficulte}\`,
        temps_descente: tempsDescente,
        point_depart: pointDepart || gpxData.metadata.name,
        point_arrivee: pointArrivee,
        stations_hydro: stationsHydro ? stationsHydro.split(',').map(s => s.trim()) : undefined,
        categorie,
        region,
        departement,
        file_path: filePath,
        user_id: session.user.id,
        coordinates: gpxData.coordinates
      };
      
      const { data: trace, error: insertError } = await supabase
        .from('traces')
        .insert(newTrace)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Rediriger vers la page de la trace créée
      router.push(\`/traces/\${trace.id}\`);
      
    } catch (err) {
      console.error('Erreur lors de la création de la trace:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">Commencez par sélectionner votre fichier GPX. Les informations seront extraites automatiquement.</p>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Fichier GPX*
        </label>
        <div className="flex items-center">
          <input
            type="file"
            accept=".gpx"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            required
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            {gpxFile ? 'Changer de fichier' : 'Sélectionner un fichier'}
          </button>
          {gpxFile && (
            <span className="ml-3 text-gray-600">{gpxFile.name}</span>
          )}
        </div>
        {gpxLoading && <p className="text-blue-600 mt-2">Analyse du fichier GPX...</p>}
        {gpxError && <p className="text-red-600 mt-2">Erreur: {gpxError}</p>}
        {gpxData && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Distance: {Math.round(gpxData.metadata.distance! / 100) / 10} km
              • Dénivelé: +{Math.round(gpxData.metadata.elevation!.gain)}m 
              / -{Math.round(gpxData.metadata.elevation!.loss)}m
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Titre*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="categorie" className="block text-gray-700 font-medium mb-2">
            Catégorie*
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as 'Packraft' | 'Bikeraft')}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Packraft">Packraft</option>
            <option value="Bikeraft">Bikeraft</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="difficulte" className="block text-gray-700 font-medium mb-2">
            Niveau de difficulté
          </label>
          <select
            id="difficulte"
            value={difficulte}
            onChange={(e) => setDifficulte(e.target.value as DifficulteClass)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1">Classe 1 - Débutant</option>
            <option value="2">Classe 2 - Facile</option>
            <option value="3">Classe 3 - Intermédiaire</option>
            <option value="4">Classe 4 - Avancé</option>
            <option value="5">Classe 5 - Expert</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="tempsDescente" className="block text-gray-700 font-medium mb-2">
            Temps de descente estimé
          </label>
          <input
            type="text"
            id="tempsDescente"
            value={tempsDescente}
            onChange={(e) => setTempsDescente(e.target.value)}
            placeholder="ex: 2h30, une journée..."
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pointDepart" className="block text-gray-700 font-medium mb-2">
            Point de départ
          </label>
          <input
            type="text"
            id="pointDepart"
            value={pointDepart}
            onChange={(e) => setPointDepart(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="pointArrivee" className="block text-gray-700 font-medium mb-2">
            Point d'arrivée
          </label>
          <input
            type="text"
            id="pointArrivee"
            value={pointArrivee}
            onChange={(e) => setPointArrivee(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="stationsHydro" className="block text-gray-700 font-medium mb-2">
          Stations hydrologiques (séparées par des virgules)
        </label>
        <input
          type="text"
          id="stationsHydro"
          value={stationsHydro}
          onChange={(e) => setStationsHydro(e.target.value)}
          placeholder="ex: Station1, Station2, Station3"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="region" className="block text-gray-700 font-medium mb-2">
            Région
          </label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="departement" className="block text-gray-700 font-medium mb-2">
            Département
          </label>
          <input
            type="text"
            id="departement"
            value={departement}
            onChange={(e) => setDepartement(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !gpxData}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Création en cours...' : 'Créer le parcours'}
        </button>
      </div>
    </form>
  );
}`;

  const addNavigationFormContent = `'use client';

import { useState, FormEvent } from 'react';
import supabase from '@/lib/supabase/client';
import { Navigation } from '@/types';

interface AddNavigationFormProps {
  traceId: string;
  onSuccess: (navigation: Navigation) => void;
}

export default function AddNavigationForm({ traceId, onSuccess }: AddNavigationFormProps) {
  const [date, setDate] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [tempAir, setTempAir] = useState('');
  const [tempEau, setTempEau] = useState('');
  const [debit, setDebit] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Vous devez être connecté pour ajouter une navigation');
        return;
      }

      // Créer la navigation
      const newNavigation = {
        trace_id: traceId,
        user_id: session.user.id,
        date_navigation: date,
        pseudo: pseudo || undefined,
        temp_air: tempAir ? parseFloat(tempAir) : undefined,
        temp_eau: tempEau ? parseFloat(tempEau) : undefined,
        debit: debit ? parseFloat(debit) : undefined,
        description: description || undefined
      };

      const { data, error: insertError } = await supabase
        .from('navigations')
        .insert(newNavigation)
        .select()
        .single();

      if (insertError) throw insertError;

      // Appeler le callback de succès avec la nouvelle navigation
      onSuccess(data);

      // Réinitialiser le formulaire
      setDate('');
      setPseudo('');
      setTempAir('');
      setTempEau('');
      setDebit('');
      setDescription('');
    } catch (err) {
      console.error('Erreur lors de l\\'ajout de la navigation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
            Date*
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="pseudo" className="block text-gray-700 font-medium mb-1">
            Pseudo/Nom
          </label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="tempAir" className="block text-gray-700 font-medium mb-1">
            Température air (°C)
          </label>
          <input
            type="number"
            id="tempAir"
            value={tempAir}
            onChange={(e) => setTempAir(e.target.value)}
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tempEau" className="block text-gray-700 font-medium mb-1">
            Température eau (°C)
          </label>
          <input
            type="number"
            id="tempEau"
            value={tempEau}
            onChange={(e) => setTempEau(e.target.value)}
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="debit" className="block text-gray-700 font-medium mb-1">
            Débit (m³/s)
          </label>
          <input
            type="number"
            id="debit"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description de votre expérience
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}`;

  // Créer les fichiers
  createFile(path.join(projectDir, 'src/components/forms/CreateTraceForm.tsx'), createTraceFormContent);
  createFile(path.join(projectDir, 'src/components/forms/AddNavigationForm.tsx'), addNavigationFormContent);
}

// Générer les pages de traces
function generateTracePages() {
  const traceListPageContent = `'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '@/lib/supabase/client';
import { Trace } from '@/types';

export default function TracesPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        let query = supabase.from('traces').select('*');
        
        // Appliquer les filtres de catégorie si nécessaire
        if (filter === 'packraft') {
          query = query.eq('categorie', 'Packraft');
        } else if (filter === 'bikeraft') {
          query = query.eq('categorie', 'Bikeraft');
        }
        
        // Exécuter la requête
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        setTraces(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des parcours:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTraces();
  }, [filter]);

  // Filtrer par recherche textuelle
  const filteredTraces = traces.filter(trace => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      trace.titre.toLowerCase().includes(term) ||
      (trace.description && trace.description.toLowerCase().includes(term)) ||
      (trace.region && trace.region.toLowerCase().includes(term)) ||
      (trace.departement && trace.departement.toLowerCase().includes(term)) ||
      (trace.point_depart && trace.point_depart.toLowerCase().includes(term)) ||
      (trace.point_arrivee && trace.point_arrivee.toLowerCase().includes(term))
    );
  });

  const difficultyBadgeColor = (difficulte?: string) => {
    if (!difficulte) return 'bg-gray-200 text-gray-800';
    
    const level = parseInt(difficulte.replace('Classe ', ''));
    if (level <= 2) return 'bg-blue-100 text-blue-800';
    if (level <= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Chargement des parcours...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Parcours</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={\`px-4 py-2 rounded-md \${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }\`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('packraft')}
            className={\`px-4 py-2 rounded-md \${
              filter === 'packraft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }\`}
          >
            Packraft
          </button>
          <button
            onClick={() => setFilter('bikeraft')}
            className={\`px-4 py-2 rounded-md \${
              filter === 'bikeraft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }\`}
          >
            Bikeraft
          </button>
        </div>
        
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Rechercher un parcours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <Link
          href="/traces/creer"
          className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
        >
          Ajouter un parcours
        </Link>
      </div>
      
      {filteredTraces.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-600">Aucun parcours ne correspond à vos critères.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTraces.map((trace) => (
            <div
              key={trace.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={\`px-2 py-1 rounded-md text-xs font-medium \${
                    trace.categorie === 'Packraft'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }\`}>
                    {trace.categorie}
                  </span>
                  
                  {trace.difficulte && (
                    <span className={\`px-2 py-1 rounded-md text-xs font-medium \${difficultyBadgeColor(trace.difficulte)}\`}>
                      {trace.difficulte}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {trace.titre}
                </h2>
                
                <div className="mb-4 text-sm text-gray-600">
                  {trace.region && (
                    <div className="mb-1">
                      <span className="font-medium">Région:</span> {trace.region}
                      {trace.departement && \` (\${trace.departement})\`}
                    </div>
                  )}
                  
                  {trace.temps_descente && (
                    <div className="mb-1">
                      <span className="font-medium">Temps:</span> {trace.temps_descente}
                    </div>
                  )}
                  
                  {trace.description && (
                    <p className="mt-3 text-gray-700 line-clamp-2">{trace.description}</p>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link
                    href={\`/traces/\${trace.id}\`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Voir le parcours
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

  const createTracePageContent = `import CreateTraceForm from '@/components/forms/CreateTraceForm';

export default function CreateTracePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ajouter un nouveau parcours</h1>
      <p className="text-gray-600">
        Partagez votre parcours de packraft ou bikeraft avec la communauté. 
        Vous devez être connecté pour ajouter un parcours.
      </p>
      <CreateTraceForm />
    </div>
  );
}`;

  const navigationListContent = `import { Navigation } from '@/types';

interface NavigationListProps {
  navigations: Navigation[];
}

export default function NavigationList({ navigations }: NavigationListProps) {
  // Formatter une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {navigations.map((navigation) => (
        <div key={navigation.id} className="border-b pb-4 last:border-b-0">
          <div className="flex flex-wrap justify-between items-start mb-2">
            <h3 className="font-medium">
              {navigation.pseudo || 'Anonyme'} • {formatDate(navigation.date_navigation)}
            </h3>
            <div className="text-sm text-gray-600">
              {navigation.debit && <span className="mr-3">Débit: {navigation.debit} m³/s</span>}
              {navigation.temp_air && <span className="mr-3">Air: {navigation.temp_air}°C</span>}
              {navigation.temp_eau && <span>Eau: {navigation.temp_eau}°C</span>}
            </div>
          </div>
          {navigation.description && (
            <p className="text-gray-700 text-sm mt-1">{navigation.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}`;

  // Créer les fichiers
  createFile(path.join(projectDir, 'src/app/traces/page.tsx'), traceListPageContent);
  createFile(path.join(projectDir, 'src/app/traces/creer/page.tsx'), createTracePageContent);
  createFile(path.join(projectDir, 'src/components/traces/NavigationList.tsx'), navigationListContent);
}

// Exécuter toutes les fonctions de génération
function generateAll() {
  console.log('🚀 Génération des composants et pages pour le projet Packraft/Bikeraft...\n');

  // Générer les fichiers selon leur catégorie
  generateAuthFiles();
  generateLayoutComponents();
  generateGpxUtilities();
  generateMapComponents();
  generateFormComponents();
  generateTracePages();

  console.log('\n✅ Génération terminée avec succès!');
  console.log('\nPour démarrer le serveur de développement:');
  console.log('npm run dev');
}

// Démarrer la génération
generateAll();