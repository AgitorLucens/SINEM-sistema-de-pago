// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  getAllTeachers: vi.fn().mockResolvedValue([]),
  addTeacher: vi.fn().mockResolvedValue({ success: true }),
  getPaymentDivisions: vi.fn().mockResolvedValue([]),
  deleteTeacherById: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('../../hooks/useForm.js', () => ({
  useForm: vi.fn(() => ({
    formData: {}, setFormData: vi.fn(), handleChange: vi.fn(),
    resetForm: vi.fn(), setField: vi.fn(), setFields: vi.fn(),
  })),
}));

vi.mock('../../hooks/useStatusMessages.js', () => ({
  useStatusMessages: vi.fn(() => ({
    message: '', error: '', setMessage: vi.fn(), setError: vi.fn(),
    showMessage: vi.fn(), showError: vi.fn(), clearAll: vi.fn(),
  })),
}));

vi.mock('../../hooks/useEntityDelete.js', () => ({
  useEntityDelete: vi.fn(() => ({
    confirmingId: null, isDeleteOpen: false, setIsDeleteOpen: vi.fn(),
    requestDelete: vi.fn(), confirmDelete: vi.fn(), cancelDelete: vi.fn(),
    openDeleteModal: vi.fn(),
  })),
}));

vi.mock('../../components/teachers/TeachersTable', () => ({
  default: () => <div data-testid="teachers-table" />,
}));
vi.mock('../../components/teachers/TeacherForm', () => ({
  default: () => <div data-testid="teacher-form" />,
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
    getAllPayments: vi.fn().mockResolvedValue([]),
    getAllExpenses: vi.fn().mockResolvedValue([]),
    getAllStudents: vi.fn().mockResolvedValue([]),
    getAllTeachers: vi.fn().mockResolvedValue([]),
    getPaymentConcepts: vi.fn().mockResolvedValue([]),
    getPaymentDivisions: vi.fn().mockResolvedValue([]),
    getYearsOfPayments: vi.fn().mockResolvedValue([]),
    addTeacher: vi.fn().mockResolvedValue({ success: true }),
    deleteTeacherById: vi.fn().mockResolvedValue({ success: true }),
  };
});

import Teachers from './Teachers.jsx';

describe('Teachers page', () => {
  it('renders title', async () => {
    await act(async () => {
      render(<Teachers />);
    });
    expect(screen.getByText('Profesores')).toBeInTheDocument();
  });

  it('renders table and register button', async () => {
    await act(async () => {
      render(<Teachers />);
    });
    expect(screen.getByTestId('teachers-table')).toBeInTheDocument();
    expect(screen.getByText('Registrar Nuevo Profesor')).toBeInTheDocument();
  });
});
