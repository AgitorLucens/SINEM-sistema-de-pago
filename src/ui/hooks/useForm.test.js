// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm.js';

describe('useForm', () => {
  const initialState = { name: '', amount: 0, active: true };

  it('initializes with initial state', () => {
    const { result } = renderHook(() => useForm(initialState));
    expect(result.current.formData).toEqual(initialState);
  });

  it('handleChange updates a single field', () => {
    const { result } = renderHook(() => useForm(initialState));
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'Juan' } });
    });
    expect(result.current.formData.name).toBe('Juan');
    expect(result.current.formData.amount).toBe(0);
  });

  it('resetForm restores initial state', () => {
    const { result } = renderHook(() => useForm(initialState));
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'Juan' } });
    });
    expect(result.current.formData.name).toBe('Juan');
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formData).toEqual(initialState);
  });

  it('setField updates a single field imperatively', () => {
    const { result } = renderHook(() => useForm(initialState));
    act(() => {
      result.current.setField('amount', 5000);
    });
    expect(result.current.formData.amount).toBe(5000);
  });

  it('setFields merges multiple fields', () => {
    const { result } = renderHook(() => useForm(initialState));
    act(() => {
      result.current.setFields({ name: 'Maria', amount: 10000 });
    });
    expect(result.current.formData.name).toBe('Maria');
    expect(result.current.formData.amount).toBe(10000);
    expect(result.current.formData.active).toBe(true);
  });

  it('resetForm after setFields restores initial state', () => {
    const { result } = renderHook(() => useForm(initialState));
    act(() => {
      result.current.setFields({ name: 'Maria', amount: 10000 });
    });
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formData).toEqual(initialState);
  });
});
