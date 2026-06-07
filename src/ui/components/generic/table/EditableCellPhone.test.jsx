// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableCellPhone from './EditableCellPhone.jsx';

describe('EditableCellPhone', () => {
  it('displays formatted phone value', () => {
    render(<EditableCellPhone value="12345678" onSave={() => {}} />);
    expect(screen.getByText('1234-5678')).toBeInTheDocument();
  });

  it('displays placeholder when value is empty', () => {
    render(<EditableCellPhone value="" onSave={() => {}} placeholder="—" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('displays formatted phone with 4 digits', () => {
    render(<EditableCellPhone value="1234" onSave={() => {}} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('displays dash when value is null', () => {
    render(<EditableCellPhone onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('displays dash when value is undefined', () => {
    render(<EditableCellPhone value={undefined} onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('enters edit mode on double click', async () => {
    const user = userEvent.setup();
    render(<EditableCellPhone value="12345678" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Enter key', async () => {
    const user = userEvent.setup();
    render(<EditableCellPhone value="12345678" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Space key', async () => {
    const user = userEvent.setup();
    render(<EditableCellPhone value="12345678" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('sanitizes phone input to digits only', async () => {
    const user = userEvent.setup();
    render(<EditableCellPhone value="" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.type(input, 'abc12-34');
    expect(input).toHaveValue('1234');
  });

  it('limits phone input to 8 digits', async () => {
    const user = userEvent.setup();
    render(<EditableCellPhone value="" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.type(input, '1234567890');
    expect(input).toHaveValue('12345678');
  });

  it('calls onSave on blur when value changed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellPhone value="12345678" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '87654321');
    await user.tab();
    expect(onSave).toHaveBeenCalledWith('87654321');
  });

  it('does not call onSave on blur when value unchanged', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellPhone value="12345678" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    await user.tab();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('cancels edit on Escape key', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellPhone value="12345678" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '87654321');
    await user.keyboard('{Escape}');
    expect(screen.getByText('1234-5678')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('commits change on Enter key', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellPhone value="12345678" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '87654321{Enter}');
    expect(onSave).toHaveBeenCalledWith('87654321');
  });

  it('has correct aria-label with value', () => {
    render(<EditableCellPhone value="12345678" onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar teléfono: 12345678');
  });

  it('has correct aria-label when empty', () => {
    render(<EditableCellPhone value="" onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar celda vacía');
  });

  it('applies custom width', () => {
    render(<EditableCellPhone value="12345678" onSave={() => {}} width="200px" />);
    expect(screen.getByRole('button')).toHaveStyle('width: 200px');
  });
});
