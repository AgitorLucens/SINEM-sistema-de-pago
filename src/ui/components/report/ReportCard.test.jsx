// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportCard from './ReportCard.jsx';

const TestIcon = () => <svg data-testid="icon" />;

describe('ReportCard', () => {
  it('renders title and description', () => {
    render(<ReportCard title="Ingresos" description="Reporte de ingresos" icon={TestIcon} colorClass="color-ingresos" onClick={() => {}} />);
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Reporte de ingresos')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<ReportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-ingresos" onClick={() => {}} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders "Ver reporte" text', () => {
    render(<ReportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-ingresos" onClick={() => {}} />);
    expect(screen.getByText('Ver reporte')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ReportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-ingresos" onClick={onClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies colorClass to container', () => {
    const { container } = render(<ReportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-ingresos" onClick={() => {}} />);
    expect(container.querySelector('.report-card')).toHaveClass('card-color-ingresos');
  });
});
