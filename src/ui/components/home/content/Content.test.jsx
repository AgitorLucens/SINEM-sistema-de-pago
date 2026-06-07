// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Page } from '../../../constant/Pages.jsx';

vi.mock('../../../constant/DBFunctions.jsx', () => ({
  getCurrentImage: vi.fn().mockResolvedValue({ image: null }),
}));

const MockPage = ({ testId, text }) => <div data-testid={testId}>{text}</div>;

vi.mock('../../../pages/payments/Payments.jsx', () => ({
  default: () => <div data-testid="page-payments">Payments</div>,
}));
vi.mock('../../../pages/expenses/Expenses.jsx', () => ({
  default: () => <div data-testid="page-expenses">Expenses</div>,
}));
vi.mock('../../../pages/students/Students.jsx', () => ({
  default: () => <div data-testid="page-students">Students</div>,
}));
vi.mock('../../../pages/teachers/Teachers.jsx', () => ({
  default: () => <div data-testid="page-teachers">Teachers</div>,
}));
vi.mock('../../../pages/pricing/Pricing.jsx', () => ({
  default: () => <div data-testid="page-pricing">Pricing</div>,
}));
vi.mock('../../../pages/export/Export.jsx', () => ({
  default: () => <div data-testid="page-export">Export</div>,
}));
vi.mock('../../../pages/report/Report.jsx', () => ({
  default: () => <div data-testid="page-report">Report</div>,
}));
vi.mock('../../../pages/settings/Settings.jsx', () => ({
  default: () => <div data-testid="page-settings">Settings</div>,
}));

vi.mock('../../../assets/SINEM_home.png', () => ({ default: 'sinem-home.png' }));

beforeEach(() => {
  window.api = { getCurrentImage: vi.fn().mockResolvedValue({ image: null }) };
});

import Content from './Content.jsx';

describe('Content', () => {
  it('renders Panel Principal for Page.DASHBOARD', async () => {
    await act(async () => {
      render(<Content page={Page.DASHBOARD} />);
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Panel Principal' })).toBeInTheDocument();
  });

  it('renders Configuración Local for Page.SETTINGS', async () => {
    await act(async () => {
      render(<Content page={Page.SETTINGS} />);
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Configuración Local' })).toBeInTheDocument();
  });

  it('renders Payments component for Page.PAYMENT_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.PAYMENT_REGISTRY} />);
    });
    expect(screen.getByTestId('page-payments')).toBeInTheDocument();
  });

  it('renders Expenses component for Page.EXPENSES_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.EXPENSES_REGISTRY} />);
    });
    expect(screen.getByTestId('page-expenses')).toBeInTheDocument();
  });

  it('renders Students component for Page.STUDENTS_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.STUDENTS_REGISTRY} />);
    });
    expect(screen.getByTestId('page-students')).toBeInTheDocument();
  });

  it('renders Teachers component for Page.TEACHERS_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.TEACHERS_REGISTRY} />);
    });
    expect(screen.getByTestId('page-teachers')).toBeInTheDocument();
  });

  it('renders Pricing component for Page.PRICING_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.PRICING_REGISTRY} />);
    });
    expect(screen.getByTestId('page-pricing')).toBeInTheDocument();
  });

  it('renders Report component for Page.REPORT_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.REPORT_REGISTRY} />);
    });
    expect(screen.getByTestId('page-report')).toBeInTheDocument();
  });

  it('renders Export component for Page.EXPORT_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.EXPORT_REGISTRY} />);
    });
    expect(screen.getByTestId('page-export')).toBeInTheDocument();
  });

  it('renders Settings component for Page.SETTINGS_REGISTRY', async () => {
    await act(async () => {
      render(<Content page={Page.SETTINGS_REGISTRY} />);
    });
    expect(screen.getByTestId('page-settings')).toBeInTheDocument();
  });

  it('shows error for unknown page', async () => {
    await act(async () => {
      render(<Content page="unknown_page" />);
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Página No Encontrada' })).toBeInTheDocument();
  });

  it('renders sinem logo for dashboard', async () => {
    await act(async () => {
      render(<Content page={Page.DASHBOARD} />);
    });
    const img = screen.getByAltText('sinem-logo');
    expect(img).toBeInTheDocument();
  });
});
