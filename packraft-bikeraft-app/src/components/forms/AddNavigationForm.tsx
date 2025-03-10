'use client';

import { useState, FormEvent } from 'react';
import supabase from '@/lib/supabase/client';
import { Navigation } from '@/types';

interface AddNavigationFormProps {
  traceId: string;
  onSuccess: (navigation: Navigation) => void;
}

export default function AddNavigationForm({ traceId, onSuccess }: AddNavigationFormProps) {
  const [date, setDate] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [tempAir, setTempAir] = useState('');
  const [tempEau, setTempEau] = useState('');
  const [debit, setDebit] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Vous devez être connecté pour ajouter une navigation');
        return;
      }

      // Créer la navigation
      const newNavigation = {
        trace_id: traceId,
        user_id: session.user.id,
        date_navigation: date,
        pseudo: pseudo || undefined,
        temp_air: tempAir ? parseFloat(tempAir) : undefined,
        temp_eau: tempEau ? parseFloat(tempEau) : undefined,
        debit: debit ? parseFloat(debit) : undefined,
        description: description || undefined
      };

      const { data, error: insertError } = await supabase
        .from('navigations')
        .insert(newNavigation)
        .select()
        .single();

      if (insertError) throw insertError;

      // Appeler le callback de succès avec la nouvelle navigation
      onSuccess(data);

      // Réinitialiser le formulaire
      setDate('');
      setPseudo('');
      setTempAir('');
      setTempEau('');
      setDebit('');
      setDescription('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la navigation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
            Date*
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="pseudo" className="block text-gray-700 font-medium mb-1">
            Pseudo/Nom
          </label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="tempAir" className="block text-gray-700 font-medium mb-1">
            Température air (°C)
          </label>
          <input
            type="number"
            id="tempAir"
            value={tempAir}
            onChange={(e) => setTempAir(e.target.value)}
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tempEau" className="block text-gray-700 font-medium mb-1">
            Température eau (°C)
          </label>
          <input
            type="number"
            id="tempEau"
            value={tempEau}
            onChange={(e) => setTempEau(e.target.value)}
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="debit" className="block text-gray-700 font-medium mb-1">
            Débit (m³/s)
          </label>
          <input
            type="number"
            id="debit"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description de votre expérience
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}