import MessageCard from './MessageCard.jsx';
import PhotoGallery from './PhotoGallery.jsx';

function CoverIllustration() {
  return (
    <svg className="cover-illustration" viewBox="0 0 220 132" fill="none" aria-hidden="true">
      <path d="M13 85c20 1 31 9 44 20 9 8 23 13 37 8l19-8c5-2 10 0 12 4 2 5-1 9-6 12l-17 8c-19 9-42 6-59-6L26 108H13" stroke="#BD7184" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M207 85c-20 1-31 9-44 20-9 8-23 13-37 8l-19-8c-5-2-10 0-12 4-2 5 1 9 6 12l17 8c19 9 42 6 59-6l17-15h13" stroke="#BD7184" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 69c0-15 21-22 36-5 15-17 36-10 36 5 0 18-36 38-36 38S74 87 74 69Z" fill="#E9879B" />
      <path d="M94 31c4-8 10-13 17-15m-13 21c-5-6-7-13-6-20m34 14c-3-8-8-13-14-16" stroke="#E5A3A9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="39" cy="55" r="2" fill="#D58C9B" />
      <circle cx="181" cy="50" r="2" fill="#D58C9B" />
      <path d="m52 37 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Zm116 17 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#D8A6A7" />
    </svg>
  );
}

export default function PhotoBook({ phase, onPrevious, onNext }) {
  const opened = phase !== 'closed';
  const page = phase.startsWith('spread-')
    ? Number(phase.slice('spread-'.length))
    : phase === 'folding'
      ? 3
      : 0;

  return (
    <div className={`book-scene${opened ? ' is-open' : ''}${phase === 'opening' ? ' is-opening' : ''}${phase === 'folding' ? ' is-folding' : ''}`}>
      <div className="book-interior">
        <div className="book-spread">
          <MessageCard index={page} key={`message-${page}`} />
          <PhotoGallery page={page} key={`gallery-${page}`} />
          <div className="book-gutter" aria-hidden="true" />
        </div>
      </div>
      <div className="book-cover">
        <div className="cover-front">
          <span className="cover-edition">A LITTLE BOOK OF US</span>
          <div className="cover-title">Pour toi,<br /><em>mon amour</em></div>
          <CoverIllustration />
          <span className="cover-date">02 · 10 · 2026</span>
          <span className="cover-stamp" aria-hidden="true">♥</span>
        </div>
        <div className="cover-back" aria-hidden="true" />
      </div>
      {phase.startsWith('spread-') && (
        <nav className="book-page-controls" aria-label="Navigation de l’album photo">
          <button
            aria-label="Page précédente"
            disabled={page === 0}
            onClick={onPrevious}
            title="Page précédente"
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <span className="book-page-count" aria-live="polite">Page {page + 1} sur 4</span>
          <button
            aria-label={page === 3 ? 'Terminer l’album et voir les souvenirs' : 'Page suivante'}
            onClick={onNext}
            title={page === 3 ? 'Voir les souvenirs' : 'Page suivante'}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
    </div>
  );
}
