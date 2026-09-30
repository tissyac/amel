import { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts.jsx';
import HeartPhotoAnimation from './HeartPhotoAnimation.jsx';
import PhotoBook from './PhotoBook.jsx';
import StarBackground from './StarBackground.jsx';

const timeline = [
  [1200, 'opening'],
  [3050, 'spread-0'],
  [5200, 'spread-1'],
  [7350, 'spread-2'],
  [9500, 'spread-3'],
  [11100, 'folding'],
  [11900, 'pause'],
  [12400, 'pile'],
  [13000, 'heart'],
  [17800, 'finished'],
];

function RomanticExperience({ onReplay }) {
  const [phase, setPhase] = useState('closed');

  useEffect(() => {
    const timers = timeline.map(([delay, nextPhase]) => window.setTimeout(() => setPhase(nextPhase), delay));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const showBook = phase === 'closed' || phase === 'opening' || phase === 'folding' || phase.startsWith('spread-');
  const showHeart = phase === 'pile' || phase === 'heart' || phase === 'finished';

  return (
    <section className={`romantic-experience phase-${phase}`} aria-label="Une lettre et nos souvenirs">
      <StarBackground />
      {phase !== 'pause' && <FloatingHearts />}
      {showBook && <PhotoBook phase={phase} />}
      {showHeart && <HeartPhotoAnimation phase={phase} />}
      {phase === 'finished' && (
        <button className="memory-replay" onClick={onReplay} type="button">
          Recommencer <span aria-hidden="true">↻</span>
        </button>
      )}
      <a className="memory-return" href="/" aria-label="Retour à l'accueil">Retour</a>
    </section>
  );
}

export default function RomanticCard() {
  const [run, setRun] = useState(0);
  return <RomanticExperience key={run} onReplay={() => setRun((current) => current + 1)} />;
}
