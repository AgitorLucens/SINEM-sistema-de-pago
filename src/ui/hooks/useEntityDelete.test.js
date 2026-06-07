// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEntityDelete } from './useEntityDelete.js';

describe('useEntityDelete', () => {
  const onDelete = vi.fn().mockResolvedValue(undefined);
  const onRefresh = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with null confirmingId and closed modal', () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    expect(result.current.confirmingId).toBe(null);
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('requestDelete sets confirmingId', () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    act(() => {
      result.current.requestDelete(5);
    });
    expect(result.current.confirmingId).toBe(5);
  });

  it('requestDelete auto-clears confirmingId after 4000ms', () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    act(() => {
      result.current.requestDelete(5);
    });
    expect(result.current.confirmingId).toBe(5);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.confirmingId).toBe(null);
  });

  it('confirmDelete calls onDelete and onRefresh', async () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    act(() => {
      result.current.openDeleteModal(10);
    });
    expect(result.current.confirmingId).toBe(10);
    await act(async () => {
      await result.current.confirmDelete();
    });
    expect(onDelete).toHaveBeenCalledWith(10);
    expect(onRefresh).toHaveBeenCalled();
    expect(result.current.confirmingId).toBe(null);
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('confirmDelete does nothing if confirmingId is null', async () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    await act(async () => {
      await result.current.confirmDelete();
    });
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('cancelDelete clears confirmingId and closes modal', () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    act(() => {
      result.current.openDeleteModal(3);
    });
    act(() => {
      result.current.cancelDelete();
    });
    expect(result.current.confirmingId).toBe(null);
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('openDeleteModal sets both confirmingId and isDeleteOpen', () => {
    const { result } = renderHook(() =>
      useEntityDelete({ onDelete, onRefresh })
    );
    act(() => {
      result.current.openDeleteModal(7);
    });
    expect(result.current.confirmingId).toBe(7);
    expect(result.current.isDeleteOpen).toBe(true);
  });
});
