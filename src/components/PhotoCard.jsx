import { useState } from 'react';

const placeholderScenes = ['dawn', 'garden', 'evening', 'sky'];

export default function PhotoCard({ photo, index, compact = false, className = '', style }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const scene = placeholderScenes[index % placeholderScenes.length];

  return (
    <figure
      className={`photo-card${compact ? ' photo-card-compact' : ''}${loaded ? ' image-loaded' : ''} ${className}`}
      style={style}
    >
      {!failed && (
        <img
          src={photo.src}
          alt={photo.alt}
          loading={compact ? 'lazy' : 'eager'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className={`photo-placeholder scene-${scene}`} role="img" aria-label={`Emplacement pour ${photo.alt}`}>
          <span className="placeholder-sun" />
          <span className="placeholder-horizon" />
          <span className="placeholder-copy">{String(index + 1).padStart(2, '0')}</span>
        </div>
      )}
      {!compact && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
}
