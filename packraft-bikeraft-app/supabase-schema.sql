-- Table des utilisateurs (extension de la table auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  pseudo VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des traces GPX
CREATE TABLE public.traces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  difficulte VARCHAR(50), -- Classe 1,2,3,4,5
  temps_descente VARCHAR(100),
  point_depart VARCHAR(255),
  point_arrivee VARCHAR(255),
  stations_hydro TEXT[],
  categorie VARCHAR(50), -- Packraft/Bikeraft
  region VARCHAR(100),
  departement VARCHAR(100),
  file_path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.profiles(id),
  is_featured BOOLEAN DEFAULT false,
  coordinates JSONB
);

-- Table des navigations (journal des descentes)
CREATE TABLE public.navigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id UUID REFERENCES public.traces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  date_navigation DATE NOT NULL,
  pseudo VARCHAR(255),
  temp_air DECIMAL(5,2),
  temp_eau DECIMAL(5,2),
  description TEXT,
  debit DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des photos
CREATE TABLE public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trace_id UUID REFERENCES public.traces(id) ON DELETE CASCADE,
  navigation_id UUID REFERENCES public.navigations(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.profiles(id)
);

-- Triggers pour mettre à jour les champs updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_traces_updated_at
BEFORE UPDATE ON public.traces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Politiques de sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Les utilisateurs peuvent voir tous les profils"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politiques pour traces
CREATE POLICY "Tout le monde peut voir les traces"
  ON public.traces FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des traces"
  ON public.traces FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les admin peuvent modifier toutes les traces"
  ON public.traces FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Les admin peuvent supprimer toutes les traces"
  ON public.traces FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Politiques pour navigations
CREATE POLICY "Tout le monde peut voir les navigations"
  ON public.navigations FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des navigations"
  ON public.navigations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres navigations"
  ON public.navigations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Les admin peuvent modifier toutes les navigations"
  ON public.navigations FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Politiques pour photos
CREATE POLICY "Tout le monde peut voir les photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des photos"
  ON public.photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les admin peuvent modifier ou supprimer les photos"
  ON public.photos FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Les admin peuvent supprimer les photos"
  ON public.photos FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
