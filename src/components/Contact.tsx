import { useState, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { LinkedInIcon, GitHubIcon } from './Icons';
import { submitContact } from '../services/contactsService';
import { validateContactForm, isValid } from '../utils/validation';
import type { ContactFormData, ValidationErrors } from '../types';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface FormLabels {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
}

const FORM_LABELS: Record<'en' | 'tr', FormLabels> = {
  en: {
    name: 'NAME', email: 'EMAIL', message: 'MESSAGE',
    send: 'Send Message →', sending: 'Sending...',
    success: "Message sent! I'll get back to you within 24 hours.", error: 'Something went wrong. Try again.',
  },
  tr: {
    name: 'İSİM', email: 'E-POSTA', message: 'MESAJ',
    send: 'Mesaj Gönder →', sending: 'Gönderiliyor...',
    success: 'Mesaj gönderildi! 24 saat içinde döneceğim.', error: 'Bir hata oluştu. Tekrar deneyin.',
  },
};

export default function Contact() {
  const { t, lang } = useLang();
  const fl = FORM_LABELS[lang];

  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [cooldown, setCooldown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ValidationErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending' || status === 'success' || cooldown) return;
    const errors = validateContactForm(form);
    if (!isValid(errors)) { setFieldErrors(errors); return; }
    setStatus('sending');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setFieldErrors({});
    } catch {
      setStatus('error');
      setCooldown(true);
      cooldownTimer.current = setTimeout(() => { setCooldown(false); setStatus('idle'); }, 10000);
    }
  }

  const isDisabled = status === 'sending' || status === 'success' || cooldown;

  return (
    <section id="contact" className="contact-section">
      <div className="section-inner">
        <div className="contact-grid">
          {/* Left: info */}
          <div>
            <div className="section-label">{t.s3label}</div>
            <h2 className="contact-title"><span>{t.s3title}</span></h2>
            <p className="contact-copy">{t.s3sub}</p>
            <div className="contact-links">
              <a href="mailto:ege.bilir@gmail.com" className="contact-link">
                <div className="contact-link-icon">✉</div>
                ege.bilir@gmail.com
              </a>
              <a href="tel:+905396068491" className="contact-link">
                <div className="contact-link-icon" style={{ fontSize: 13 }}>☎</div>
                +90 539 606 84 91
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {status === 'success' ? (
              <div style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                color: 'var(--text)',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{fl.success}</div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">{fl.name}</label>
                    <input
                      id="contact-name"
                      className={`form-input${fieldErrors.name ? ' error' : ''}`}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && (
                      <span role="alert" className="mono" style={{ fontSize: 11, color: '#c0392b' }}>
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">{fl.email}</label>
                    <input
                      id="contact-email"
                      className={`form-input${fieldErrors.email ? ' error' : ''}`}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && (
                      <span role="alert" className="mono" style={{ fontSize: 11, color: '#c0392b' }}>
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">{fl.message}</label>
                  <textarea
                    id="contact-message"
                    className={`form-textarea${fieldErrors.message ? ' error' : ''}`}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.message}
                  />
                  {fieldErrors.message && (
                    <span role="alert" className="mono" style={{ fontSize: 11, color: '#c0392b' }}>
                      {fieldErrors.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isDisabled}
                  aria-busy={status === 'sending'}
                >
                  {status === 'sending' ? fl.sending : fl.send}
                </button>
                {(status === 'error' || cooldown) && (
                  <span role="alert" className="mono" style={{ fontSize: 11, color: '#c0392b' }}>
                    {fl.error}
                  </span>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="footer-copy">{t.footer}</span>
          <div className="footer-links">
            <a href="https://github.com/egowic" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/ege-bilir-b17413158/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
