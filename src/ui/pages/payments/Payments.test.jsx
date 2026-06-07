// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  addPaymentWithConsecutive: vi.fn().mockResolvedValue({ success: true, payment: {} }),
  deletePaymentById: vi.fn().mockResolvedValue({ success: true }),
  getPaymentAmount: vi.fn().mockResolvedValue(0),
  getNextConsecutiveByYear: vi.fn().mockResolvedValue(1),
  exportReceiptToExcel: vi.fn().mockResolvedValue({ success: true }),
  addPayment: vi.fn(),
  getAllPayments: vi.fn().mockResolvedValue([]),
  getPaymentConcepts: vi.fn().mockResolvedValue([]),
  getPaymentDivisions: vi.fn().mockResolvedValue([]),
  getAllStudents: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../hooks/usePaymentsData.js', () => ({
  usePaymentsData: vi.fn(() => ({
    payments: [], setPayments: vi.fn(), fetchPayments: vi.fn(),
    isLoading: false, concepts: [], divisions: [],
    students: [{ id: 1, name: 'Test Student' }],
    months: [], isTotalLoading: false,
  })),
}));

vi.mock('../../hooks/usePaymentFilters.js', () => ({
  usePaymentFilters: vi.fn(() => ({
    filterState: { concept: [], division: [], method: [], startDate: '', endDate: '' },
    setFilterState: vi.fn(),
    handleFilterChange: vi.fn(),
    handleClearFilters: vi.fn(),
    filteredPayments: [],
  })),
}));

vi.mock('../../hooks/useForm.js', () => {
  const mockResetForm = vi.fn();
  const mockSetFormData = vi.fn();
  const mockHandleChange = vi.fn();
  return {
    useForm: () => ({
      formData: {}, setFormData: mockSetFormData, handleChange: mockHandleChange,
      resetForm: mockResetForm, setField: vi.fn(), setFields: vi.fn(),
    }),
  };
});

vi.mock('../../hooks/useStatusMessages.js', () => {
  const mockSetMessage = vi.fn();
  const mockSetError = vi.fn();
  return {
    useStatusMessages: () => ({
      message: '', error: '', setMessage: mockSetMessage, setError: mockSetError,
      showMessage: vi.fn(), showError: vi.fn(), clearAll: vi.fn(),
    }),
  };
});

vi.mock('../../hooks/useEntityDelete.js', () => {
  const mockConfirmDelete = vi.fn();
  const mockCancelDelete = vi.fn();
  const mockOpenDeleteModal = vi.fn();
  return {
    useEntityDelete: () => ({
      confirmingId: null, isDeleteOpen: false, setIsDeleteOpen: vi.fn(),
      requestDelete: vi.fn(), confirmDelete: mockConfirmDelete,
      cancelDelete: mockCancelDelete, openDeleteModal: mockOpenDeleteModal,
    }),
  };
});

vi.mock('../../components/payments/PaymentsTable', () => ({
  default: () => <div data-testid="payments-table" />,
}));
vi.mock('../../components/payments/PaymentsForm', () => ({
  default: () => <div data-testid="payments-form" />,
}));
vi.mock('../../components/payments/PaymentsFilter', () => ({
  default: () => <div data-testid="payments-filter" />,
}));
vi.mock('../../components/payments/PaymentsDetail', () => ({
  default: () => <div data-testid="payments-detail" />,
}));
vi.mock('../../components/generic/modal/Modal', () => ({
  default: ({ children, isOpen, title }) =>
    isOpen ? <div data-testid="modal" data-title={title}>{children}</div> : null,
}));
vi.mock('../../components/generic/modal/ConfirmDeleteModal', () => ({
  default: ({ isOpen, title }) =>
    isOpen ? <div data-testid="confirm-modal" data-title={title} /> : null,
}));
vi.mock('../../components/generic/message/ErrorMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="error-message">{message}</div> : null,
}));
vi.mock('../../components/generic/message/SuccessMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="success-message">{message}</div> : null,
}));

vi.mock('@radix-ui/react-icons', () => ({
  PlusCircledIcon: () => <svg data-testid="plus-icon" />,
  InfoCircledIcon: () => <svg data-testid="info-icon" />,
  DownloadIcon: () => <svg data-testid="download-icon" />,
}));

beforeEach(() => {
  window.api = {
    getAllPayments: vi.fn().mockResolvedValue([]),
    getAllExpenses: vi.fn().mockResolvedValue([]),
    getAllStudents: vi.fn().mockResolvedValue([]),
    getAllTeachers: vi.fn().mockResolvedValue([]),
    getPaymentConcepts: vi.fn().mockResolvedValue([]),
    getPaymentDivisions: vi.fn().mockResolvedValue([]),
    getYearsOfPayments: vi.fn().mockResolvedValue([]),
    addPaymentWithConsecutive: vi.fn().mockResolvedValue({ success: true, payment: {} }),
    deletePaymentById: vi.fn().mockResolvedValue({ success: true }),
    getPaymentAmount: vi.fn().mockResolvedValue(0),
    getNextConsecutiveByYear: vi.fn().mockResolvedValue(1),
    exportReceiptToExcel: vi.fn().mockResolvedValue({ success: true }),
  };
});

import Payments from './Payments.jsx';

describe('Payments page', () => {
  it('renders title', async () => {
    render(<Payments />);
    expect(await screen.findByText('Gestión de Ingresos')).toBeInTheDocument();
  });

  it('renders filter, table, and register button', async () => {
    render(<Payments />);
    expect(await screen.findByTestId('payments-filter')).toBeInTheDocument();
    expect(screen.getByTestId('payments-table')).toBeInTheDocument();
    expect(screen.getByText('Registrar Nuevo Ingreso')).toBeInTheDocument();
  });
});
