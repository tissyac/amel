import { useEffect, useRef } from 'react';

const alphabet = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\{}[]$#@%&*+';

export default function DigitalRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let columns = [];
    let frame = 0;
    let previousTime = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const size = width < 600 ? 14 : 17;
      columns = Array.from({ length: Math.ceil(width / size) }, (_, index) => ({
        x: index * size,
        y: Math.random() * height - height,
        size,
        speed: 35 + Math.random() * 110,
        trail: 7 + Math.floor(Math.random() * 16),
        alpha: .2 + Math.random() * .48,
      }));
    }

    function draw(time) {
      const delta = Math.min((time - previousTime) / 1000 || 0, .05);
      previousTime = time;
      context.fillStyle = 'rgba(3, 0, 8, .16)';
      context.fillRect(0, 0, width, height);
      context.textAlign = 'center';
      context.shadowColor = '#ff3caa';

      columns.forEach((column) => {
        column.y += column.speed * delta;
        if (column.y - column.trail * column.size > height) {
          column.y = -Math.random() * height * .6;
          column.speed = 35 + Math.random() * 110;
          column.trail = 7 + Math.floor(Math.random() * 16);
        }

        context.font = `${column.size}px monospace`;
        for (let index = 0; index < column.trail; index += 1) {
          const y = column.y - index * column.size;
          if (y < -column.size || y > height + column.size) continue;
          const fade = 1 - index / column.trail;
          context.fillStyle = index === 0
            ? `rgba(255, 231, 247, ${Math.min(1, fade * column.alpha + .35)})`
            : `rgba(255, 64, 166, ${fade * column.alpha})`;
          context.shadowBlur = index === 0 ? 12 : 4;
          context.fillText(alphabet[Math.floor(Math.random() * alphabet.length)], column.x, y);
        }
      });

      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    }

    resize();
    frame = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}
