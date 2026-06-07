// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import SplashScreen from './SplashScreen.jsx';

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the logo and title', () => {
    render(<SplashScreen onFinish={() => {}} />);
    expect(screen.getByText('SINEM')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestión de Pagos')).toBeInTheDocument();
  });

  it('renders loading spinner dots', () => {
    const { container } = render(<SplashScreen onFinish={() => {}} />);
    const dots = container.querySelectorAll('.splash-spinner-dot');
    expect(dots.length).toBe(3);
  });

  it('does not have fade-out class initially', () => {
    const { container } = render(<SplashScreen onFinish={() => {}} />);
    expect(container.querySelector('.splash-overlay')).not.toHaveClass('splash-fade-out');
  });

  it('adds fade-out class after 1500ms', () => {
    const { container } = render(<SplashScreen onFinish={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(container.querySelector('.splash-overlay')).toHaveClass('splash-fade-out');
  });

  it('calls onFinish after 2000ms total (1500 + 500)', () => {
    const onFinish = vi.fn();
    render(<SplashScreen onFinish={onFinish} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('does not call onFinish before timeout', () => {
    const onFinish = vi.fn();
    render(<SplashScreen onFinish={onFinish} />);
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const onFinish = vi.fn();
    const { unmount } = render(<SplashScreen onFinish={onFinish} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('renders SVG logo', () => {
    const { container } = render(<SplashScreen onFinish={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
