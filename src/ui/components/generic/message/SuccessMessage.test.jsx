// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuccessMessage from './SuccessMessage.jsx';

describe('SuccessMessage', () => {
  it('renders the message text', () => {
    render(<SuccessMessage message="Operation successful" />);
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('renders with success styling', () => {
    const { container } = render(<SuccessMessage message="Success!" />);
    expect(container.querySelector('.success-message')).toBeInTheDocument();
  });
});
