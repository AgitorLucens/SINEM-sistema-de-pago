// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useResizableTable from './useResizableTable';

const KEY = 'testTableWidth';

describe('useResizableTable', () => {
  let store;
  let writes;

  const installStorage = () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => {
          writes.push([k, String(v)]);
          store.set(k, String(v));
        },
        removeItem: (k) => store.delete(k),
      },
    });
  };

  beforeEach(() => {
    store = new Map();
    writes = [];
    installStorage();
  });

  it('starts at minWidth when nothing is stored', () => {
    const { result } = renderHook(() => useResizableTable(KEY, 600));
    expect(result.current.tableWidth).toBe(600);
  });

  it('falls back to minWidth on corrupt or invalid stored values', () => {
    installStorage();
    store.set(KEY, 'not-a-number');
    const { result } = renderHook(() => useResizableTable(KEY, 600));
    expect(result.current.tableWidth).toBe(600);

    store.set(KEY, '-50');
    const { result: result2 } = renderHook(() => useResizableTable(KEY, 600));
    expect(result2.current.tableWidth).toBe(600);
  });

  it('survives a throwing storage without crashing', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => { throw new Error('blocked'); },
        setItem: () => { throw new Error('blocked'); },
      },
    });
    const { result } = renderHook(() => useResizableTable(KEY, 600));
    expect(result.current.tableWidth).toBe(600);
    expect(() => result.current.handleMouseDown(new MouseEvent('mousedown', { clientX: 0 }))).not.toThrow();
  });

  it('resizes on drag and persists once on mouseup', () => {
    const { result } = renderHook(() => useResizableTable(KEY, 600));

    act(() => result.current.handleMouseDown(new MouseEvent('mousedown', { clientX: 0, bubbles: true })));
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, bubbles: true }));
    });
    expect(result.current.tableWidth).toBe(700);
    expect(writes).toHaveLength(0);

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(writes).toEqual([[KEY, '700']]);
    expect(store.get(KEY)).toBe('700');
  });

  it('restores persisted width on mount', () => {
    store.set(KEY, '850');
    const { result } = renderHook(() => useResizableTable(KEY, 600));
    expect(result.current.tableWidth).toBe(850);
  });
});
