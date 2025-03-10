'use client';

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
                        href={`/traces/${trace.id}`}
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
}