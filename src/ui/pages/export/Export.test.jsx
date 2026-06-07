// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../hooks/useExportData.js', () => ({
  useExportData: vi.fn(() => ({
    yearsPayments: [], yearsExpenses: [], studentActive: [],
    divisions: [], concepts: [],
    filters: {
      payments: { years: [], divisions: [], concepts: [], methods: [] },
      expenses: { years: [] },
      students: { years: [], studentStatus: [] },
      all: {
        payments: { years: [], divisions: [], concepts: [], methods: [] },
        expenses: { years: [] },
        students: { years: [], studentStatus: [], concepts: [], divisions: [], methods: [] },
      },
    },
    setFilters: vi.fn(),
    error: '', setError: vi.fn(), message: '', setMessage: vi.fn(),
    isModalOpen: false, setIsModalOpen: vi.fn(),
    selectedType: null, setSelectedType: vi.fn(),
    selectData: null, setSelectData: vi.fn(),
    exportOptions: {
      yearPayments: [], yearExpenses: [], concepts: [],
      divisions: [], methods: [], studentStatus: [],
    },
    exportData: [],
    openExportModal: vi.fn(), closeExportModal: vi.fn(), handleExport: vi.fn(),
  })),
  EXPORT_FILTERS: { Pagos: {}, Gastos: {}, Estudiantes: {}, Todo: {} },
}));

vi.mock('../../components/exports/ExportCard', () => ({
  default: ({ title, onClick, disabled }) =>
    <div data-testid="export-card" data-title={title} data-disabled={disabled} onClick={onClick} />,
}));
vi.mock('../../components/exports/ExportForm', () => ({
  default: () => <div data-testid="export-form" />,
}));
vi.mock('../../components/generic/modal/Modal', () => ({
  default: ({ children, isOpen, title }) =>
    isOpen ? <div data-testid="modal" data-title={title}>{children}</div> : null,
}));
vi.mock('../../components/generic/message/ErrorMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="error-message">{message}</div> : null,
}));
vi.mock('../../components/icons/Icons', () => ({
  Users: () => <svg data-testid="icon-users" />,
  FileText: () => <svg data-testid="icon-filetext" />,
  TrendingUp: () => <svg data-testid="icon-trendingup" />,
  TrendingDown: () => <svg data-testid="icon-trendingdown" />,
}));

beforeEach(() => {
  window.api = {};
});

import Export from './Export.jsx';

describe('Export page', () => {
  it('renders title and export cards', async () => {
    await act(async () => {
      render(<Export />);
    });
    expect(screen.getByText('Exportación de Datos')).toBeInTheDocument();
    const cards = screen.getAllByTestId('export-card');
    expect(cards.length).toBe(4);
  });

  it('renders description text', async () => {
    await act(async () => {
      render(<Export />);
    });
    expect(
      screen.getByText(/Selecciona el módulo administrativo/i)
    ).toBeInTheDocument();
  });
});
