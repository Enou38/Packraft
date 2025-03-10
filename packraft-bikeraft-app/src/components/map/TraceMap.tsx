'use client';

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
}