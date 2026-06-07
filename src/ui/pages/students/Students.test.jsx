// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  getAllStudents: vi.fn().mockResolvedValue([]),
  addStudent: vi.fn().mockResolvedValue({ success: true }),
  deleteStudentById: vi.fn().mockResolvedValue({ success: true }),
  getYearsOfPayments: vi.fn().mockResolvedValue([]),
  getPaymentByStudentId: vi.fn().mockResolvedValue([]),
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
  const mockShowMessage = vi.fn();
  const mockShowError = vi.fn();
  return {
    useStatusMessages: () => ({
      message: '', error: '', setMessage: mockSetMessage, setError: mockSetError,
      showMessage: mockShowMessage, showError: mockShowError, clearAll: vi.fn(),
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

vi.mock('../../components/students/StudentsTable', () => ({
  default: () => <div data-testid="students-table" />,
}));
vi.mock('../../components/students/StudentDetail', () => ({
  default: () => <div data-testid="student-detail" />,
}));
vi.mock('../../components/students/StudentsForm', () => ({
  default: () => <div data-testid="student-form" />,
}));
vi.mock('../../components/students/StudentImportCard', () => ({
  default: () => <div data-testid="student-import-card" />,
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
  ArrowUpIcon: () => <svg data-testid="arrow-up-icon" />,
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
    addStudent: vi.fn().mockResolvedValue({ success: true }),
    deleteStudentById: vi.fn().mockResolvedValue({ success: true }),
    getPaymentByStudentId: vi.fn().mockResolvedValue([]),
  };
});

import Students from './Students.jsx';

describe('Students page', () => {
  it('renders title', async () => {
    render(<Students />);
    expect(await screen.findByText('Estudiantes')).toBeInTheDocument();
  });

  it('renders table and action buttons', async () => {
    render(<Students />);
    expect(await screen.findByTestId('students-table')).toBeInTheDocument();
    expect(screen.getByText('Registrar Nuevo Estudiante')).toBeInTheDocument();
    expect(screen.getByText('Importar Estudiantes')).toBeInTheDocument();
  });
});
