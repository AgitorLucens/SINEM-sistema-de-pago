// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportCard from './ExportCard.jsx';

const TestIcon = () => <svg data-testid="icon" />;

describe('ExportCard', () => {
  it('renders title and description', () => {
    render(<ExportCard title="Excel" description="Export to Excel" icon={TestIcon} colorClass="color-excel" onClick={() => {}} />);
    expect(screen.getByText('Excel')).toBeInTheDocument();
    expect(screen.getByText('Export to Excel')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={() => {}} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders "Configurar excel" when enabled', () => {
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={() => {}} />);
    expect(screen.getByText('Configurar excel')).toBeInTheDocument();
  });

  it('calls onClick when enabled and clicked', () => {
    const onClick = vi.fn();
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={onClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled message when disabled is true', () => {
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={() => {}} disabled={true} disabledMessage="Not available" />);
    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={onClick} disabled={true} disabledMessage="Nope" />);
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not render "Configurar excel" when disabled', () => {
    render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={() => {}} disabled={true} disabledMessage="Nope" />);
    expect(screen.queryByText('Configurar excel')).not.toBeInTheDocument();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<ExportCard title="Test" description="Desc" icon={TestIcon} colorClass="color-excel" onClick={() => {}} disabled={true} disabledMessage="Nope" />);
    expect(container.querySelector('.export-card')).toHaveClass('export-card-disabled');
  });
});
