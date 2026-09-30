import { content } from '../data/content.js';

export default function MessageCard({ index }) {
  const message = content.messages[index];

  return (
    <header className={`memory-message memory-message-page-${index}`}>
      <span className="message-heart message-heart-one" aria-hidden="true">♥</span>
      <span className="message-heart message-heart-two" aria-hidden="true">♥</span>
      <p className="memory-message-kicker">A LITTLE NOTE FOR YOU</p>
      <h2>{message}</h2>
      <span className="message-divider" aria-hidden="true"><i />✦<i /></span>
    </header>
  );
}
