'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ParcoursPage() {
  // État pour gérer les données et filtres
  const [parcours, setParcours] = useState([]);
  const [filteredParcours, setFilteredParcours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données (simulation)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les traces depuis Supabase
        const { data, error } = await supabase
          .from('traces')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setParcours(data || []);
        setFilteredParcours(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les parcours. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Filtrer par catégorie
  useEffect(() => {
    if (parcours.length === 0) return;
    
    let filtered = [...parcours];
    
    // Filtrer par catégorie
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.categorie.toLowerCase() === filter);
    }
    
    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => (
        p.titre.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.region.toLowerCase().includes(term) ||
        p.departement.toLowerCase().includes(term)
      ));
    }
    
    setFilteredParcours(filtered);
  }, [filter, searchTerm, parcours]);

  // Couleur du badge selon la difficulté
  const getDifficultyClass = (difficulte) => {
    const level = difficulte.split(' ')[1];
    if (level === '1' || level === '2') return 'difficulte-12';
    if (level === '3' || level === '4') return 'difficulte-34';
    return 'difficulte-5';
  };

  return (
    <div className="container fade-in">
      <h1 className="page-title">Parcours</h1>
      
      {/* Filtres et recherche */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Filtrer par catégorie</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: filter === 'all' ? 'var(--non-photo-blue)' : 'var(--gray-800)',
                  color: filter === 'all' ? 'var(--non-photo-blue-100)' : 'var(--gray-300)'
                }}
              >
                Tous
              </button>
              <button 
                onClick={() => setFilter('packraft')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: filter === 'packraft' ? 'var(--non-photo-blue)' : 'var(--gray-800)',
                  color: filter === 'packraft' ? 'var(--non-photo-blue-100)' : 'var(--gray-300)'
                }}
              >
                Packraft
              </button>
              <button 
                onClick={() => setFilter('bikeraft')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: filter === 'bikeraft' ? 'var(--non-photo-blue)' : 'var(--gray-800)',
                  color: filter === 'bikeraft' ? 'var(--non-photo-blue-100)' : 'var(--gray-300)'
                }}
              >
                Bikeraft
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Rechercher</h3>
            <input
              type="text"
              placeholder="Rechercher un parcours, une région..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--gray-800)',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>{filteredParcours.length} parcours trouvés</p>
          <Link href="/parcours/creer" className="btn btn-primary">
            Ajouter un parcours
          </Link>
        </div>
      </div>
      
      {/* Liste des parcours */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          Chargement des parcours...
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--chili-red)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Réessayer
          </button>
        </div>
      ) : filteredParcours.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Aucun parcours ne correspond à vos critères de recherche.</p>
          <button 
            onClick={() => { setFilter('all'); setSearchTerm(''); }}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {filteredParcours.map((parcours) => (
            <div key={parcours.id} className="card">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: parcours.categorie === 'Packraft' ? 'var(--non-photo-blue-800)' : '#10B98133',
                  color: parcours.categorie === 'Packraft' ? 'var(--non-photo-blue-200)' : '#065F46',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {parcours.categorie}
                </span>
                <span style={{ 
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 
                    parcours.difficulte === 'Classe 1' || parcours.difficulte === 'Classe 2' 
                      ? 'var(--non-photo-blue-600)' 
                      : parcours.difficulte === 'Classe 3' || parcours.difficulte === 'Classe 4'
                        ? 'var(--chili-red-700)'
                        : 'var(--chili-red)',
                  color: 
                    parcours.difficulte === 'Classe 1' || parcours.difficulte === 'Classe 2' 
                      ? 'var(--non-photo-blue-100)' 
                      : parcours.difficulte === 'Classe 3' || parcours.difficulte === 'Classe 4'
                        ? 'var(--chili-red-100)'
                        : 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {parcours.difficulte}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {parcours.titre}
              </h2>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                <div>{parcours.region} - {parcours.departement}</div>
                <div>Durée: {parcours.temps_descente}</div>
              </div>
              
              <p style={{ marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                {parcours.description}
              </p>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
                <div>Départ: {parcours.point_depart}</div>
                <div>Arrivée: {parcours.point_arrivee}</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link 
                  href={`/parcours/${parcours.id}`}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Voir le parcours
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}