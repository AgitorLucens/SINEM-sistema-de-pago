// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExportData } from './useExportData.js';

const mockApi = {
  getYearsOfPayments: vi.fn().mockResolvedValue([{ year: 2024 }]),
  getYearsOfExpenses: vi.fn().mockResolvedValue([{ year: 2024 }]),
  getStudentsActive: vi.fn().mockResolvedValue([{ active: 1 }, { active: 0 }]),
  getPaymentDivisions: vi.fn().mockResolvedValue([{ id: 1, name: 'Violin' }]),
  getPaymentConcepts: vi.fn().mockResolvedValue([{ id: 1, name: 'Matricula' }]),
  getAllPayments: vi.fn().mockResolvedValue([]),
  getAllExpenses: vi.fn().mockResolvedValue([]),
  getAllStudents: vi.fn().mockResolvedValue([]),
  exportPaymentsByYearToExcel: vi.fn().mockResolvedValue({ success: true }),
  exportExpensesByYearToExcel: vi.fn().mockResolvedValue({ success: true }),
  exportStudentsByActiveToExcel: vi.fn().mockResolvedValue({ success: true }),
  exportHistoric: vi.fn().mockResolvedValue({ success: true }),
};

beforeEach(() => {
  vi.clearAllMocks();
  window.api = mockApi;
});

describe('useExportData', () => {
  it('initializes with empty state', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    expect(result.current.error).toBe('');
    expect(result.current.message).toBe('');
    expect(result.current.isModalOpen).toBe(null);
    expect(result.current.selectedType).toBe(null);
  });

  it('fetches data on mount', async () => {
    renderHook(() => useExportData());
    await waitFor(() => {
      expect(mockApi.getYearsOfPayments).toHaveBeenCalled();
      expect(mockApi.getYearsOfExpenses).toHaveBeenCalled();
      expect(mockApi.getStudentsActive).toHaveBeenCalled();
      expect(mockApi.getPaymentDivisions).toHaveBeenCalled();
      expect(mockApi.getPaymentConcepts).toHaveBeenCalled();
    });
  });

  it('openExportModal sets type and opens modal', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.openExportModal('Pagos');
    });
    expect(result.current.selectedType).toBe('Pagos');
    expect(result.current.isModalOpen).toBe(true);
  });

  it('closeExportModal resets error/message and closes modal', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.openExportModal('Pagos');
    });
    act(() => {
      result.current.setError('some error');
    });
    act(() => {
      result.current.closeExportModal();
    });
    expect(result.current.error).toBe('');
    expect(result.current.message).toBe('');
    expect(result.current.isModalOpen).toBe(false);
  });

  it('handleExport for Pagos validates missing concepts', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
      result.current.setIsModalOpen(true);
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { ...prev.payments, concepts: [], divisions: [1], methods: [0], years: [2024] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un concepto de pago.');
    expect(mockApi.exportPaymentsByYearToExcel).not.toHaveBeenCalled();
  });

  it('handleExport for Pagos validates missing divisions', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { ...prev.payments, concepts: [1], divisions: [], methods: [0], years: [2024] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un curso.');
  });

  it('handleExport for Pagos validates missing methods', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { ...prev.payments, concepts: [1], divisions: [1], methods: [], years: [2024] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un metodo de pago.');
  });

  it('handleExport for Pagos validates missing years', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { ...prev.payments, concepts: [1], divisions: [1], methods: [0], years: [] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un año.');
  });

  it('handleExport for Gastos validates missing years', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Gastos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        expenses: { years: [] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un año para los gastos');
  });

  it('handleExport for Estudiantes validates missing studentStatus', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Estudiantes');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        students: { ...prev.students, studentStatus: [], years: [2024] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un estado de estudiante.');
  });

  it('handleExport for Estudiantes validates missing years', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Estudiantes');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        students: { ...prev.students, studentStatus: [1], years: [] },
      }));
    });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('Escoja al menos un año.');
  });

  it('handleExport for Pagos calls export with valid filters', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { concepts: [1], divisions: [1], methods: [0], years: [2024] },
      }));
    });
    mockApi.getAllPayments.mockResolvedValueOnce([]);
    await act(async () => {
      await result.current.handleExport();
    });
    expect(mockApi.exportPaymentsByYearToExcel).toHaveBeenCalled();
  });

  it('handleExport sets error when export returns failure', async () => {
    const { result } = renderHook(() => useExportData());
    await waitFor(() => expect(mockApi.getYearsOfPayments).toHaveBeenCalled());
    act(() => {
      result.current.setSelectedType('Pagos');
    });
    act(() => {
      result.current.setFilters(prev => ({
        ...prev,
        payments: { concepts: [1], divisions: [1], methods: [0], years: [2024] },
      }));
    });
    mockApi.getAllPayments.mockResolvedValueOnce([]);
    mockApi.exportPaymentsByYearToExcel.mockResolvedValueOnce({ success: false, error: 'File error' });
    await act(async () => {
      await result.current.handleExport();
    });
    expect(result.current.error).toBe('File error');
  });
});
