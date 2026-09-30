import { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let frame = 0;
    let stars = [];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(150, Math.round(width * height / 6500)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: .35 + Math.random() * 1.35,
        phase: Math.random() * Math.PI * 2,
        speed: .4 + Math.random() * 1.4,
      }));
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const shimmer = .3 + (Math.sin(time * .001 * star.speed + star.phase) + 1) * .34;
        context.beginPath();
        context.fillStyle = `rgba(255, 246, 252, ${shimmer})`;
        context.shadowColor = 'rgba(255, 221, 241, .9)';
        context.shadowBlur = star.radius > 1.1 ? 8 : 3;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
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

  return <canvas ref={canvasRef} className="star-background" aria-hidden="true" />;
}
