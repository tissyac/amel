const hearts = Array.from({ length: 13 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 9) % 100}%`,
  size: `${12 + (index % 4) * 5}px`,
  duration: `${13 + (index % 5) * 3}s`,
  delay: `${-index * 1.8}s`,
  drift: `${(index % 2 ? 1 : -1) * (12 + index % 4 * 7)}px`,
}));

export default function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          className="floating-heart"
          key={heart.id}
          style={{
            '--heart-left': heart.left,
            '--heart-size': heart.size,
            '--heart-duration': heart.duration,
            '--heart-delay': heart.delay,
            '--heart-drift': heart.drift,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
