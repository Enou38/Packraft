'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function TraceMapDetail({ trace }) {
  useEffect(() => {
    // Fix pour les icônes Leaflet dans Next.js
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Vérifier si les coordonnées sont présentes
  if (!trace || !trace.coordinates || !Array.isArray(trace.coordinates) || trace.coordinates.length === 0) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0' 
      }}>
        Aucune coordonnée disponible pour ce parcours
      </div>
    );
  }

  // Convertir les coordonnées pour Leaflet
  const positions = trace.coordinates.map(coord => [coord.lat, coord.lon]);
  
  // Calculer le bounding box pour centrer la carte
  const bounds = L.latLngBounds(positions);
  
  // Obtenir les points de départ et d'arrivée
  const startPoint = positions[0];
  const endPoint = positions[positions.length - 1];

  // Déterminer la couleur en fonction de la catégorie et difficulté
  const getTraceColor = () => {
    if (trace.categorie === 'Bikeraft') {
      return '#10B981'; // Vert pour Bikeraft
    }
    
    // Pour Packraft, couleur par difficulté
    const difficultyClass = trace.difficulte ? trace.difficulte.split(' ')[1] : '1';
    
    if (difficultyClass === '1' || difficultyClass === '2') {
      return '#92dce5'; // Non-photo-blue pour classes 1-2
    }
    
    if (difficultyClass === '3' || difficultyClass === '4') {
      return '#e79184'; // Chili-red-700 pour classes 3-4
    }
    
    return '#d64933'; // Chili-red pour classe 5
  };

  const traceColor = getTraceColor();

  // Icônes personnalisées pour départ et arrivée
  const createCustomIcon = (color, iconName) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: white;
          border: 2px solid ${color};
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        ">
          <span style="
            font-size: 14px;
            font-weight: bold;
            color: ${color};
          ">${iconName}</span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const startIcon = createCustomIcon(traceColor, 'D');
  const endIcon = createCustomIcon(traceColor, 'A');

  return (
    <MapContainer 
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Trace GPX */}
      <Polyline 
        positions={positions}
        color={traceColor}
        weight={4}
      />
      
      {/* Marqueur de départ */}
      <Marker position={startPoint} icon={startIcon}>
        <Popup>
          <div>
            <strong>Point de départ</strong>
            <p>{trace.point_depart}</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Marqueur d'arrivée */}
      <Marker position={endPoint} icon={endIcon}>
        <Popup>
          <div>
            <strong>Point d'arrivée</strong>
            <p>{trace.point_arrivee}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}