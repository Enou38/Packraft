'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Créer un contexte pour Supabase
const SupabaseContext = createContext(null);

// URL et clé d'API Supabase
const supabaseUrl = 'https://mhkpryzngkucfcgfqhms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3ByeXpuZ2t1Y2ZjZ2ZxaG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjExMDQsImV4cCI6MjA1NzEzNzEwNH0.hktzmaqi8UkXRuCA5FyTSUJpmeS-315rlUYXsAY7duM';

// Hook pour accéder à Supabase
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error("useSupabase doit être utilisé à l'intérieur d'un SupabaseProvider");
  }
  return context;
};

// Fournisseur de contexte Supabase
export default function SupabaseProvider({ children }) {
  // Initialiser le client Supabase une seule fois
  const [supabase] = useState(() => 
    createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  );

  // Exposer le client Supabase au contexte
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}