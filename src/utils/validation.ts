import type { ContactFormData, ValidationErrors } from '../types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm({ name, email, message }: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!name.trim() || name.trim().length < 2) {
    errors.name = 'At least 2 characters';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Invalid email address';
  }
  if (!message.trim() || message.trim().length < 10) {
    errors.message = 'At least 10 characters';
  }
  return errors;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
