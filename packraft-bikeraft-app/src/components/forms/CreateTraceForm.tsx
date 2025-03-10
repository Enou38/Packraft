'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/SupabaseProvider';

export default function CreateTraceForm() {
  const router = useRouter();
  // Utiliser le hook useSupabase au lieu d'importer directement
  const supabase = useSupabase();
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulte, setDifficulte] = useState('1');
  const [tempsDescente, setTempsDescente] = useState('');
  const [pointDepart, setPointDepart] = useState('');
  const [pointArrivee, setPointArrivee] = useState('');
  const [stationsHydro, setStationsHydro] = useState('');
  const [categorie, setCategorie] = useState('Packraft');
  const [region, setRegion] = useState('');
  const [departement, setDepartement] = useState('');
  
  // États pour le fichier GPX
  const [gpxFile, setGpxFile] = useState(null);
  const [gpxData, setGpxData] = useState(null);
  const [gpxLoading, setGpxLoading] = useState(false);
  const [gpxError, setGpxError] = useState(null);
  
  // États pour le formulaire
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const fileInputRef = useRef(null);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Vérification de l'utilisateur...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Utilisateur connecté:", session.user.email);
          setUser(session.user);
        } else {
          console.log("Aucun utilisateur connecté, redirection vers connexion");
          // Rediriger vers la page de connexion si non connecté
          router.push('/connexion?redirect=/parcours/creer');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
        setError("Erreur de connexion. Veuillez vous reconnecter.");
      }
    };
    
    checkUser();
  }, [router, supabase]);

  // Fonction pour analyser le fichier GPX
  const parseGPX = async (file) => {
    if (!file) return;
    
    setGpxLoading(true);
    setGpxError(null);
    
    try {
      // Lire le contenu du fichier
      const fileContent = await readFileAsText(file);
      
      // Analyser le fichier GPX
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileContent, "text/xml");
      
      // Extraire les coordonnées GPX
      const coordinates = [];
      const trackPoints = xmlDoc.getElementsByTagName('trkpt');
      
      for (let i = 0; i < trackPoints.length; i++) {
        const point = trackPoints[i];
        const lat = parseFloat(point.getAttribute('lat'));
        const lon = parseFloat(point.getAttribute('lon'));
        
        // Récupérer l'élévation si disponible
        let ele = null;
        const eleElement = point.getElementsByTagName('ele')[0];
        if (eleElement) {
          ele = parseFloat(eleElement.textContent);
        }
        
        coordinates.push({ lat, lon, ele });
      }
      
      // Récupérer les métadonnées
      const metadata = {};
      
      // Nom du parcours
      const nameElements = xmlDoc.getElementsByTagName('name');
      if (nameElements.length > 0) {
        metadata.name = nameElements[0].textContent;
        // Pré-remplir le titre si vide
        if (!title) {
          setTitle(metadata.name);
        }
        // Pré-remplir le point de départ si vide
        if (!pointDepart) {
          setPointDepart(metadata.name);
        }
      }
      
      // Description
      const descElements = xmlDoc.getElementsByTagName('desc');
      if (descElements.length > 0) {
        metadata.desc = descElements[0].textContent;
        // Pré-remplir la description si vide
        if (!description) {
          setDescription(metadata.desc);
        }
      }
      
      // Calculer la distance totale approximative
      let distance = 0;
      for (let i = 1; i < coordinates.length; i++) {
        const prevPoint = coordinates[i - 1];
        const currPoint = coordinates[i];
        distance += calculateDistance(
          prevPoint.lat, prevPoint.lon,
          currPoint.lat, currPoint.lon
        );
      }
      
      // Calculer le dénivelé
      let elevationGain = 0;
      let elevationLoss = 0;
      let maxEle = -Infinity;
      let minEle = Infinity;
      
      for (let i = 1; i < coordinates.length; i++) {
        const prevEle = coordinates[i - 1].ele;
        const currEle = coordinates[i].ele;
        
        if (prevEle && currEle) {
          const diff = currEle - prevEle;
          if (diff > 0) {
            elevationGain += diff;
          } else {
            elevationLoss += Math.abs(diff);
          }
          
          if (currEle > maxEle) maxEle = currEle;
          if (currEle < minEle) minEle = currEle;
        }
      }
      
      metadata.distance = distance;
      metadata.elevation = {
        gain: elevationGain,
        loss: elevationLoss,
        max: maxEle !== -Infinity ? maxEle : null,
        min: minEle !== Infinity ? minEle : null
      };
      
      // Mettre à jour l'état avec les données du GPX
      setGpxData({
        coordinates,
        metadata
      });
      
    } catch (err) {
      console.error('Erreur lors du parsing du fichier GPX:', err);
      setGpxError('Le fichier GPX est invalide ou corrompu. Veuillez essayer un autre fichier.');
    } finally {
      setGpxLoading(false);
    }
  };

  // Fonction pour lire un fichier comme texte
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // Fonction pour calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance en km
    return d;
  };

  // Gérer le changement de fichier
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setGpxFile(file);
      parseGPX(file);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gpxFile || !gpxData) {
      setError('Veuillez sélectionner un fichier GPX valide');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Début de la création du parcours");
      
      // 1. Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("Utilisateur non connecté, redirection");
        router.push('/connexion?redirect=/parcours/creer');
        return;
      }
      
      // 2. Uploader le fichier GPX
      console.log("Upload du fichier GPX...");
      const fileExt = gpxFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gpx/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gpx')
        .upload(filePath, gpxFile);
        
      if (uploadError) {
        console.error("Erreur lors de l'upload:", uploadError);
        throw uploadError;
      }
      
      console.log("Fichier GPX uploadé avec succès");
      
      // 3. Créer l'entrée de trace dans la base de données
      console.log("Création de l'entrée dans la base de données...");
      const newTrace = {
        titre: title,
        description,
        difficulte: `Classe ${difficulte}`,
        temps_descente: tempsDescente,
        point_depart: pointDepart || gpxData.metadata.name,
        point_arrivee: pointArrivee,
        stations_hydro: stationsHydro ? stationsHydro.split(',').map(s => s.trim()) : [],
        categorie,
        region,
        departement,
        file_path: filePath,
        user_id: session.user.id,
        coordinates: gpxData.coordinates
      };
      
      const { data: trace, error: insertError } = await supabase
        .from('traces')
        .insert(newTrace)
        .select()
        .single();
        
      if (insertError) {
        console.error("Erreur lors de l'insertion:", insertError);
        throw insertError;
      }
      
      console.log("Parcours créé avec succès, ID:", trace.id);
      
      // Rediriger vers la page de la trace créée
      router.push(`/parcours/${trace.id}`);
      
    } catch (err) {
      console.error('Erreur lors de la création de la trace:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de la trace.');
    } finally {
      setLoading(false);
    }
  };

  // Rendu du composant
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '0.375rem',
          marginBottom: '1rem' 
        }}>
          <p>{error}</p>
        </div>
      )}
      
      <div style={{ 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        color: '#3b82f6', 
        padding: '1rem', 
        borderRadius: '0.375rem',
        marginBottom: '1.5rem' 
      }}>
        <p>Commencez par sélectionner votre fichier GPX. Les informations seront extraites automatiquement.</p>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Fichier GPX*
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept=".gpx"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            required
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--gray-800)',
              color: 'var(--gray-200)',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            {gpxFile ? 'Changer de fichier' : 'Sélectionner un fichier'}
          </button>
          {gpxFile && (
            <span style={{ marginLeft: '0.75rem', color: 'var(--gray-600)' }}>{gpxFile.name}</span>
          )}
        </div>
        {gpxLoading && <p style={{ color: 'var(--non-photo-blue-300)', marginTop: '0.5rem' }}>Analyse du fichier GPX...</p>}
        {gpxError && <p style={{ color: 'var(--chili-red)', marginTop: '0.5rem' }}>Erreur: {gpxError}</p>}
        {gpxData && (
          <div style={{ 
            marginTop: '0.75rem', 
            padding: '0.75rem', 
            backgroundColor: 'var(--gray-900)', 
            borderRadius: '0.375rem' 
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              Distance: {Math.round(gpxData.metadata.distance * 10) / 10} km
              {gpxData.metadata.elevation.gain && ` • Dénivelé: +${Math.round(gpxData.metadata.elevation.gain)}m`}
              {gpxData.metadata.elevation.loss && ` / -${Math.round(gpxData.metadata.elevation.loss)}m`}
            </p>
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Titre*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--gray-800)',
              fontSize: '1rem'
            }}
            required
          />
        </div>
        
        <div>
          <label htmlFor="categorie" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Catégorie*
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--gray-800)',
              fontSize: '1rem'
            }}
            required
          >
            <option value="Packraft">Packraft</option>
            <option value="Bikeraft">Bikeraft</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.625rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--gray-800)',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        ></textarea>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>
          <label htmlFor="difficulte" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Niveau de difficulté
          </label>
          <select
            id="difficulte"
            value={difficulte}
            onChange={(e) => setDifficulte(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--gray-800)',
              fontSize: '1rem'
            }}
          >
            <option value="1">Classe 1 - Débutant</option>
            <option value="2">Classe 2 - Facile</option>
            <option value="3">Classe 3 - Intermédiaire</option>
            <option value="4">Classe 4 - Avancé</option>
            <option value="5">Classe 5 - Expert</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="tempsDescente" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Temps de descente estimé
          </label>
          <input
            type="text"
            id="tempsDescente"
            value={tempsDescente}
            onChange={(e) => setTempsDescente(e.target.value)}
            placeholder="ex: 2h30, une journée..."
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
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>
          <label htmlFor="pointDepart" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Point de départ
          </label>
          <input
            type="text"
            id="pointDepart"
            value={pointDepart}
            onChange={(e) => setPointDepart(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--gray-800)',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="pointArrivee" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Point d'arrivée
          </label>
          <input
            type="text"
            id="pointArrivee"
            value={pointArrivee}
            onChange={(e) => setPointArrivee(e.target.value)}
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
      
      <div>
        <label htmlFor="stationsHydro" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Stations hydrologiques (séparées par des virgules)
        </label>
        <input
          type="text"
          id="stationsHydro"
          value={stationsHydro}
          onChange={(e) => setStationsHydro(e.target.value)}
          placeholder="ex: Station1, Station2, Station3"
          style={{
            width: '100%',
            padding: '0.625rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--gray-800)',
            fontSize: '1rem'
          }}
        />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>
          <label htmlFor="region" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Région
          </label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--gray-800)',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="departement" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Département
          </label>
          <input
            type="text"
            id="departement"
            value={departement}
            onChange={(e) => setDepartement(e.target.value)}
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
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={loading || !gpxData}
          className="btn btn-primary"
          style={{ 
            opacity: loading || !gpxData ? 0.7 : 1,
            cursor: loading || !gpxData ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Création en cours...' : 'Créer le parcours'}
        </button>
      </div>
    </form>
  );
}