// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../components/report/ReportSelection', () => ({
  default: ({ onSelectReport }) =>
    <div data-testid="report-selection">
      <button onClick={() => onSelectReport('Ingresos')}>Ingresos</button>
      <button onClick={() => onSelectReport('IngresosEgresos')}>IngresosEgresos</button>
      <button onClick={() => onSelectReport('Morosidad por Profesor')}>Morosidad por Profesor</button>
      <button onClick={() => onSelectReport('Morosidad por Mes')}>Morosidad por Mes</button>
    </div>,
}));
vi.mock('../../components/report/IncomeReport', () => ({
  default: ({ onBack }) => <div data-testid="income-report"><button onClick={onBack}>Back</button></div>,
}));
vi.mock('../../components/report/CashRegisterReport', () => ({
  default: ({ onBack }) => <div data-testid="cash-register-report"><button onClick={onBack}>Back</button></div>,
}));
vi.mock('../../components/report/DelayByTeacherReport', () => ({
  default: ({ onBack }) => <div data-testid="delay-teacher-report"><button onClick={onBack}>Back</button></div>,
}));
vi.mock('../../components/report/DelayByMonthReport', () => ({
  default: ({ onBack }) => <div data-testid="delay-month-report"><button onClick={onBack}>Back</button></div>,
}));

beforeEach(() => {
  window.api = {};
});

import Report from './Report.jsx';

describe('Report page', () => {
  it('renders report selection screen by default', async () => {
    await act(async () => {
      render(<Report />);
    });
    expect(screen.getByTestId('report-selection')).toBeInTheDocument();
  });

  it('renders IncomeReport when Ingresos is selected', async () => {
    await act(async () => {
      render(<Report />);
    });
    await act(async () => {
      screen.getByText('Ingresos').click();
    });
    expect(screen.getByTestId('income-report')).toBeInTheDocument();
  });

  it('renders CashRegisterReport when IngresosEgresos is selected', async () => {
    await act(async () => {
      render(<Report />);
    });
    await act(async () => {
      screen.getByText('IngresosEgresos').click();
    });
    expect(screen.getByTestId('cash-register-report')).toBeInTheDocument();
  });

  it('renders DelayByTeacherReport when Morosidad por Profesor is selected', async () => {
    await act(async () => {
      render(<Report />);
    });
    await act(async () => {
      screen.getByText('Morosidad por Profesor').click();
    });
    expect(screen.getByTestId('delay-teacher-report')).toBeInTheDocument();
  });

  it('renders DelayByMonthReport when Morosidad por Mes is selected', async () => {
    await act(async () => {
      render(<Report />);
    });
    await act(async () => {
      screen.getByText('Morosidad por Mes').click();
    });
    expect(screen.getByTestId('delay-month-report')).toBeInTheDocument();
  });
});
