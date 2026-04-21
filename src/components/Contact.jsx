import { useLang } from '../context/LangContext';
import { ACCENT } from '../data';
import { LinkedInIcon, GitHubIcon } from './Icons';

const CONTACT_ITEMS = [
  { label: 'email', value: 'ege.bilir@gmail.com', href: 'mailto:ege.bilir@gmail.com' },
  { label: 'tel', value: '+90 539 606 84 91', href: 'tel:+905396068491' },
];

export default function Contact() {
  const { t } = useLang();

  return (
    <section
      id="contact"
      className="section-inner"
      style={{ padding: '100px 48px 140px', maxWidth: 860, margin: '0 auto' }}
    >
      <hr className="divider" style={{ marginBottom: 64 }} />
      <div className="section-label">{t.s3label}</div>
      <h2 style={{ fontSize: 32, fontWeight: 300, color: '#f0ece5', marginBottom: 16, letterSpacing: '-0.02em' }}>
        {t.s3title}
      </h2>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.75, maxWidth: 460, marginBottom: 48 }}>{t.s3sub}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CONTACT_ITEMS.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span className="mono" style={{ fontSize: 11, color: '#444', width: 40, flexShrink: 0 }}>{item.label}</span>
            <a
              href={item.href}
              className="contact-link"
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: '#f0ece5',
                textDecoration: 'none', borderBottom: '1px solid #222226', paddingBottom: 4,
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#f0ece5'; e.currentTarget.style.borderColor = '#222226'; }}
            >
              {item.value}
            </a>
          </div>
        ))}
      </div>

      <div
        className="footer-row"
        style={{ marginTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span className="mono" style={{ fontSize: 11, color: '#2e2e32' }}>{t.footer}</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <SocialLink href="https://www.linkedin.com/in/ege-bilir-b17413158/"><LinkedInIcon /></SocialLink>
          <SocialLink href="https://github.com/egowic"><GitHubIcon /></SocialLink>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#333', transition: 'color 0.2s', display: 'flex' }}
      onMouseEnter={e => e.currentTarget.style.color = ACCENT}
      onMouseLeave={e => e.currentTarget.style.color = '#333'}
    >
      {children}
    </a>
  );
}
