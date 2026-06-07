// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStatusMessages } from './useStatusMessages.js';

describe('useStatusMessages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with empty message and error', () => {
    const { result } = renderHook(() => useStatusMessages());
    expect(result.current.message).toBe('');
    expect(result.current.error).toBe('');
  });

  it('showMessage sets message', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showMessage('Success!');
    });
    expect(result.current.message).toBe('Success!');
  });

  it('showError sets error', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showError('Something failed');
    });
    expect(result.current.error).toBe('Something failed');
  });

  it('auto-dismisses message after 5000ms', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showMessage('Temp message');
    });
    expect(result.current.message).toBe('Temp message');
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.message).toBe('');
  });

  it('auto-dismisses error after 5000ms', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showError('Temp error');
    });
    expect(result.current.error).toBe('Temp error');
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.error).toBe('');
  });

  it('clearAll clears both message and error', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showMessage('Msg');
      result.current.showError('Err');
    });
    act(() => {
      result.current.clearAll();
    });
    expect(result.current.message).toBe('');
    expect(result.current.error).toBe('');
  });

  it('calling showMessage twice resets the timer', () => {
    const { result } = renderHook(() => useStatusMessages());
    act(() => {
      result.current.showMessage('First');
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    act(() => {
      result.current.showMessage('Second');
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.message).toBe('Second');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.message).toBe('');
  });
});
