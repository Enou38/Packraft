'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Chargement dynamique de la carte pour éviter les erreurs SSR
const MapWithNoSSR = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
      Chargement de la carte...
    </div>
  )
});

export default function RecherchePage() {
  // États pour gérer les filtres et résultats
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'packraft', nom: 'Packraft', selected: false },
    { id: 'bikeraft', nom: 'Bikeraft', selected: false }
  ]);
  const [niveaux, setNiveaux] = useState([
    { id: 'classe-1', nom: 'Classe 1', selected: false },
    { id: 'classe-2', nom: 'Classe 2', selected: false },
    { id: 'classe-3', nom: 'Classe 3', selected: false },
    { id: 'classe-4', nom: 'Classe 4', selected: false },
    { id: 'classe-5', nom: 'Classe 5', selected: false }
  ]);
  const [regionSelectionnee, setRegionSelectionnee] = useState('');
  const [departementSelectionne, setDepartementSelectionne] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [parcours, setParcours] = useState([]);
  const [parcoursAffiches, setParcoursAffiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rechercheLancee, setRechercheLancee] = useState(false);

  // Charger les données des régions et départements (simulé)
  useEffect(() => {
    const fetchRegionsEtDepartements = async () => {
      try {
        // En production, vous feriez un appel API
        const regionsData = [
          'Auvergne-Rhône-Alpes',
          'Bourgogne-Franche-Comté',
          'Bretagne',
          'Centre-Val de Loire',
          'Corse',
          'Grand Est',
          'Hauts-de-France',
          'Île-de-France',
          'Normandie',
          'Nouvelle-Aquitaine',
          'Occitanie',
          'Pays de la Loire',
          'Provence-Alpes-Côte d\'Azur'
        ];
        
        const departementsData = {
          'Auvergne-Rhône-Alpes': ['Ain', 'Allier', 'Ardèche', 'Cantal', 'Drôme', 'Isère', 'Loire', 'Haute-Loire', 'Puy-de-Dôme', 'Rhône', 'Savoie', 'Haute-Savoie'],
          'Nouvelle-Aquitaine': ['Charente', 'Charente-Maritime', 'Corrèze', 'Creuse', 'Dordogne', 'Gironde', 'Landes', 'Lot-et-Garonne', 'Pyrénées-Atlantiques', 'Deux-Sèvres', 'Vienne', 'Haute-Vienne'],
          'Occitanie': ['Ariège', 'Aude', 'Aveyron', 'Gard', 'Haute-Garonne', 'Gers', 'Hérault', 'Lot', 'Lozère', 'Hautes-Pyrénées', 'Pyrénées-Orientales', 'Tarn', 'Tarn-et-Garonne'],
          'Provence-Alpes-Côte d\'Azur': ['Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes', 'Bouches-du-Rhône', 'Var', 'Vaucluse']
        };
        
        setRegions(regionsData);
        setDepartements(departementsData);
      } catch (err) {
        console.error('Erreur lors du chargement des régions et départements:', err);
        setError("Impossible de charger les données géographiques");
      }
    };

    fetchRegionsEtDepartements();
  }, []);

  // Charger tous les parcours (simulé)
  useEffect(() => {
    const fetchParcours = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Données de test
        const data = [
          {
            id: '1',
            titre: 'La Dordogne - Argentat',
            description: 'Magnifique parcours accessible, idéal pour découvrir le packraft',
            categorie: 'Packraft',
            difficulte: 'Classe 2',
            region: 'Nouvelle-Aquitaine',
            departement: 'Corrèze',
            temps_descente: '4h',
            point_depart: 'Argentat',
            point_arrivee: 'Carennac',
            coordinates: [
              { lat: 45.092, lon: 1.938 },
              { lat: 45.080, lon: 1.950 },
              { lat: 45.075, lon: 1.965 }
            ]
          },
          {
            id: '2',
            titre: 'L\'Ubaye - Gorges de la Reyssole',
            description: 'Parcours technique avec passages engagés',
            categorie: 'Packraft',
            difficulte: 'Classe 4',
            region: 'Provence-Alpes-Côte d\'Azur',
            departement: 'Alpes-de-Haute-Provence',
            temps_descente: '2h30',
            point_depart: 'Le Martinet',
            point_arrivee: 'Pont du Martinet',
            coordinates: [
              { lat: 44.453, lon: 6.618 },
              { lat: 44.448, lon: 6.630 },
              { lat: 44.445, lon: 6.645 }
            ]
          },
          {
            id: '3',
            titre: 'L\'Allier - De Langeac à Brioude',
            description: 'Combinaison parfaite de pistes cyclables et de sections de rivière',
            categorie: 'Bikeraft',
            difficulte: 'Classe 3',
            region: 'Auvergne-Rhône-Alpes',
            departement: 'Haute-Loire',
            temps_descente: '1 jour',
            point_depart: 'Langeac',
            point_arrivee: 'Brioude',
            coordinates: [
              { lat: 45.1, lon: 3.5 },
              { lat: 45.08, lon: 3.48 },
              { lat: 45.05, lon: 3.45 }
            ]
          },
          {
            id: '4',
            titre: 'La Vézère - Entre Montignac et Les Eyzies',
            description: 'Parcours facile et familial au cœur du Périgord noir',
            categorie: 'Packraft',
            difficulte: 'Classe 1',
            region: 'Nouvelle-Aquitaine',
            departement: 'Dordogne',
            temps_descente: '5h',
            point_depart: 'Montignac',
            point_arrivee: 'Les Eyzies',
            coordinates: [
              { lat: 45.06, lon: 1.17 },
              { lat: 45.03, lon: 1.16 },
              { lat: 44.95, lon: 1.01 }
            ]
          },
          {
            id: '5',
            titre: 'Le Tarn - Gorges du Tarn',
            description: 'Descente spectaculaire dans des gorges calcaires',
            categorie: 'Packraft',
            difficulte: 'Classe 2',
            region: 'Occitanie',
            departement: 'Lozère',
            temps_descente: '2 jours',
            point_depart: 'Sainte-Enimie',
            point_arrivee: 'Le Rozier',
            coordinates: [
              { lat: 44.35, lon: 3.41 },
              { lat: 44.30, lon: 3.35 },
              { lat: 44.2, lon: 3.22 }
            ]
          }
        ];
        
        setParcours(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des parcours:', err);
        setError('Impossible de charger les parcours. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchParcours();
  }, []);

  // Mise à jour des départements lorsque la région change
  useEffect(() => {
    setDepartementSelectionne('');
  }, [regionSelectionnee]);

  // Gestion des filtres de catégorie
  const toggleCategorie = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ));
  };

  // Gestion des filtres de niveau
  const toggleNiveau = (id) => {
    setNiveaux(niveaux.map(niv => 
      niv.id === id ? { ...niv, selected: !niv.selected } : niv
    ));
  };

  // Réinitialiser tous les filtres
  const resetFiltres = () => {
    setRegionSelectionnee('');
    setDepartementSelectionne('');
    setSearchTerm('');
    setCategories(categories.map(cat => ({ ...cat, selected: false })));
    setNiveaux(niveaux.map(niv => ({ ...niv, selected: false })));
    setRechercheLancee(false);
  };

  // Lancer la recherche
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtrer les parcours selon les critères
    const categoriesSelectionnees = categories.filter(c => c.selected).map(c => c.nom);
    const niveauxSelectionnes = niveaux.filter(n => n.selected).map(n => n.nom);
    
    let filteredParcours = [...parcours];
    
    // Filtrer par région
    if (regionSelectionnee) {
      filteredParcours = filteredParcours.filter(p => p.region === regionSelectionnee);
    }
    
    // Filtrer par département
    if (departementSelectionne) {
      filteredParcours = filteredParcours.filter(p => p.departement === departementSelectionne);
    }
    
    // Filtrer par catégorie
    if (categoriesSelectionnees.length > 0) {
      filteredParcours = filteredParcours.filter(p => categoriesSelectionnees.includes(p.categorie));
    }
    
    // Filtrer par niveau
    if (niveauxSelectionnes.length > 0) {
      filteredParcours = filteredParcours.filter(p => niveauxSelectionnes.includes(p.difficulte));
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredParcours = filteredParcours.filter(p => 
        p.titre.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.point_depart.toLowerCase().includes(term) ||
        p.point_arrivee.toLowerCase().includes(term)
      );
    }
    
    setParcoursAffiches(filteredParcours);
    setRechercheLancee(true);
  };

  return (
    <div className="container fade-in">
      <h1 className="page-title">Rechercher un parcours</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Formulaire de recherche */}
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.25rem' }}>Critères de recherche</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="searchTerm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Recherche par mot-clé
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Nom de rivière, lieu, description..."
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
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <label htmlFor="region" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Région
                </label>
                <select
                  id="region"
                  value={regionSelectionnee}
                  onChange={(e) => setRegionSelectionnee(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-800)',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Toutes les régions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <label htmlFor="departement" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Département
                </label>
                <select
                  id="departement"
                  value={departementSelectionne}
                  onChange={(e) => setDepartementSelectionne(e.target.value)}
                  disabled={!regionSelectionnee}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-800)',
                    fontSize: '1rem',
                    opacity: !regionSelectionnee ? 0.6 : 1
                  }}
                >
                  <option value="">Tous les départements</option>
                  {regionSelectionnee && departements[regionSelectionnee]?.map(dep => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Catégorie</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategorie(cat.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--gray-800)',
                      background: cat.selected ? cat.id === 'packraft' ? 'var(--non-photo-blue)' : '#10B981' : 'white',
                      color: cat.selected ? cat.id === 'packraft' ? 'var(--non-photo-blue-100)' : '#064E3B' : 'var(--gray-300)',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.nom}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Niveau de difficulté</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {niveaux.map(niv => (
                  <button
                    key={niv.id}
                    type="button"
                    onClick={() => toggleNiveau(niv.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--gray-800)',
                      background: niv.selected ? 
                        niv.id === 'classe-1' || niv.id === 'classe-2' ? 'var(--non-photo-blue-600)' :
                        niv.id === 'classe-3' || niv.id === 'classe-4' ? 'var(--chili-red-700)' : 
                        'var(--chili-red)' : 'white',
                      color: niv.selected ?
                        niv.id === 'classe-1' || niv.id === 'classe-2' ? 'var(--non-photo-blue-100)' :
                        niv.id === 'classe-3' || niv.id === 'classe-4' ? 'var(--chili-red-100)' :
                        'white' : 'var(--gray-300)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {niv.nom}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={resetFiltres}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--gray-800)',
                  background: 'white',
                  color: 'var(--gray-400)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Réinitialiser
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Rechercher
              </button>
            </div>
          </form>
        </section>
        
        {/* Résultats de recherche */}
        {rechercheLancee && (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.25rem' }}>
              Résultats de recherche ({parcoursAffiches.length})
            </h2>
            
            {parcoursAffiches.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Aucun parcours ne correspond à vos critères de recherche.</p>
                <button 
                  onClick={resetFiltres}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Carte des résultats */}
                <div style={{ height: '400px', marginBottom: '1.5rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <MapWithNoSSR traces={parcoursAffiches} />
                </div>
                
                {/* Liste des résultats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '1.5rem'
                }}>
                  {parcoursAffiches.map((parcours) => (
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
                      
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {parcours.titre}
                      </h3>
                      
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                        <div>{parcours.region} - {parcours.departement}</div>
                        <div>Durée: {parcours.temps_descente}</div>
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
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}