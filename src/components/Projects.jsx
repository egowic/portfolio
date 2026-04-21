import { useLang } from '../context/LangContext';
import { ACCENT, PROJECTS } from '../data';

export default function Projects() {
  const { t, lang } = useLang();

  return (
    <section
      id="projects"
      className="section-inner"
      style={{ padding: '48px 48px 64px', maxWidth: 860, margin: '0 auto' }}
    >
      <hr className="divider" style={{ marginBottom: 64 }} />
      <div className="section-label">{t.s2label}</div>
      <h2 style={{ fontSize: 32, fontWeight: 300, color: '#f0ece5', marginBottom: 48, letterSpacing: '-0.02em' }}>
        {t.s2title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            className="card-hover project-card"
            style={{ border: '1px solid #18181c', borderRadius: 8, padding: '28px 32px', background: '#0d0d10' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span className="mono" style={{ fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {p.tag[lang]}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 400, color: '#f0ece5', marginTop: 6, letterSpacing: '-0.01em' }}>
                  {p.name}
                </h3>
              </div>
              <span className="mono" style={{ fontSize: 11, color: '#444' }}>{p.year}</span>
            </div>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>{p.desc[lang]}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.stack.map(tag => (
                  <span
                    key={tag}
                    className="mono"
                    style={{ fontSize: 10, color: '#555', background: '#111114', border: '1px solid #1e1e22', borderRadius: 4, padding: '3px 8px' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{ fontSize: 11, color: ACCENT, textDecoration: 'none', borderBottom: `1px solid ${ACCENT}`, paddingBottom: 2, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  visit site →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
