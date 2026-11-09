// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTableControls from './useTableControls';

const KEYS = ['name', 'amount'];
const makeItems = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `i${i}`, amount: n - i }));

describe('useTableControls', () => {
  it('paginates items by 5 per page', () => {
    const { result } = renderHook(() => useTableControls(makeItems(12), KEYS));
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentItems).toHaveLength(5);
  });

  it('navigates pages via paginate', () => {
    const { result } = renderHook(() => useTableControls(makeItems(12), KEYS));
    act(() => result.current.paginate(2));
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems[0].id).toBe(6);
  });

  it('clamps currentPage when items shrink below current page', () => {
    const { result, rerender } = renderHook(({ items }) => useTableControls(items, KEYS), {
      initialProps: { items: makeItems(12) },
    });
    act(() => result.current.paginate(3));
    expect(result.current.currentPage).toBe(3);

    rerender({ items: makeItems(4) });
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toHaveLength(4);
  });

  it('resets to page 1 when items become empty', () => {
    const { result, rerender } = renderHook(({ items }) => useTableControls(items, KEYS), {
      initialProps: { items: makeItems(7) },
    });
    act(() => result.current.paginate(2));

    rerender({ items: [] });
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toEqual([]);
  });

  it('sorts ascending, descending and back to default', () => {
    const { result } = renderHook(() => useTableControls(makeItems(3), KEYS));

    act(() => result.current.requestSort('amount'));
    expect(result.current.sortConfig.direction).toBe('ascending');
    expect(result.current.currentItems[0].amount).toBe(1);

    act(() => result.current.requestSort('amount'));
    expect(result.current.sortConfig.direction).toBe('descending');
    expect(result.current.currentItems[0].amount).toBe(3);

    act(() => result.current.requestSort('amount'));
    expect(result.current.sortConfig.direction).toBe('default');
  });

  it('sorts null/undefined values safely using getSortValue', () => {
    const items = [
      { id: 1, name: 'b', extra: null },
      { id: 2, name: 'a', extra: 'x' },
      { id: 3, name: 'c', extra: undefined },
    ];
    const getSortValue = (item, key) => (key === 'extra' ? item.extra : item[key]);
    const { result } = renderHook(() => useTableControls(items, [...KEYS, 'extra'], { getSortValue }));

    act(() => result.current.requestSort('extra'));
    expect(result.current.currentItems.map(i => i.id)).toEqual([1, 3, 2]);
  });

  it('toggleColumn flips column visibility', () => {
    const { result } = renderHook(() => useTableControls([], KEYS));
    expect(result.current.visibleColumns).toEqual({ name: true, amount: true });

    act(() => result.current.toggleColumn('name'));
    expect(result.current.visibleColumns.name).toBe(false);

    act(() => result.current.toggleColumn('name'));
    expect(result.current.visibleColumns.name).toBe(true);
  });
});
