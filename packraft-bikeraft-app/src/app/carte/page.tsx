'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSupabase } from '@/lib/supabase/SupabaseProvider';

// Import dynamique de la carte pour éviter les erreurs SSR
const MapWithNoSSR = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="map-container flex items-center justify-center">
      Chargement de la carte...
    </div>
  ),
});

export default function CartePage() {
  // Utiliser le hook pour accéder à Supabase
  const supabase = useSupabase();
  
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour charger les traces depuis Supabase
    async function fetchTraces() {
      try {
        console.log("Chargement des traces depuis Supabase...");
        const { data, error } = await supabase
          .from('traces')
          .select('*');

        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }
        
        console.log("Traces chargées:", data?.length || 0);
        setTraces(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des traces:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    }

    fetchTraces();
  }, [supabase]);

  return (
    <div className="container fade-in">
      <h1 className="page-title">Carte des parcours</h1>
      
      {loading ? (
        <div className="map-container flex items-center justify-center">
          Chargement des données...
        </div>
      ) : error ? (
        <div className="card text-center">
          <p>{error}</p>
          <button className="btn mt-4" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      ) : (
        <>
          {/* Carte */}
          <div className="map-container">
            <MapWithNoSSR traces={traces} />
          </div>
          
          {/* Légende */}
          <section className="section">
            <h2 className="section-title">Légende</h2>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color packraft-12"></div>
                <span>Packraft - Classes 1-2</span>
              </div>
              <div className="legend-item">
                <div className="legend-color packraft-34"></div>
                <span>Packraft - Classes 3-4</span>
              </div>
              <div className="legend-item">
                <div className="legend-color packraft-5"></div>
                <span>Packraft - Classe 5</span>
              </div>
              <div className="legend-item">
                <div className="legend-color bikeraft"></div>
                <span>Bikeraft</span>
              </div>
            </div>
          </section>
          
          {/* Description */}
          <section className="section">
            <h2 className="section-title">Packraft & Bikeraft</h2>
            <div className="card">
              <p>Une base de données collaborative pour les amateurs de packraft et bikeraft. Découvrez, partagez et explorez de nouveaux parcours avec notre communauté grandissante.</p>
              <div className="mt-4">
                <Link href="/parcours/creer" className="btn btn-primary">
                  Ajouter un parcours
                </Link>
              </div>
            </div>
          </section>
          
          {/* Liens rapides */}
          <section className="section quick-links">
            <h2 className="section-title">Liens rapides</h2>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/carte">Carte</Link></li>
              <li><Link href="/recherche">Recherche</Link></li>
              <li><Link href="/parcours">Parcours</Link></li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}