// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  getAllExpenses: vi.fn().mockResolvedValue([]),
  addExpense: vi.fn().mockResolvedValue({ success: true }),
  deleteExpenseById: vi.fn().mockResolvedValue({ success: true }),
}));

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

vi.mock('../../components/expenses/ExpensesTable', () => ({
  default: () => <div data-testid="expenses-table" />,
}));
vi.mock('../../components/expenses/ExpensesForm', () => ({
  default: () => <div data-testid="expenses-form" />,
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
}));

beforeEach(() => {
  window.api = {
    getAllExpenses: vi.fn().mockResolvedValue([]),
    addExpense: vi.fn().mockResolvedValue({ success: true }),
    deleteExpenseById: vi.fn().mockResolvedValue({ success: true }),
  };
});

import Expenses from './Expenses.jsx';

describe('Expenses page', () => {
  it('renders title and table', async () => {
    render(<Expenses />);
    expect(await screen.findByText('Historial de Egresos')).toBeInTheDocument();
    expect(screen.getByTestId('expenses-table')).toBeInTheDocument();
  });

  it('renders register button', async () => {
    render(<Expenses />);
    expect(await screen.findByText('Registrar Nuevo Egreso')).toBeInTheDocument();
  });
});
