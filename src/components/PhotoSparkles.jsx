import { useEffect, useRef } from 'react';

export default function PhotoSparkles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;

    function resize() {
      const bounds = canvas.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.max(18, Math.round(width / 12)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: .45 + Math.random() * 1.2,
        drift: .08 + Math.random() * .25,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.drift;
        if (particle.y < -4) particle.y = height + 4;
        const alpha = .15 + (Math.sin(time * .001 + particle.phase) + 1) * .24;
        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.shadowColor = '#fff6fa';
        context.shadowBlur = 7;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    }

    resize();
    frame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="photo-sparkles" aria-hidden="true" />;
}
