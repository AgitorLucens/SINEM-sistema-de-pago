// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportSelection from './ReportSelection.jsx';

describe('ReportSelection', () => {
  it('renders the heading', () => {
    render(<ReportSelection onSelectReport={() => {}} />);
    expect(screen.getByText('Reportes')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ReportSelection onSelectReport={() => {}} />);
    expect(screen.getByText('Selecciona el tipo de reporte que deseas visualizar.')).toBeInTheDocument();
  });

  it('renders all four report cards', () => {
    render(<ReportSelection onSelectReport={() => {}} />);
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Ingresos y Egresos')).toBeInTheDocument();
    expect(screen.getByText('Morosidad por Profesor')).toBeInTheDocument();
    expect(screen.getByText('Morosidad por Mes')).toBeInTheDocument();
  });

  it('calls onSelectReport with correct value when Ingresos is clicked', () => {
    const onSelectReport = vi.fn();
    render(<ReportSelection onSelectReport={onSelectReport} />);
    fireEvent.click(screen.getByText('Ingresos'));
    expect(onSelectReport).toHaveBeenCalledWith('Ingresos');
  });

  it('calls onSelectReport with correct value when Morosidad por Profesor is clicked', () => {
    const onSelectReport = vi.fn();
    render(<ReportSelection onSelectReport={onSelectReport} />);
    fireEvent.click(screen.getByText('Morosidad por Profesor'));
    expect(onSelectReport).toHaveBeenCalledWith('Morosidad por Profesor');
  });

  it('calls onSelectReport with correct value when Ingresos y Egresos is clicked', () => {
    const onSelectReport = vi.fn();
    render(<ReportSelection onSelectReport={onSelectReport} />);
    fireEvent.click(screen.getByText('Ingresos y Egresos'));
    expect(onSelectReport).toHaveBeenCalledWith('IngresosEgresos');
  });

  it('calls onSelectReport with correct value when Morosidad por Mes is clicked', () => {
    const onSelectReport = vi.fn();
    render(<ReportSelection onSelectReport={onSelectReport} />);
    fireEvent.click(screen.getByText('Morosidad por Mes'));
    expect(onSelectReport).toHaveBeenCalledWith('Morosidad por Mes');
  });
});
