export interface Profile {
  id: string;
  nom?: string;
  prenom?: string;
  pseudo?: string;
  email?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Trace {
  id: string;
  titre: string;
  description?: string;
  difficulte?: string; // Classe 1,2,3,4,5
  temps_descente?: string;
  point_depart?: string;
  point_arrivee?: string;
  stations_hydro?: string[];
  categorie: 'Packraft' | 'Bikeraft';
  region?: string;
  departement?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_featured: boolean;
  coordinates?: any; // Coordonnées GPX en format JSON
}

export interface Navigation {
  id: string;
  trace_id: string;
  user_id: string;
  date_navigation: string;
  pseudo?: string;
  temp_air?: number;
  temp_eau?: number;
  description?: string;
  debit?: number;
  created_at: string;
}

export interface Photo {
  id: string;
  trace_id?: string;
  navigation_id?: string;
  file_path: string;
  description?: string;
  created_at: string;
  user_id: string;
}

export type DifficulteClass = '1' | '2' | '3' | '4' | '5';
