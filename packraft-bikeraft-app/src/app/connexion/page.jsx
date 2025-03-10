'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/SupabaseProvider';

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = useSupabase();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Mode:", isLogin ? "Connexion" : "Inscription");
      console.log("Email:", email);
      
      if (isLogin) {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        console.log("Connexion réussie");
      } else {
        // Inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              pseudo: email.split('@')[0], // Utilise la partie avant @ comme pseudo
            }
          }
        });
        
        if (error) throw error;
        
        console.log("Inscription réussie");
        // Si l'inscription réussit, afficher un message pour confirmer l'email
        alert('Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.');
      }
      
      // Rediriger vers la page d'accueil après connexion
      router.push('/');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">{isLogin ? 'Connexion' : 'Inscription'}</h1>
      
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--gray-300)'
              }}
            >
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--gray-800)',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--gray-300)'
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--gray-800)',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading 
              ? (isLogin ? 'Connexion en cours...' : 'Inscription en cours...') 
              : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center',
          padding: '1rem 0 0',
          borderTop: '1px solid var(--gray-800)'
        }}>
          {isLogin ? (
            <p>
              Vous n'avez pas encore de compte ?{' '}
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--non-photo-blue-300)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Inscrivez-vous
              </button>
            </p>
          ) : (
            <p>
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--non-photo-blue-300)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>
      
      <div style={{ maxWidth: '480px', margin: '2rem auto 0', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'var(--gray-600)', textDecoration: 'underline' }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}