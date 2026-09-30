import { useEffect, useState } from 'react';
import hugGif from '../../Hugging Hug GIF.gif';

const birthday = new Date(2026, 9, 2, 0, 0, 0).getTime();

function getRemainingTime() {
  const secondsRemaining = Math.max(0, Math.floor((birthday - Date.now()) / 1000));

  return {
    days: Math.floor(secondsRemaining / 86400),
    hours: Math.floor((secondsRemaining % 86400) / 3600),
    minutes: Math.floor((secondsRemaining % 3600) / 60),
    seconds: secondsRemaining % 60,
  };
}

export default function IntroScreen({ onOpen }) {
  const [remaining, setRemaining] = useState(getRemainingTime);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemainingTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="welcome-screen" aria-label="Accueil">
      <div className="welcome-orbit" aria-hidden="true" />
      <div className="welcome-content">
        <div className="welcome-image-frame">
          <img src={hugGif} alt="Deux amoureux qui se font un câlin" />
        </div>
        <p className="welcome-eyebrow">Une date à célébrer</p>
        <h1>Mon petit univers</h1>
        <p className="welcome-subtitle">Rien que pour toi</p>
        <div className="countdown" aria-label="Compte à rebours avant le 2 octobre 2026 à minuit">
          {Object.entries(remaining).map(([unit, value]) => (
            <div className="countdown-unit" key={unit}>
              <span>{String(value).padStart(2, '0')}</span>
              <small>{unit}</small>
            </div>
          ))}
        </div>
        <button className="welcome-button" onClick={onOpen} type="button">
          Pour toi, ouvre ici ❤️ <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
