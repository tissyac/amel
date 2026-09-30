import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content.js';
import PhotoCard from './PhotoCard.jsx';

function heartPositions(count) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    const rotation = Math.sin(index * 11.71) * 13;
    return {
      left: `${50 + (x / 34) * 87}%`,
      top: `${6 + ((17 - y) / 34) * 87}%`,
      rotation: `${rotation.toFixed(1)}deg`,
      delay: `${(index % 9) * 55}ms`,
      startRotation: `${(Math.cos(index * 4.27) * 26).toFixed(1)}deg`,
    };
  });
}

const positions = heartPositions(content.heartPhotoCount);
const loveLetterParagraphs = [
  'Je ne sais pas ce que l’avenir nous réserve, mais je sais une chose : depuis que tu es dans ma vie, mon cœur a trouvé quelque chose qu’il ne voudrait plus jamais perdre. ❤️',
  'Tu es devenue une partie de mes plus beaux souvenirs, de mes plus beaux sourires et de ces petits moments qui rendent la vie tellement plus belle.',
  'Je veux continuer à rire avec toi, à créer des souvenirs, à te regarder sourire et à découvrir encore toutes les belles choses que la vie nous réserve.',
  'Aujourd’hui, c’est ton anniversaire, mais le vrai cadeau, c’est de t’avoir dans ma vie.',
  'Je t’aime, simplement, profondément, et plus que les mots ne pourront jamais le dire. ❤️',
];

export default function HeartPhotoAnimation({ phase }) {
  const [letterOpen, setLetterOpen] = useState(false);
  const letterDialogRef = useRef(null);
  const formed = phase === 'heart' || phase === 'finished';

  useEffect(() => {
    const dialog = letterDialogRef.current;
    if (!letterOpen || !dialog) return undefined;

    dialog.showModal();
    return () => dialog.close();
  }, [letterOpen]);

  return (
    <section className={`heart-finale${formed ? ' is-formed' : ' is-piling'}`} aria-label="Souvenirs disposés en forme de cœur">
      <div className="heart-glow" aria-hidden="true" />
      <div className="heart-photo-field">
        {positions.map((position, index) => {
          const photo = content.photos[index % content.photos.length];
          return (
            <PhotoCard
              className="heart-photo"
              compact
              index={index}
              key={`heart-${index}`}
              photo={{ ...photo, alt: `Souvenir ${index + 1}` }}
              style={{
                '--heart-left': position.left,
                '--heart-top': position.top,
                '--heart-rotation': position.rotation,
                '--heart-delay': position.delay,
                '--start-rotation': position.startRotation,
              }}
            />
          );
        })}
      </div>
      <div className="heart-signoff">
        <span>MON AMOUR</span>
        <i aria-hidden="true">♥</i>
        <button className="heart-message-button" onClick={() => setLetterOpen(true)} type="button">
          Lire ma lettre
        </button>
      </div>
      {letterOpen && (
        <dialog
          aria-labelledby="love-letter-title"
          className="love-letter-dialog"
          onCancel={() => {
            setLetterOpen(false);
          }}
          onClick={(event) => {
            if (event.target === letterDialogRef.current) setLetterOpen(false);
          }}
          ref={letterDialogRef}
        >
          <div className="love-letter-paper">
            <header className="love-letter-header">
              <p>Quelques mots écrits avec amour</p>
              <h2 id="love-letter-title">Pour toi, Amel</h2>
              <button aria-label="Fermer la lettre" className="love-letter-close" onClick={() => setLetterOpen(false)} type="button">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="love-letter-body">
              <p className="love-letter-salutation">Mon amour,</p>
              {loveLetterParagraphs.map((paragraph, index) => (
                <p
                  className={`love-letter-paragraph${index === loveLetterParagraphs.length - 1 ? ' is-final' : ''}`}
                  key={`love-letter-paragraph-${index}`}
                  style={{ '--letter-delay': `${index * 240}ms` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <footer className="love-letter-ending">
              <i aria-hidden="true">♥</i>
            </footer>
          </div>
        </dialog>
      )}
    </section>
  );
}
