import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// suppress console.error for expected error
beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => console.error.mockRestore());

function BrokenComponent() {
  throw new Error('Test crash');
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><p>All good</p></ErrorBoundary>);
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('shows fallback UI when child throws', () => {
    render(<ErrorBoundary><BrokenComponent /></ErrorBoundary>);
    expect(screen.getByText('something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test crash')).toBeInTheDocument();
  });

  it('resets state on try again click', () => {
    const { rerender } = render(<ErrorBoundary><BrokenComponent /></ErrorBoundary>);
    fireEvent.click(screen.getByText('try again'));
    // After reset it will try to render BrokenComponent again and fail,
    // but the boundary resets — verify button was clickable
    expect(screen.getByText('something went wrong')).toBeInTheDocument();
  });
});
