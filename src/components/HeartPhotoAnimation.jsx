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

export default function HeartPhotoAnimation({ phase }) {
  const formed = phase === 'heart' || phase === 'finished';

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
      </div>
    </section>
  );
}
