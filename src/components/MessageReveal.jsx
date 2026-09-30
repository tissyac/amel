import { useEffect, useState } from 'react';

const scrambled = '0123456789<>/\\{}[]$#@%&*+アカサタナ';

export default function MessageReveal({ text }) {
  const [revealed, setRevealed] = useState(0);
  const characters = Array.from(text);

  useEffect(() => {
    setRevealed(0);
    const timers = characters.map((_, index) => window.setTimeout(
      () => setRevealed(index + 1),
      140 + index * 44,
    ));

    return () => timers.forEach(window.clearTimeout);
  }, [text]);

  return (
    <h1 className="matrix-message" aria-label={text}>
      {characters.map((character, index) => {
        const visibleCharacter = index < revealed
          ? character
          : character === ' '
            ? '\u00a0'
            : scrambled[(index * 7 + characters.length * 3) % scrambled.length];

        return (
          <span
            className={`matrix-letter${index < revealed ? ' is-resolved' : ''}`}
            key={`${text}-${index}`}
            style={{ '--letter-index': index }}
            aria-hidden="true"
          >
            {visibleCharacter === ' ' ? '\u00a0' : visibleCharacter}
          </span>
        );
      })}
    </h1>
  );
}
