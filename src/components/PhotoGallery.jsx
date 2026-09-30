import { content } from '../data/content.js';
import PhotoCard from './PhotoCard.jsx';
import PhotoSparkles from './PhotoSparkles.jsx';

export default function PhotoGallery({ page }) {
  const first = page * 2;
  const photos = content.photos.slice(first, first + 2);

  return (
    <div className={`photo-gallery gallery-page-${page}`} key={page}>
      {photos.map((photo, index) => (
        <PhotoCard photo={photo} index={first + index} key={photo.src} />
      ))}
      <PhotoSparkles />
    </div>
  );
}
