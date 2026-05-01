import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangProvider } from '../../context/LangContext';
import Contact from '../../components/Contact';

vi.mock('../../lib/supabase', () => ({ supabase: { from: vi.fn() } }));
vi.mock('../../services/contactsService');
import { submitContact } from '../../services/contactsService';

beforeEach(() => {
  localStorage.setItem('portfolio-lang', 'en');
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

function renderContact() {
  return render(
    <LangProvider>
      <Contact />
    </LangProvider>
  );
}

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText('name'), 'Ege Bilir');
  await userEvent.type(screen.getByLabelText('email'), 'ege@example.com');
  await userEvent.type(screen.getByLabelText('message'), 'Hello, I would like to get in touch.');
}

describe('Contact', () => {
  it('renders form fields', () => {
    renderContact();
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('message')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderContact();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderContact();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('shows name validation error for short input', async () => {
    renderContact();
    await userEvent.type(screen.getByLabelText('name'), 'A');
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByText('At least 2 characters')).toBeInTheDocument();
    });
  });

  it('shows email validation error for invalid email', async () => {
    renderContact();
    await userEvent.type(screen.getByLabelText('email'), 'not-an-email');
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('clears field error when user starts typing', async () => {
    renderContact();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => screen.getAllByRole('alert'));

    await userEvent.type(screen.getByLabelText('name'), 'Ege');
    expect(screen.queryByText('At least 2 characters')).not.toBeInTheDocument();
  });

  it('shows success message after valid submission', async () => {
    vi.mocked(submitContact).mockResolvedValue(undefined);
    renderContact();
    await fillValidForm();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Message sent!');
    });
  });

  it('disables submit button after success', async () => {
    vi.mocked(submitContact).mockResolvedValue(undefined);
    renderContact();
    await fillValidForm();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => screen.getByRole('status'));
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('shows error message and applies cooldown on submission failure', async () => {
    vi.mocked(submitContact).mockRejectedValue(new Error('Network error'));
    renderContact();
    await fillValidForm();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('prevents double submission while sending', async () => {
    let resolveSubmit!: () => void;
    vi.mocked(submitContact).mockReturnValue(new Promise<void>(r => { resolveSubmit = r; }));
    renderContact();
    await fillValidForm();

    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    // Button should be disabled while sending
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    resolveSubmit();
    await waitFor(() => screen.getByRole('status'));
  });

  it('renders Turkish labels when lang is TR', () => {
    localStorage.setItem('portfolio-lang', 'tr');
    render(<LangProvider><Contact /></LangProvider>);
    expect(screen.getByLabelText('isim')).toBeInTheDocument();
    expect(screen.getByLabelText('e-posta')).toBeInTheDocument();
    expect(screen.getByLabelText('mesaj')).toBeInTheDocument();
  });

  it('inputs have aria-required attribute', () => {
    renderContact();
    expect(screen.getByLabelText('name')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText('email')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText('message')).toHaveAttribute('aria-required', 'true');
  });

  it('sets aria-invalid when field has error', async () => {
    renderContact();
    fireEvent.submit(screen.getByRole('form', { name: /contact form/i }));
    await waitFor(() => {
      expect(screen.getByLabelText('name')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
