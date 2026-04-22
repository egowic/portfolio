import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { ACCENT } from '../data';
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
  const navBg = scrolled || menuOpen;

  return (
    <>
      <nav
        className="nav-bar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px', height: 60,
          background: navBg ? 'rgba(10,10,11,0.97)' : 'transparent',
          backdropFilter: navBg ? 'blur(12px)' : 'none',
          borderBottom: navBg ? '1px solid #18181c' : '1px solid transparent',
          transition: 'all 0.3s',
        }}
      >
        <span className="mono" style={{ fontSize: 13, color: '#444', letterSpacing: '0.05em' }}>
          eb<span style={{ color: ACCENT }}>_</span>
        </span>
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {t.nav.map((label, i) => (
            <a key={i} href={t.navHrefs[i]} className="nav-link">{label}</a>
          ))}
          <LangToggle />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="menu"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {t.nav.map((label, i) => (
          <a key={i} href={t.navHrefs[i]} className="nav-link" onClick={closeMenu}>{label}</a>
        ))}
        <div style={{ marginTop: 4, display: 'inline-flex' }}>
          <LangToggle />
        </div>
      </div>
    </>
  );
}
