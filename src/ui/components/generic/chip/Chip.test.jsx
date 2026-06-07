// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chip from './Chip.jsx';

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip>Active</Chip>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies selected class when selected is true', () => {
    const { container } = render(<Chip selected>Selected</Chip>);
    expect(container.querySelector('.chip')).toHaveClass('chip-active');
  });

  it('does not apply selected class when selected is false', () => {
    const { container } = render(<Chip selected={false}>Not Selected</Chip>);
    expect(container.querySelector('.chip')).not.toHaveClass('chip-active');
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Clickable</Chip>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-pressed when selected', () => {
    render(<Chip selected>Pressed</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed false when not selected', () => {
    render(<Chip selected={false}>Not Pressed</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies custom activeClass', () => {
    const { container } = render(<Chip selected activeClass="my-active">Custom</Chip>);
    expect(container.querySelector('.chip')).toHaveClass('my-active');
  });

  it('renders as a button', () => {
    render(<Chip>Btn</Chip>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
