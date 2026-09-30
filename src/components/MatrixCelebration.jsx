import { useEffect, useState } from 'react';
import CakeScene from './CakeScene.jsx';
import DigitalRain from './DigitalRain.jsx';
import MessageReveal from './MessageReveal.jsx';

const timeline = [
  [850, '3'],
  [2250, '2'],
  [3650, '1'],
  [5050, 'HAPPY'],
  [7100, 'BIRTHDAY'],
  [9400, 'TO'],
  [10750, 'YOU ❤️'],
];

export default function MatrixCelebration({ onCandlesBlown }) {
  const [message, setMessage] = useState('');
  const [cakeIsReady, setCakeIsReady] = useState(false);

  useEffect(() => {
    const timers = timeline.map(([delay, text]) => window.setTimeout(() => setMessage(text), delay));
    timers.push(window.setTimeout(() => {
      setMessage('');
      setCakeIsReady(true);
    }, 15900));

    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <section className="matrix-celebration" aria-label="Surprise d'anniversaire">
      <DigitalRain />
      <div className="matrix-vignette" aria-hidden="true" />
      <div className="matrix-scanlines" aria-hidden="true" />
      <div className={`matrix-text-stage${cakeIsReady ? ' is-hidden' : ''}`} aria-live="polite" aria-atomic="true">
        {message && <MessageReveal key={message} text={message} />}
        <div className="matrix-aura" aria-hidden="true" />
      </div>
      {cakeIsReady && <CakeScene onBlown={onCandlesBlown} />}
    </section>
  );
}
