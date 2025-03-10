'use client';

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
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('packraft')}
            className={`px-4 py-2 rounded-md ${
              filter === 'packraft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Packraft
          </button>
          <button
            onClick={() => setFilter('bikeraft')}
            className={`px-4 py-2 rounded-md ${
              filter === 'bikeraft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
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
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    trace.categorie === 'Packraft'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {trace.categorie}
                  </span>
                  
                  {trace.difficulte && (
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyBadgeColor(trace.difficulte)}`}>
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
                      {trace.departement && ` (${trace.departement})`}
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
                    href={`/traces/${trace.id}`}
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
}