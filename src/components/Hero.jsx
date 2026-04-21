import { useLang } from '../context/LangContext';
import { ACCENT } from '../data';
import TypeWriter from './TypeWriter';
import { LinkedInIcon, GitHubIcon } from './Icons';
import avatarUrl from '/avatar.png';

function Avatar() {
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      border: '1.5px solid #2a2a2e', background: '#111114',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <img src={avatarUrl} alt="Ege Bilir" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      className="hero-section"
      style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '80px 48px 48px', maxWidth: 860, margin: '0 auto' }}
    >
      <div className="fade-up" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <Avatar />
          <div>
            <div className="mono section-label" style={{ marginBottom: 4, color: ACCENT }}>{t.heroTag}</div>
            <div style={{ fontSize: 13, color: '#555' }}>{t.heroSub}</div>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#f0ece5', marginBottom: 16 }}>
          Ege Bilir
        </h1>

        <p className="mono" style={{ fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#888', marginBottom: 28, letterSpacing: '0.02em' }}>
          <TypeWriter text={t.heroTyped} speed={45} delay={200} />
        </p>

        <p style={{ fontSize: 15, color: '#777', lineHeight: 1.8, maxWidth: 520, marginBottom: 40 }}>
          {t.heroBio}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <OutlineButton href="https://www.linkedin.com/in/ege-bilir-b17413158/" accent>
            <LinkedInIcon /> LinkedIn
          </OutlineButton>
          <OutlineButton href="https://github.com/egowic">
            <GitHubIcon /> GitHub
          </OutlineButton>
          <OutlineButton href="#contact">{t.heroBtn}</OutlineButton>
        </div>
      </div>
    </section>
  );
}

function OutlineButton({ href, accent, children }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 6,
    textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13, cursor: 'pointer', transition: 'background 0.2s, color 0.2s, border-color 0.2s',
    border: accent ? `1px solid ${ACCENT}` : '1px solid #222226',
    color: accent ? ACCENT : '#888',
  };

  const handleEnter = (e) => {
    if (accent) {
      e.currentTarget.style.background = ACCENT;
      e.currentTarget.style.color = '#fff';
    } else {
      e.currentTarget.style.borderColor = '#444';
      e.currentTarget.style.color = '#ccc';
    }
  };
  const handleLeave = (e) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.color = accent ? ACCENT : '#888';
    e.currentTarget.style.borderColor = accent ? ACCENT : '#222226';
  };

  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      style={base}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </a>
  );
}
