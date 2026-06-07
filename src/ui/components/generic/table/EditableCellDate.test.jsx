// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableCellDate from './EditableCellDate.jsx';

vi.mock('../datepicker/DatePicker', () => ({
  default: ({ value, onChange }) => (
    <button
      data-testid="datepicker"
      onClick={() => onChange(new Date('2025-06-01T12:00:00.000Z'))}
    >
      DatePicker
    </button>
  ),
}));

describe('EditableCellDate', () => {
  it('displays formatted date value', () => {
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    expect(screen.getByText('15/1/2025')).toBeInTheDocument();
  });

  it('displays dash when value is empty', () => {
    render(<EditableCellDate value="" onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('displays dash when value is null', () => {
    render(<EditableCellDate value={null} onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('enters edit mode on double click', async () => {
    const user = userEvent.setup();
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('enters edit mode on Enter key', async () => {
    const user = userEvent.setup();
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('enters edit mode on Space key', async () => {
    const user = userEvent.setup();
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard(' ');
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('calls onSave when a new date is selected', () => {
    const onSave = vi.fn();
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={onSave} />);
    const cell = screen.getByRole('button');
    fireEvent.dblClick(cell);
    fireEvent.click(screen.getByTestId('datepicker'));
    expect(onSave).toHaveBeenCalledWith('2025-06-01T12:00:00.000Z');
  });

  it('exits edit mode when DatePicker onOpenChange is false', () => {
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    fireEvent.dblClick(screen.getByRole('button'));
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('has correct aria-label with formatted date', () => {
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar fecha: 15/1/2025');
  });

  it('has correct aria-label when empty', () => {
    render(<EditableCellDate value="" onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar celda vacía');
  });

  it('does not call onSave when value is the same', () => {
    const onSave = vi.fn();
    render(<EditableCellDate value="2025-01-15T12:00:00.000Z" onSave={onSave} />);
    fireEvent.dblClick(screen.getByRole('button'));
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
