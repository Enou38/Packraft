'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import SupabaseProvider from '@/lib/supabase/SupabaseProvider';

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Vérifier si un lien est actif
  const isActive = (path) => pathname === path;

  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SupabaseProvider>
          <div className="layout">
            {/* Header avec navigation */}
            <header className="header">
              <div className="container header-container">
                <Link href="/" className="logo">
                  Packraft & Bikeraft
                </Link>
                
                <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Menu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isMenuOpen ? (
                      <>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </>
                    ) : (
                      <>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </>
                    )}
                  </svg>
                </button>
                
                <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                  <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                    Accueil
                  </Link>
                  <Link href="/carte" className={`nav-link ${isActive('/carte') ? 'active' : ''}`}>
                    Carte
                  </Link>
                  <Link href="/recherche" className={`nav-link ${isActive('/recherche') ? 'active' : ''}`}>
                    Recherche
                  </Link>
                  <Link href="/parcours" className={`nav-link ${isActive('/parcours') ? 'active' : ''}`}>
                    Parcours
                  </Link>
                  <Link href="/connexion" className={`nav-link ${isActive('/connexion') ? 'active' : ''}`}>
                    Connexion
                  </Link>
                </nav>
              </div>
            </header>

            {/* Contenu principal */}
            <main className="main-content">
              {children}
            </main>

            {/* Footer */}
            <footer className="footer">
              <div className="container">
                <div className="footer-container">
                  <div className="footer-section">
                    <h3>Packraft & Bikeraft</h3>
                    <p>Une base de données collaborative pour les amateurs de packraft et bikeraft.</p>
                  </div>
                  
                  <div className="footer-section">
                    <h3>Navigation</h3>
                    <ul className="footer-links">
                      <li><Link href="/">Accueil</Link></li>
                      <li><Link href="/carte">Carte</Link></li>
                      <li><Link href="/recherche">Recherche</Link></li>
                      <li><Link href="/parcours">Parcours</Link></li>
                    </ul>
                  </div>
                  
                  <div className="footer-section">
                    <h3>Légal</h3>
                    <ul className="footer-links">
                      <li><Link href="/mentions-legales">Mentions légales</Link></li>
                      <li><Link href="/politique-confidentialite">Politique de confidentialité</Link></li>
                      <li><Link href="/conditions-utilisation">Conditions d'utilisation</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="copyright">
                  © {new Date().getFullYear()} Packraft & Bikeraft. Tous droits réservés.
                </div>
              </div>
            </footer>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}