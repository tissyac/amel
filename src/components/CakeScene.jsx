import { useEffect, useState } from 'react';

export default function CakeScene({ onBlown }) {
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    if (!blown) return undefined;
    const timer = window.setTimeout(onBlown, 1350);
    return () => window.clearTimeout(timer);
  }, [blown, onBlown]);

  return (
    <section className={`birthday-cake-scene${blown ? ' is-blown' : ''}`} aria-label="Gâteau d'anniversaire">
      <div className="birthday-cake-wrap">
        <p className="cake-overline">Une dernière surprise</p>
        <div className="birthday-cake-art" role="img" aria-label="Gâteau rose à deux étages avec cinq bougies">
          <div className="cake-candle-row" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span className="birthday-candle" key={index}>
                <i className="birthday-flame" />
                <i className="birthday-wick" />
              </span>
            ))}
          </div>
          <div className="frosting-tier frosting-top"><span>MON AMOUR</span></div>
          <div className="frosting-tier frosting-bottom"><i className="cake-drip drip-one" /><i className="cake-drip drip-two" /><i className="cake-drip drip-three" /></div>
          <div className="cake-decoration" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="cake-stand" />
        </div>
        <p className="cake-invitation" aria-live="polite">
          {blown ? 'Joyeux anniversaire, mon amour !' : 'Ferme les yeux et fais un vœu'}
        </p>
        <button
          className="blow-candles-button"
          disabled={blown}
          onClick={() => setBlown(true)}
          type="button"
        >
          {blown ? 'Vœu envoyé' : 'Souffler les bougies'}
        </button>
      </div>
    </section>
  );
}
