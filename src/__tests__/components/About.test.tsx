import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangProvider } from '../../context/LangContext';
import About from '../../components/About';
import { SKILLS, EXPERIENCE } from '../../data';

beforeEach(() => {
  localStorage.setItem('portfolio-lang', 'en');
});

afterEach(() => {
  localStorage.clear();
});

function renderAbout() {
  return render(
    <LangProvider>
      <About />
    </LangProvider>
  );
}

describe('About', () => {
  it('renders the section heading in English', () => {
    renderAbout();
    expect(screen.getByText('Background')).toBeInTheDocument();
  });

  it('renders the section heading in Turkish', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(
      <LangProvider>
        <About />
      </LangProvider>
    );
    expect(screen.getByText('Geçmişim')).toBeInTheDocument();
  });

  it('renders all skills as pills', () => {
    renderAbout();
    for (const skill of SKILLS) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it('renders all experience entries', () => {
    renderAbout();
    for (const exp of EXPERIENCE) {
      expect(screen.getByText(exp.company)).toBeInTheDocument();
      expect(screen.getByText(exp.role.en)).toBeInTheDocument();
    }
  });

  it('shows Present for current role in English', () => {
    renderAbout();
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it('shows Günümüz for current role in Turkish', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(
      <LangProvider>
        <About />
      </LangProvider>
    );
    expect(screen.getByText(/Günümüz/)).toBeInTheDocument();
  });

  it('renders Turkish experience role titles', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(
      <LangProvider>
        <About />
      </LangProvider>
    );
    expect(screen.getByText('Yazılım Geliştirici')).toBeInTheDocument();
  });
});
