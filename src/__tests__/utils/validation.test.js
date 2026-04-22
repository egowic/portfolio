import { describe, it, expect } from 'vitest';
import { validateContactForm, isValid } from '../../utils/validation';

describe('validateContactForm', () => {
  it('returns no errors for valid input', () => {
    const errors = validateContactForm({
      name: 'Ege Bilir',
      email: 'ege@example.com',
      message: 'This is a valid message.',
    });
    expect(isValid(errors)).toBe(true);
  });

  it('returns error for short name', () => {
    const errors = validateContactForm({ name: 'A', email: 'ege@example.com', message: 'Valid message here' });
    expect(errors.name).toBeDefined();
  });

  it('returns error for invalid email', () => {
    const errors = validateContactForm({ name: 'Ege', email: 'not-an-email', message: 'Valid message here' });
    expect(errors.email).toBeDefined();
  });

  it('returns error for short message', () => {
    const errors = validateContactForm({ name: 'Ege', email: 'ege@example.com', message: 'Hi' });
    expect(errors.message).toBeDefined();
  });

  it('returns multiple errors for multiple invalid fields', () => {
    const errors = validateContactForm({ name: '', email: '', message: '' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it('trims whitespace before validation', () => {
    const errors = validateContactForm({ name: '  ', email: '  ', message: '  ' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
