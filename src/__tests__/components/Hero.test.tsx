import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangProvider } from '../../context/LangContext';
import Hero from '../../components/Hero';

beforeEach(() => {
  localStorage.setItem('portfolio-lang', 'en');
});

afterEach(() => {
  localStorage.clear();
});

function renderHero() {
  return render(
    <LangProvider>
      <Hero />
    </LangProvider>
  );
}

describe('Hero', () => {
  it('renders the name', () => {
    renderHero();
    expect(screen.getByText('Ege Bilir')).toBeInTheDocument();
  });

  it('renders avatar image with alt text', () => {
    renderHero();
    const avatar = screen.getByAltText('Ege Bilir');
    expect(avatar).toBeInTheDocument();
  });

  it('renders LinkedIn link', () => {
    renderHero();
    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub link', () => {
    renderHero();
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'));
  });

  it('renders CTA button linking to contact section', () => {
    renderHero();
    expect(screen.getByText('get in touch →').closest('a')).toHaveAttribute('href', '#contact');
  });

  it('renders Turkish content when lang is TR', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(
      <LangProvider>
        <Hero />
      </LangProvider>
    );
    expect(screen.getByText('iletişime geç →')).toBeInTheDocument();
    expect(screen.getByText('İstanbul, Türkiye')).toBeInTheDocument();
  });

});
