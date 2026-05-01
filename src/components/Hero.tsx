import { useLang } from '../context/LangContext';
import TypeWriter from './TypeWriter';
import { LinkedInIcon, GitHubIcon } from './Icons';
import avatarUrl from '/avatar.png';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero-section" id="hero">
      <div className="hero-mesh" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      <div className="hero-content">
        <div className="hero-photo">
          <img src={avatarUrl} alt="Ege Bilir" />
        </div>

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {t.heroTag}
        </div>

        <h1 className="hero-name">Ege Bilir</h1>

        <p className="hero-role">
          <span>{t.heroSub}</span>
        </p>

        <p className="hero-typed">
          <TypeWriter text={t.heroTyped} speed={45} delay={200} />
        </p>

        <p className="hero-desc">{t.heroBio}</p>

        <div className="hero-ctas">
          <a
            href="https://www.linkedin.com/in/ege-bilir-b17413158/"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon /> LinkedIn
          </a>
          <a
            href="https://github.com/egowic"
            className="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon /> GitHub
          </a>
          <a href="#contact" className="btn-secondary">{t.heroBtn}</a>
        </div>
      </div>

      <div
        className="hero-scroll"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <div className="scroll-line" />
        <span>scroll</span>
      </div>

      <div className="aurora-line" aria-hidden="true" />
    </section>
  );
}
