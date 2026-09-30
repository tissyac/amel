import { useEffect, useState } from 'react';
import FloatingHearts from './FloatingHearts.jsx';
import HeartPhotoAnimation from './HeartPhotoAnimation.jsx';
import PhotoBook from './PhotoBook.jsx';
import StarBackground from './StarBackground.jsx';

const openingTimeline = [
  [1200, 'opening'],
  [3050, 'spread-0'],
];

const finaleTimeline = {
  folding: [800, 'pause'],
  pause: [500, 'pile'],
  pile: [600, 'heart'],
  heart: [4800, 'finished'],
};

function RomanticExperience({ onReplay }) {
  const [phase, setPhase] = useState('closed');

  useEffect(() => {
    const timers = openingTimeline.map(([delay, nextPhase]) => window.setTimeout(() => setPhase(nextPhase), delay));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    const transition = finaleTimeline[phase];
    if (!transition) return undefined;

    const [delay, nextPhase] = transition;
    const timer = window.setTimeout(() => setPhase(nextPhase), delay);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const page = phase.startsWith('spread-') ? Number(phase.slice('spread-'.length)) : 0;
  const showBook = phase === 'closed' || phase === 'opening' || phase === 'folding' || phase.startsWith('spread-');
  const showHeart = phase === 'pile' || phase === 'heart' || phase === 'finished';
  const goToPreviousPage = () => {
    if (page > 0) setPhase(`spread-${page - 1}`);
  };
  const goToNextPage = () => {
    setPhase(page < 3 ? `spread-${page + 1}` : 'folding');
  };

  return (
    <section className={`romantic-experience phase-${phase}`} aria-label="Une lettre et nos souvenirs">
      <StarBackground />
      {phase !== 'pause' && <FloatingHearts />}
      {showBook && <PhotoBook phase={phase} onPrevious={goToPreviousPage} onNext={goToNextPage} />}
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
