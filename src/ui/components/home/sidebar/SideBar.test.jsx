// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Page } from '../../../constant/Pages.jsx';

vi.mock('../navlink/NavLink.jsx', () => ({
  default: ({ icon: Icon, title, page, currentPage, onClick, isOpen }) => (
    <button
      data-testid={`navlink-${page}`}
      data-active={currentPage === page ? 'true' : 'false'}
      data-isopen={isOpen ? 'true' : 'false'}
      onClick={() => onClick(page)}
    >
      {Icon && <span data-testid={`icon-${page}`} />}
      {isOpen && <span>{title}</span>}
    </button>
  ),
}));

vi.mock('@radix-ui/react-icons', () => {
  const MockIcon = ({ 'aria-label': label }) => <svg data-testid="radix-icon" aria-label={label} />;
  return {
    ClipboardIcon: MockIcon,
    PersonIcon: MockIcon,
    ExitIcon: MockIcon,
    FileTextIcon: MockIcon,
    ArrowBottomLeftIcon: MockIcon,
    ChevronLeftIcon: MockIcon,
    ChevronRightIcon: MockIcon,
    Pencil2Icon: MockIcon,
    ReaderIcon: MockIcon,
    GearIcon: MockIcon,
  };
});

vi.mock('../../icons/Icons.jsx', () => ({
  HomeIcon: () => <svg data-testid="home-icon" />,
  IconArrowDownLeft: () => <svg data-testid="arrow-icon" />,
  TeacherIcon: () => <svg data-testid="teacher-icon" />,
  TrendingUp: () => <svg data-testid="trending-icon" />,
}));

beforeEach(() => {
  window.api = { quitApp: vi.fn() };
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

import Sidebar from './SideBar.jsx';

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    expect(screen.getByText('Panel Principal')).toBeInTheDocument();
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Egresos')).toBeInTheDocument();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Profesores')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Reporte')).toBeInTheDocument();
    expect(screen.getByText('Exportar')).toBeInTheDocument();
  });

  it('renders footer items (Configuración and Salir)', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('renders a toggle button', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    expect(screen.getByRole('button', { name: /colapsar/i })).toBeInTheDocument();
  });

  it('passes currentPage to NavLink items', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    const dashboardLink = screen.getByTestId('navlink-dashboard');
    expect(dashboardLink).toHaveAttribute('data-active', 'true');
    const paymentLink = screen.getByTestId('navlink-payment_registry');
    expect(paymentLink).toHaveAttribute('data-active', 'false');
  });

  it('calls setCurrentPage when a nav item is clicked', () => {
    const setCurrentPage = vi.fn();
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={setCurrentPage} />);
    fireEvent.click(screen.getByTestId('navlink-payment_registry'));
    expect(setCurrentPage).toHaveBeenCalledWith(Page.PAYMENT_REGISTRY);
  });

  it('calls window.api.quitApp when Salir is clicked', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    fireEvent.click(screen.getByTestId('navlink-settings'));
    expect(window.api.quitApp).toHaveBeenCalled();
  });

  it('toggles sidebar width when toggle button is clicked', () => {
    const { container } = render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveStyle('width: 16rem');
    fireEvent.click(screen.getByRole('button', { name: /colapsar/i }));
    expect(nav).toHaveStyle('width: 5rem');
  });

  it('accepts external isOpen and setIsOpen props', () => {
    const setIsOpen = vi.fn();
    const { container } = render(
      <Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} isOpen={false} setIsOpen={setIsOpen} />
    );
    const nav = container.querySelector('nav');
    expect(nav).toHaveStyle('width: 5rem');
    fireEvent.click(screen.getByRole('button', { name: /expandir/i }));
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it('sets aria-label on the nav element', () => {
    render(<Sidebar currentPage={Page.DASHBOARD} setCurrentPage={vi.fn()} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Navegación principal');
  });
});
