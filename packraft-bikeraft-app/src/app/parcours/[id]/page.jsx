'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import dynamique pour la carte
const TraceMapWithNoSSR = dynamic(() => import('../../../components/TraceMapDetail'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
      Chargement de la carte...
    </div>
  ),
});

export default function ParcoursDetailPage() {
  const { id } = useParams();
  const [parcours, setParcours] = useState(null);
  const [navigations, setNavigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNavigation, setShowAddNavigation] = useState(false);

  // Récupérer les données du parcours
  useEffect(() => {
    const fetchParcours = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données du parcours
        const { data: parcoursData, error: parcoursError } = await supabase
          .from('traces')
          .select('*, profiles:user_id(*)')
          .eq('id', id)
          .single();
        
        if (parcoursError) throw parcoursError;
        
        // Récupérer les navigations associées à ce parcours
        const { data: navigationsData, error: navsError } = await supabase
          .from('navigations')
          .select('*')
          .eq('trace_id', id)
          .order('date_navigation', { ascending: false });
        
        if (navsError) throw navsError;
        
        setParcours(parcoursData);
        setNavigations(navigationsData || []);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError("Impossible de charger les données du parcours");
        setLoading(false);
      }
    };
  
    if (id) {
      fetchParcours();
    }
  }, [id]);

  // Fonction pour ajouter une nouvelle navigation (simulée)
  const handleAddNavigation = (formData) => {
    // Dans un cas réel, vous enverriez ces données à votre API
    console.log('Nouvelle navigation:', formData);
    
    // Ajouter la navigation à la liste (simulation)
    const newNavigation = {
      id: `nav${navigations.length + 1}`,
      date_navigation: formData.date,
      pseudo: formData.pseudo || 'Anonyme',
      temp_air: formData.tempAir,
      temp_eau: formData.tempEau,
      debit: formData.debit,
      description: formData.description
    };
    
    setNavigations([newNavigation, ...navigations]);
    setShowAddNavigation(false);
  };

  // Formulaire d'ajout de navigation
  const AddNavigationForm = () => {
    const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      pseudo: '',
      tempAir: '',
      tempEau: '',
      debit: '',
      description: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddNavigation(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Ajouter une navigation
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Date*
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-800)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Pseudo
            </label>
            <input
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-800)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Température air (°C)
            </label>
            <input
              type="number"
              name="tempAir"
              value={formData.tempAir}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-800)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Température eau (°C)
            </label>
            <input
              type="number"
              name="tempEau"
              value={formData.tempEau}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-800)',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Débit (m³/s)
            </label>
            <input
              type="number"
              name="debit"
              value={formData.debit}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-800)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--gray-800)',
              fontSize: '0.875rem',
              resize: 'vertical'
            }}
          ></textarea>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowAddNavigation(false)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--gray-800)',
              background: 'white',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            Ajouter la navigation
          </button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          Chargement du parcours...
        </div>
      </div>
    );
  }

  if (error || !parcours) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 className="page-title">Erreur</h1>
          <p>{error || "Ce parcours n'existe pas ou a été supprimé."}</p>
          <Link href="/parcours" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Voir tous les parcours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* En-tête du parcours */}
      <div className="card" style={{ 
        marginBottom: '2rem',
        borderLeft: '5px solid',
        borderLeftColor: parcours.categorie === 'Packraft' ? 'var(--non-photo-blue)' : '#10B981'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
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
            
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {parcours.titre}
            </h1>
            
            <p style={{ color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
              {parcours.region} • {parcours.departement}
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Ajouté par {parcours.user.pseudo} le {new Date(parcours.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <button className="btn btn-primary">
              Télécharger GPX
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenu principal et infos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr',
        gap: '2rem'
      }}>
        {/* Carte et description */}
        <div>
          <div style={{ height: '400px', marginBottom: '1.5rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <TraceMapWithNoSSR trace={parcours} />
          </div>
          
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Description
            </h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              {parcours.description}
            </p>
          </div>
        </div>
        
        {/* Infos pratiques */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Informations pratiques
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Départ
                </h3>
                <p>{parcours.point_depart}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Arrivée
                </h3>
                <p>{parcours.point_arrivee}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Distance
                </h3>
                <p>{parcours.distance} km</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Temps estimé
                </h3>
                <p>{parcours.temps_descente}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Dénivelé
                </h3>
                <p>{parcours.denivele} m</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Saison idéale
                </h3>
                <p>{parcours.saison_ideale}</p>
              </div>
            </div>
          </div>
          
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Conditions hydrologiques
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                Stations hydrologiques
              </h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                {parcours.stations_hydro.map((station, index) => (
                  <li key={index}>{station}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Débit minimum
                </h3>
                <p>{parcours.debit_min} m³/s</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Débit optimal
                </h3>
                <p>{parcours.debit_optimal} m³/s</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Débit maximum
                </h3>
                <p>{parcours.debit_max} m³/s</p>
              </div>
            </div>
          </div>
          
          {/* Journal de navigation */}
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                Journal de navigation
              </h2>
              
              <button 
                onClick={() => setShowAddNavigation(!showAddNavigation)}
                className="btn"
                style={{ 
                  padding: '0.375rem 0.75rem', 
                  fontSize: '0.875rem',
                  backgroundColor: showAddNavigation ? 'var(--gray-800)' : 'var(--non-photo-blue)'
                }}
              >
                {showAddNavigation ? 'Annuler' : 'Ajouter'}
              </button>
            </div>
            
            {showAddNavigation && <AddNavigationForm />}
            
            {navigations.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--gray-500)' }}>
                Aucune navigation enregistrée pour ce parcours.
              </p>
            ) : (
              <div>
                {navigations.map((nav, index) => (
                  <div 
                    key={nav.id} 
                    style={{ 
                      padding: '1rem 0',
                      borderBottom: index < navigations.length - 1 ? '1px solid var(--gray-800)' : 'none' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '500' }}>
                        {nav.pseudo} • {new Date(nav.date_navigation).toLocaleDateString()}
                      </div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        {nav.debit && <span style={{ marginRight: '1rem' }}>Débit: {nav.debit} m³/s</span>}
                        {nav.temp_air && <span style={{ marginRight: '1rem' }}>Air: {nav.temp_air}°C</span>}
                        {nav.temp_eau && <span>Eau: {nav.temp_eau}°C</span>}
                      </div>
                    </div>
                    {nav.description && (
                      <p style={{ fontSize: '0.9375rem' }}>{nav.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}