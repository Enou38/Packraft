'use client';

import { createClient } from '@supabase/supabase-js';

// Dans Next.js, les variables d'environnement côté client doivent commencer par NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhkpryzngkucfcgfqhms.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3ByeXpuZ2t1Y2ZjZ2ZxaG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjExMDQsImV4cCI6MjA1NzEzNzEwNH0.hktzmaqi8UkXRuCA5FyTSUJpmeS-315rlUYXsAY7duM';

// Créer le client une seule fois
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Exporter le client
export default supabase;