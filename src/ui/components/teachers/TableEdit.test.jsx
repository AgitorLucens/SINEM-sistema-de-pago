// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableEdit from './TableEdit.jsx';

const visibleColumns = {
  name: true,
  courseDivision: false,
  amount: true,
};

describe('TableEdit', () => {
  it('renders toggle button', () => {
    render(<TableEdit visibleColumns={visibleColumns} toggleColumn={() => {}} />);
    expect(screen.getByText('Columnas')).toBeInTheDocument();
  });

  it('shows column menu when button is clicked', () => {
    render(<TableEdit visibleColumns={visibleColumns} toggleColumn={() => {}} />);
    fireEvent.click(screen.getByText('Columnas'));
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Curso/División')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto')).toBeInTheDocument();
  });

  it('checks visible columns', () => {
    render(<TableEdit visibleColumns={visibleColumns} toggleColumn={() => {}} />);
    fireEvent.click(screen.getByText('Columnas'));
    expect(screen.getByLabelText('Nombre')).toBeChecked();
    expect(screen.getByLabelText('Curso/División')).not.toBeChecked();
    expect(screen.getByLabelText('Monto')).toBeChecked();
  });

  it('calls toggleColumn with correct key when checkbox is clicked', () => {
    const toggleColumn = vi.fn();
    render(<TableEdit visibleColumns={visibleColumns} toggleColumn={toggleColumn} />);
    fireEvent.click(screen.getByText('Columnas'));
    fireEvent.click(screen.getByLabelText('Nombre'));
    expect(toggleColumn).toHaveBeenCalledWith('name');
  });

  it('toggles menu visibility on each button click', () => {
    const { container } = render(<TableEdit visibleColumns={visibleColumns} toggleColumn={() => {}} />);
    fireEvent.click(screen.getByText('Columnas'));
    expect(container.querySelector('.column-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Columnas'));
    expect(container.querySelector('.column-menu')).not.toBeInTheDocument();
  });

  it('menu is hidden by default', () => {
    const { container } = render(<TableEdit visibleColumns={visibleColumns} toggleColumn={() => {}} />);
    expect(container.querySelector('.column-menu')).not.toBeInTheDocument();
  });
});
