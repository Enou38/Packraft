import { Navigation } from '@/types';

interface NavigationListProps {
  navigations: Navigation[];
}

export default function NavigationList({ navigations }: NavigationListProps) {
  // Formatter une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {navigations.map((navigation) => (
        <div key={navigation.id} className="border-b pb-4 last:border-b-0">
          <div className="flex flex-wrap justify-between items-start mb-2">
            <h3 className="font-medium">
              {navigation.pseudo || 'Anonyme'} • {formatDate(navigation.date_navigation)}
            </h3>
            <div className="text-sm text-gray-600">
              {navigation.debit && <span className="mr-3">Débit: {navigation.debit} m³/s</span>}
              {navigation.temp_air && <span className="mr-3">Air: {navigation.temp_air}°C</span>}
              {navigation.temp_eau && <span>Eau: {navigation.temp_eau}°C</span>}
            </div>
          </div>
          {navigation.description && (
            <p className="text-gray-700 text-sm mt-1">{navigation.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}