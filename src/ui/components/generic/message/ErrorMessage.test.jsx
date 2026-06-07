// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage.jsx';

describe('ErrorMessage', () => {
  it('renders the error message text', () => {
    render(<ErrorMessage message="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders with error styling', () => {
    const { container } = render(<ErrorMessage message="Error!" />);
    expect(container.querySelector('.error-message')).toBeInTheDocument();
  });
});
