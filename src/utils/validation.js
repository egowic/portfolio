export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm({ name, email, message }) {
  const errors = {};
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

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
