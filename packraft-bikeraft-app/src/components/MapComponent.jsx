'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ traces = [] }) {
  // Centre de la France comme position par défaut
  const defaultCenter = [46.603354, 1.888334];
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
  const getTraceColor = (trace) => {
    if (trace.categorie === 'Bikeraft') {
      return '#10B981'; // Vert pour Bikeraft
    }
    
    // Pour Packraft, couleur par difficulté
    if (trace.difficulte === 'Classe 1' || trace.difficulte === 'Classe 2') {
      return '#92dce5'; // Bleu pour classes 1-2 (non-photo-blue)
    }
    
    if (trace.difficulte === 'Classe 3' || trace.difficulte === 'Classe 4') {
      return '#e79184'; // Orange pour classes 3-4 (chili-red-700)
    }
    
    return '#d64933'; // Rouge pour classe 5 (chili-red)
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
                    <div style={{ maxWidth: '200px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {trace.titre}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                        {trace.categorie} • {trace.difficulte}
                      </p>
                      {trace.description && (
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          {trace.description.substring(0, 100)}
                          {trace.description.length > 100 ? '...' : ''}
                        </p>
                      )}
                      <a
                        href={`/parcours/${trace.id}`}
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#92dce5',
                          color: '#0f373d',
                          textDecoration: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Voir détails
                      </a>
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
}