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
    let animId = 0;
    let W = 0;
    let H = 0;
    let lastFrame = 0;
    let isVisible = document.visibilityState === 'visible';
    const mobileQuery = window.matchMedia('(max-width: 800px), (pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string };
    let particles: Particle[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const getProfile = () => {
      const reducedMotion = reducedMotionQuery.matches;
      const mobile = mobileQuery.matches;

      if (reducedMotion) {
        return { count: 0, connectionDistance: 0, maxDpr: 1, frameInterval: 0 };
      }

      return mobile
        ? { count: 20, connectionDistance: 72, maxDpr: 1.25, frameInterval: 50 }
        : { count: 60, connectionDistance: 120, maxDpr: 1.75, frameInterval: 0 };
    };

    function resize() {
      const { maxDpr } = getProfile();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function mkParticle(): Particle {
      return {
        x: rand(0, W), y: rand(0, H),
        r: rand(0.5, 2),
        vx: rand(-0.2, 0.2), vy: rand(-0.4, -0.1),
        alpha: rand(0.1, 0.6),
        color: Math.random() > 0.5 ? '#4f8ef7' : '#00d4ff',
      };
    }

    function resetParticles() {
      const { count } = getProfile();
      particles = [];
      for (let i = 0; i < count; i++) particles.push(mkParticle());
    }

    function draw(now = 0) {
      const { connectionDistance, frameInterval } = getProfile();

      if (!isVisible || particles.length === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      if (frameInterval > 0 && now - lastFrame < frameInterval) {
        animId = requestAnimationFrame(draw);
        return;
      }

      lastFrame = now;
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

      if (connectionDistance > 0) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 0.3;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = '#4f8ef7';
              ctx.globalAlpha = (1 - dist / connectionDistance) * 0.12;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    function refreshScene() {
      resize();
      resetParticles();
      lastFrame = 0;
    }

    function handleVisibilityChange() {
      isVisible = document.visibilityState === 'visible';
    }

    refreshScene();
    draw();
    window.addEventListener('resize', refreshScene);
    mobileQuery.addEventListener('change', refreshScene);
    reducedMotionQuery.addEventListener('change', refreshScene);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', refreshScene);
      mobileQuery.removeEventListener('change', refreshScene);
      reducedMotionQuery.removeEventListener('change', refreshScene);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
