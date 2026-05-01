import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../context/LangContext';
import Nav from '../../components/Nav';

beforeEach(() => {
  localStorage.setItem('portfolio-lang', 'en');
});

afterEach(() => {
  localStorage.clear();
});

function renderNav() {
  return render(
    <LangProvider>
      <Nav />
    </LangProvider>
  );
}

describe('Nav', () => {
  it('renders desktop navigation links', () => {
    renderNav();
    const aboutLinks = screen.getAllByText('01. about');
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders language toggle', () => {
    renderNav();
    expect(screen.getAllByText('EN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TR').length).toBeGreaterThan(0);
  });

  it('hamburger toggles aria-expanded', () => {
    renderNav();
    const hamburger = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('hamburger controls mobile-nav', () => {
    renderNav();
    const hamburger = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(hamburger).toHaveAttribute('aria-controls', 'mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');
    expect(mobileNav).not.toBeNull();
  });

  it('closes mobile menu when a nav link is clicked', () => {
    renderNav();
    const hamburger = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    const mobileLinks = document.querySelectorAll('#mobile-nav .nav-link');
    fireEvent.click(mobileLinks[0]);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders Turkish nav links when lang is TR', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(
      <LangProvider>
        <Nav />
      </LangProvider>
    );
    expect(screen.getAllByText('01. hakkımda').length).toBeGreaterThan(0);
  });
});
