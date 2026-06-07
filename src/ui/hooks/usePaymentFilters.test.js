// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentFilters } from './usePaymentFilters.js';

const mockPayments = [
  { concept_type: 'Matricula', division_name: 'Violin', payment_method: 'Efectivo', date: '2024-03-15', amount: 10000 },
  { concept_type: 'Mensualidad', division_name: 'Piano', payment_method: 'Transferencia', date: '2024-06-01', amount: 5000 },
  { concept_type: 'Matricula', division_name: 'Piano', payment_method: 'Efectivo', date: '2024-01-10', amount: 10000 },
];

const mockConcepts = [
  { name: 'Matricula' },
  { name: 'Mensualidad' },
];

const mockDivisions = [
  { name: 'Violin' },
  { name: 'Piano' },
];

describe('usePaymentFilters', () => {
  it('initializes with all concepts/divisions/methods selected', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    expect(result.current.filterState.concept).toEqual(['Matricula', 'Mensualidad']);
    expect(result.current.filterState.division).toEqual(['Violin', 'Piano']);
    expect(result.current.filterState.method).toEqual(['Efectivo', 'Transferencia']);
  });

  it('returns all payments when all filters selected', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    expect(result.current.filteredPayments).toHaveLength(3);
  });

  it('filters by concept', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.setFilterState(prev => ({
        ...prev,
        concept: ['Mensualidad'],
      }));
    });
    expect(result.current.filteredPayments).toHaveLength(1);
    expect(result.current.filteredPayments[0].concept_type).toBe('Mensualidad');
  });

  it('filters by division', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.setFilterState(prev => ({
        ...prev,
        division: ['Violin'],
      }));
    });
    expect(result.current.filteredPayments).toHaveLength(1);
    expect(result.current.filteredPayments[0].division_name).toBe('Violin');
  });

  it('filters by method', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.setFilterState(prev => ({
        ...prev,
        method: ['Transferencia'],
      }));
    });
    expect(result.current.filteredPayments).toHaveLength(1);
    expect(result.current.filteredPayments[0].payment_method).toBe('Transferencia');
  });

  it('filters by date range', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.setFilterState(prev => ({
        ...prev,
        startDate: '2024-03-01',
        endDate: '2024-05-31',
      }));
    });
    expect(result.current.filteredPayments).toHaveLength(1);
    expect(result.current.filteredPayments[0].date).toBe('2024-03-15');
  });

  it('returns empty array for empty payments', () => {
    const { result } = renderHook(() =>
      usePaymentFilters([], mockConcepts, mockDivisions)
    );
    expect(result.current.filteredPayments).toEqual([]);
  });

  it('handleClearFilters resets to all selected', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.setFilterState(prev => ({
        ...prev,
        concept: ['Mensualidad'],
      }));
    });
    expect(result.current.filteredPayments).toHaveLength(1);
    act(() => {
      result.current.handleClearFilters();
    });
    expect(result.current.filteredPayments).toHaveLength(3);
  });

  it('handleFilterChange updates filter state', () => {
    const { result } = renderHook(() =>
      usePaymentFilters(mockPayments, mockConcepts, mockDivisions)
    );
    act(() => {
      result.current.handleFilterChange({ target: { name: 'startDate', value: '2024-01-01' } });
    });
    expect(result.current.filterState.startDate).toBe('2024-01-01');
  });
});
