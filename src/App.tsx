import { useEffect } from 'react';
import { LangProvider } from './context/LangContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ErrorBoundary from './components/ErrorBoundary';

function ParticleCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let W = 0, H = 0;
    const COUNT = 60;

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string };
    const particles: Particle[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function mkParticle(): Particle {
      return {
        x: rand(0, W), y: rand(0, H),
        r: rand(0.5, 2),
        vx: rand(-0.2, 0.2), vy: rand(-0.4, -0.1),
        alpha: rand(0.1, 0.6),
        color: Math.random() > 0.5 ? '#4f8ef7' : '#00d4ff',
      };
    }
    for (let i = 0; i < COUNT; i++) particles.push(mkParticle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.0008;
        if (p.y < -10 || p.alpha <= 0) Object.assign(p, mkParticle(), { y: H + 10 });
      });
      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#4f8ef7';
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="particle-canvas" className="particle-canvas" aria-hidden="true" />;
}

function ScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

export default function App() {
  return (
    <LangProvider>
      <ParticleCanvas />
      <Nav />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <ErrorBoundary>
        <Projects />
      </ErrorBoundary>
      <div className="section-divider" />
      <Contact />
      <ScrollObserver />
    </LangProvider>
  );
}
