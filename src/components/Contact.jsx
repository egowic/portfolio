import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { ACCENT } from '../data';
import { LinkedInIcon, GitHubIcon } from './Icons';
import { supabase } from '../lib/supabase';

const CONTACT_ITEMS = [
  { label: 'email', value: 'ege.bilir@gmail.com', href: 'mailto:ege.bilir@gmail.com' },
  { label: 'tel', value: '+90 539 606 84 91', href: 'tel:+905396068491' },
];

const FORM_LABELS = {
  en: { name: 'name', email: 'email', message: 'message', send: 'send message →', sending: 'sending...', success: 'Message sent!', error: 'Something went wrong. Try again.' },
  tr: { name: 'isim', email: 'e-posta', message: 'mesaj', send: 'mesaj gönder →', sending: 'gönderiliyor...', success: 'Mesaj gönderildi!', error: 'Bir hata oluştu. Tekrar deneyin.' },
};

export default function Contact() {
  const { t, lang } = useLang();
  const fl = FORM_LABELS[lang];

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contacts').insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }
  }

  return (
    <section
      id="contact"
      className="section-inner"
      style={{ padding: '48px 48px 80px', maxWidth: 860, margin: '0 auto' }}
    >
      <hr className="divider" style={{ marginBottom: 64 }} />
      <div className="section-label">{t.s3label}</div>
      <h2 style={{ fontSize: 32, fontWeight: 300, color: '#f0ece5', marginBottom: 16, letterSpacing: '-0.02em' }}>
        {t.s3title}
      </h2>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.75, maxWidth: 460, marginBottom: 48 }}>{t.s3sub}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
        {['name', 'email'].map(field => (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="mono" style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>{fl[field]}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = ACCENT}
              onBlur={e => e.currentTarget.style.borderColor = '#1e1e22'}
            />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="mono" style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>{fl.message}</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.currentTarget.style.borderColor = ACCENT}
            onBlur={e => e.currentTarget.style.borderColor = '#1e1e22'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className="mono"
            style={{
              fontSize: 11, color: ACCENT, background: 'none', border: `1px solid ${ACCENT}`,
              borderRadius: 4, padding: '8px 16px', cursor: status === 'sending' ? 'wait' : 'pointer',
              transition: 'opacity 0.2s', opacity: status === 'success' ? 0.5 : 1,
            }}
          >
            {status === 'sending' ? fl.sending : fl.send}
          </button>
          {status === 'success' && (
            <span className="mono" style={{ fontSize: 11, color: '#4caf50' }}>{fl.success}</span>
          )}
          {status === 'error' && (
            <span className="mono" style={{ fontSize: 11, color: '#c0392b' }}>{fl.error}</span>
          )}
        </div>
      </form>

      <div
        className="footer-row"
        style={{ marginTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span className="mono" style={{ fontSize: 11, color: '#555' }}>{t.footer}</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <SocialLink href="https://www.linkedin.com/in/ege-bilir-b17413158/"><LinkedInIcon /></SocialLink>
          <SocialLink href="https://github.com/egowic"><GitHubIcon /></SocialLink>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  background: '#0d0d10',
  border: '1px solid #1e1e22',
  borderRadius: 4,
  padding: '10px 12px',
  color: '#f0ece5',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
};

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
