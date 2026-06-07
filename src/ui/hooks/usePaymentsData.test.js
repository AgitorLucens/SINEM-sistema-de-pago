// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePaymentsData } from './usePaymentsData';
import {
  getPaymentConcepts,
  getPaymentDivisions,
  getAllPayments,
  getAllStudents,
} from '../constant/DBFunctions.jsx';

vi.mock('../constant/DBFunctions.jsx', () => ({
  getPaymentConcepts: vi.fn(),
  getPaymentDivisions: vi.fn(),
  getAllPayments: vi.fn(),
  getAllStudents: vi.fn(),
}));

const mockConcepts = [{ id: 1, name: 'Matrícula' }];
const mockDivisions = [{ id: 1, name: '1ro A' }];
const mockStudents = [{ id: 1, name: 'Juan' }];
const mockPayments = [
  { id: 1, timestamp: '2024-01-10T10:00:00Z' },
  { id: 2, timestamp: '2024-03-15T10:00:00Z' },
  { id: 3, timestamp: '2024-02-01T10:00:00Z' },
];

function setupMocks({ concepts, divisions, students, payments } = {}) {
  getPaymentConcepts.mockResolvedValue(concepts ?? mockConcepts);
  getPaymentDivisions.mockResolvedValue(divisions ?? mockDivisions);
  getAllStudents.mockResolvedValue(students ?? mockStudents);
  getAllPayments.mockResolvedValue(payments ?? mockPayments);
}

describe('usePaymentsData', () => {
  const setError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('initializes with empty arrays and months', async () => {
    let result;
    renderHook(() => {
      const hook = usePaymentsData(setError);
      result = hook;
      return hook;
    });

    expect(result.payments).toEqual([]);
    expect(result.concepts).toEqual([]);
    expect(result.divisions).toEqual([]);
    expect(result.students).toEqual([]);
    expect(result.months).toHaveLength(12);
  });

  it('months contains all 12 Spanish month labels', async () => {
    const { result } = renderHook(() => usePaymentsData(setError));

    const labels = result.current.months.map((m) => m.label);
    expect(labels).toEqual([
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ]);
    expect(result.current.months.map((m) => m.value)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
  });

  it('fetches payments on mount and sorts by timestamp descending', async () => {
    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getAllPayments).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const ids = result.current.payments.map((p) => p.id);
      expect(ids).toEqual([2, 3, 1]);
    });
  });

  it('fetches concepts on mount', async () => {
    renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getPaymentConcepts).toHaveBeenCalledTimes(1);
    });
  });

  it('fetches divisions on mount', async () => {
    renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getPaymentDivisions).toHaveBeenCalledTimes(1);
    });
  });

  it('fetches students on mount', async () => {
    renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getAllStudents).toHaveBeenCalledTimes(1);
    });
  });

  it('sets isLoading during fetch, false after', async () => {
    let resolvePayments;
    getAllPayments.mockReturnValue(new Promise((r) => { resolvePayments = r; }));
    getPaymentConcepts.mockResolvedValue(mockConcepts);
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(mockStudents);

    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => { resolvePayments(mockPayments); });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('isTotalLoading combines isLoading + isConceptsLoading + isDivisionsLoading', async () => {
    let resolveConcepts;
    getPaymentConcepts.mockReturnValue(new Promise((r) => { resolveConcepts = r; }));
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(mockStudents);
    getAllPayments.mockResolvedValue(mockPayments);

    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(result.current.isTotalLoading).toBe(true);
    });

    await act(async () => { resolveConcepts(mockConcepts); });

    await waitFor(() => {
      expect(result.current.isTotalLoading).toBe(false);
    });
  });

  it('handles fetchPayments error - calls setError', async () => {
    const error = new Error('DB connection failed');
    getAllPayments.mockRejectedValue(error);
    getPaymentConcepts.mockResolvedValue(mockConcepts);
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(mockStudents);

    renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(
        'Error al cargar datos desde la base de datos local: DB connection failed'
      );
    });
  });

  it('handles metadata fetch error - calls setError with specific message', async () => {
    getPaymentConcepts.mockRejectedValue(new Error('fail'));
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(mockStudents);
    getAllPayments.mockResolvedValue(mockPayments);

    renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(
        'No se pudieron cargar los conceptos/cursos de pago.'
      );
    });
  });

  it('falls back to empty array when concepts is not an array', async () => {
    getPaymentConcepts.mockResolvedValue({ error: 'not an array' });
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(mockStudents);
    getAllPayments.mockResolvedValue(mockPayments);

    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(result.current.concepts).toEqual([]);
    });
  });

  it('falls back to empty array when divisions is not an array', async () => {
    getPaymentConcepts.mockResolvedValue(mockConcepts);
    getPaymentDivisions.mockResolvedValue('not an array');
    getAllStudents.mockResolvedValue(mockStudents);
    getAllPayments.mockResolvedValue(mockPayments);

    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(result.current.divisions).toEqual([]);
    });
  });

  it('falls back to empty array when students is not an array', async () => {
    getPaymentConcepts.mockResolvedValue(mockConcepts);
    getPaymentDivisions.mockResolvedValue(mockDivisions);
    getAllStudents.mockResolvedValue(42);
    getAllPayments.mockResolvedValue(mockPayments);

    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(result.current.students).toEqual([]);
    });
  });

  it('fetchPayments can be called manually again (re-fetch)', async () => {
    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getAllPayments).toHaveBeenCalledTimes(1);
    });

    getAllPayments.mockResolvedValue([{ id: 99, timestamp: '2025-01-01T00:00:00Z' }]);

    await act(async () => {
      await result.current.fetchPayments();
    });

    expect(getAllPayments).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(result.current.payments).toEqual([{ id: 99, timestamp: '2025-01-01T00:00:00Z' }]);
    });
  });

  it('setPayments allows external updates', async () => {
    const { result } = renderHook(() => usePaymentsData(setError));

    await waitFor(() => {
      expect(getAllPayments).toHaveBeenCalledTimes(1);
    });

    const newPayments = [{ id: 100, timestamp: '2026-01-01T00:00:00Z' }];

    await act(() => {
      result.current.setPayments(newPayments);
    });

    expect(result.current.payments).toEqual(newPayments);
  });
});
