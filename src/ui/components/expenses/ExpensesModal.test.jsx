// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpensesModal from './ExpensesModal.jsx';

describe('ExpensesModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ExpensesModal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </ExpensesModal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders title when isOpen is true', () => {
    render(
      <ExpensesModal isOpen={true} onClose={() => {}} title="Modal Title">
        <p>Content</p>
      </ExpensesModal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('renders children when isOpen is true', () => {
    render(
      <ExpensesModal isOpen={true} onClose={() => {}} title="Test">
        <p data-testid="child">Child Element</p>
      </ExpensesModal>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Child Element');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ExpensesModal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </ExpensesModal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with no title', () => {
    render(
      <ExpensesModal isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </ExpensesModal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
