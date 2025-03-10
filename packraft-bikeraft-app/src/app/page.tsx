import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <section className="section">
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--non-photo-blue-800) 0%, var(--lavender-blush-900) 100%)',
          borderLeft: '5px solid var(--non-photo-blue)'
        }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div>
              <h1 className="page-title text-center" style={{ marginBottom: '1rem' }}>
                Explorez les rivières en packraft et bikeraft
              </h1>
              <p className="mb-4">
                Découvrez une base de données collaborative de parcours de packraft et bikeraft. 
                Partagez vos traces GPX, consultez les niveaux de difficulté, et planifiez vos aventures.
              </p>
              <div className="flex gap-4 justify-center mt-8">
                <Link href="/carte" className="btn btn-primary">
                  Explorer la carte
                </Link>
                <Link href="/parcours/creer" className="btn btn-secondary">
                  Ajouter un parcours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Parcours */}
      <section className="section">
        <h2 className="section-title">Parcours à découvrir</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Carte 1 */}
          <div className="card">
            <div className="flex gap-2 mb-2">
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'var(--non-photo-blue-800)',
                color: 'var(--non-photo-blue-200)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Packraft
              </span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'var(--non-photo-blue-600)',
                color: 'var(--non-photo-blue-100)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Classe 2
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>La Dordogne</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>Région Nouvelle-Aquitaine</p>
            <p className="mb-4">Magnifique parcours à travers les gorges avec des paysages à couper le souffle. Idéal pour les débutants et les familles.</p>
            <div className="flex justify-end">
              <Link href="/parcours/1" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Voir le parcours
              </Link>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="card">
            <div className="flex gap-2 mb-2">
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'var(--non-photo-blue-800)',
                color: 'var(--non-photo-blue-200)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Packraft
              </span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'var(--chili-red-700)',
                color: 'var(--chili-red-100)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Classe 4
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>L'Ubaye</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>Région PACA</p>
            <p className="mb-4">Un parcours dynamique avec des rapides techniques. Réservé aux pagayeurs expérimentés avec de bonnes compétences en eau vive.</p>
            <div className="flex justify-end">
              <Link href="/parcours/2" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Voir le parcours
              </Link>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="card">
            <div className="flex gap-2 mb-2">
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: '#10B981',
                color: '#064E3B',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Bikeraft
              </span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'var(--lavender-blush-400)',
                color: 'var(--lavender-blush-100)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Classe 3
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>L'Allier</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>Région Auvergne-Rhône-Alpes</p>
            <p className="mb-4">Combinaison parfaite de pistes cyclables et de sections de rivière. Une aventure de 3 jours à travers des paysages volcaniques.</p>
            <div className="flex justify-end">
              <Link href="/parcours/3" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Voir le parcours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça fonctionne */}
      <section className="section">
        <h2 className="section-title">Comment ça fonctionne</h2>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="text-center">
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--non-photo-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--non-photo-blue-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Explorez la carte</h3>
              <p>Naviguez sur notre carte interactive pour découvrir tous les parcours disponibles dans votre région.</p>
            </div>
            
            <div className="text-center">
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--lavender-blush)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lavender-blush-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Partagez vos expériences</h3>
              <p>Contribuez à la communauté en ajoutant vos propres parcours et en partageant vos conditions de navigation.</p>
            </div>
            
            <div className="text-center">
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--chili-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Planifiez votre aventure</h3>
              <p>Accédez aux débits en temps réel, aux prévisions météo et aux points d'accès pour une expérience sécuritaire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div style={{
          backgroundColor: 'var(--non-photo-blue-100)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Prêt à explorer ?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '36rem', margin: '0 auto 2rem' }}>
            Rejoignez notre communauté de passionnés de packraft et de bikeraft. Partagez vos aventures et découvrez de nouveaux parcours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/connexion" className="btn" style={{ backgroundColor: 'white', color: 'var(--non-photo-blue-100)' }}>
              Créer un compte
            </Link>
            <Link href="/parcours" className="btn" style={{ backgroundColor: 'transparent', color: 'white', border: '2px solid white' }}>
              Voir tous les parcours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}