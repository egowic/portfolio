import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import LangToggle from './LangToggle';

export default function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`nav-bar${scrolled || menuOpen ? ' scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <span className="nav-logo">EB</span>
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {t.nav.map((label, i) => {
            const isLast = i === t.nav.length - 1;
            return (
              <a
                key={i}
                href={t.navHrefs[i]}
                className={`nav-link${isLast ? ' nav-cta' : ''}`}
              >
                {label}
              </a>
            );
          })}
          <LangToggle />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </nav>
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
      >
        {t.nav.map((label, i) => (
          <a key={i} href={t.navHrefs[i]} className="nav-link" onClick={closeMenu}>{label}</a>
        ))}
        <div style={{ marginTop: 4, display: 'inline-flex' }}>
          <LangToggle />
        </div>
      </nav>
    </>
  );
}
