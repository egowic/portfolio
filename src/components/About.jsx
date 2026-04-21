import { useLang } from '../context/LangContext';
import { ACCENT, SKILLS, EXPERIENCE } from '../data';

export default function About() {
  const { t, lang } = useLang();

  return (
    <section
      id="about"
      className="section-inner"
      style={{ padding: '48px 48px 64px', maxWidth: 860, margin: '0 auto' }}
    >
      <hr className="divider" style={{ marginBottom: 64 }} />
      <div className="section-label">{t.s1label}</div>
      <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 300, color: '#f0ece5', marginBottom: 20, letterSpacing: '-0.02em' }}>
            {t.s1title}
          </h2>
          <p style={{ color: '#777', lineHeight: 1.8, fontSize: 14, marginBottom: 16 }}>{t.s1p1}</p>
          <p style={{ color: '#777', lineHeight: 1.8, fontSize: 14, marginBottom: 16 }}>{t.s1p2}</p>
          <p style={{ color: '#777', lineHeight: 1.8, fontSize: 14 }}>{t.s1p3}</p>
        </div>
        <div>
          <h3 style={{ fontSize: 14, color: '#f0ece5', marginBottom: 20, fontWeight: 400 }}>{t.expTitle}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ borderLeft: '1px solid #222226', paddingLeft: 16 }}>
                <div style={{ fontSize: 13, color: '#c8c4be', fontWeight: 500 }}>{exp.role[lang]}</div>
                <div className="mono" style={{ fontSize: 11, color: ACCENT, marginTop: 2 }}>{exp.company}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                  {exp.period === null ? t.expPresent : exp.period} · {exp.loc[lang]}
                </div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 14, color: '#f0ece5', marginBottom: 16, fontWeight: 400 }}>{t.skillTitle}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map(s => <span key={s} className="skill-pill">{s}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
