'use client';

import { useEffect, useState } from 'react';

interface GPXData {
  coordinates: Array<{lat: number, lon: number, ele?: number}>;
  metadata: {
    name?: string;
    desc?: string;
    time?: string;
    author?: string;
    distance?: number;
    elevation?: {
      gain: number;
      loss: number;
      max: number;
      min: number;
    };
  };
}

interface UseGPXParserProps {
  file?: File | null;
  fileUrl?: string;
}

export const useGPXParser = ({ file, fileUrl }: UseGPXParserProps) => {
  const [gpxData, setGpxData] = useState<GPXData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseGPX = async () => {
      if (!file && !fileUrl) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Dynamiquement importer gpxParser car c'est une bibliothèque côté client
        const gpxParserModule = await import('gpxparser');
        const GpxParser = gpxParserModule.default;
        const gpx = new GpxParser();
        
        let gpxContent: string;
        
        if (file) {
          gpxContent = await file.text();
        } else if (fileUrl) {
          const response = await fetch(fileUrl);
          gpxContent = await response.text();
        } else {
          throw new Error('Aucun fichier ou URL fourni');
        }
        
        gpx.parse(gpxContent);
        
        // Extraire les coordonnées
        const coordinates = gpx.tracks.flatMap(track => 
          track.points.map(point => ({
            lat: point.lat,
            lon: point.lon,
            ele: point.ele
          }))
        );
        
        // Calculer les métadonnées supplémentaires
        const metadata = {
          name: gpx.metadata.name,
          desc: gpx.metadata.desc,
          time: gpx.metadata.time,
          author: gpx.author?.name,
          distance: gpx.tracks.reduce((acc, track) => acc + track.distance.total, 0),
          elevation: {
            gain: gpx.tracks.reduce((acc, track) => acc + track.elevation.pos, 0),
            loss: Math.abs(gpx.tracks.reduce((acc, track) => acc + track.elevation.neg, 0)),
            max: Math.max(...gpx.tracks.flatMap(track => track.points.map(p => p.ele || 0))),
            min: Math.min(...gpx.tracks.flatMap(track => track.points.filter(p => p.ele !== undefined).map(p => p.ele || Infinity)))
          }
        };
        
        setGpxData({ coordinates, metadata });
      } catch (err) {
        console.error('Erreur lors du parsing du fichier GPX:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    parseGPX();
  }, [file, fileUrl]);
  
  return { gpxData, loading, error };
};