export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Packraft & Bikeraft</h3>
            <p className="text-gray-300">
              Une base de données collaborative pour les amateurs de packraft et bikeraft.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Accueil</a></li>
              <li><a href="/carte" className="hover:text-white">Carte</a></li>
              <li><a href="/recherche" className="hover:text-white">Recherche</a></li>
              <li><a href="/traces" className="hover:text-white">Parcours</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/mentions-legales" className="hover:text-white">Mentions légales</a></li>
              <li><a href="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="/conditions-utilisation" className="hover:text-white">Conditions d'utilisation</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Packraft & Bikeraft. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}