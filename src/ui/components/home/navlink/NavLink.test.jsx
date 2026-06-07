// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavLink from './NavLink.jsx';

const HomeIcon = () => <svg data-testid="icon" />;

describe('NavLink', () => {
  it('renders button with title when isOpen is true', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="home" onClick={() => {}} isOpen={true} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="home" onClick={() => {}} isOpen={true} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies active class when currentPage matches page', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="home" onClick={() => {}} isOpen={true} />);
    expect(screen.getByRole('button')).toHaveClass('nav-link-active');
  });

  it('does not apply active class when currentPage does not match', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="other" onClick={() => {}} isOpen={true} />);
    expect(screen.getByRole('button')).not.toHaveClass('nav-link-active');
  });

  it('hides title text when isOpen is false', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="home" onClick={() => {}} isOpen={false} />);
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
  });

  it('calls onClick with page when clicked', () => {
    const onClick = vi.fn();
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="other" onClick={onClick} isOpen={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('home');
  });

  it('sets aria-label when isOpen is false', () => {
    render(<NavLink icon={HomeIcon} title="Inicio" page="home" currentPage="home" onClick={() => {}} isOpen={false} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Inicio');
  });
});
