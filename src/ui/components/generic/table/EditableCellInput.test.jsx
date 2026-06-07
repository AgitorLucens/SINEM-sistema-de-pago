// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableCellInput from './EditableCellInput.jsx';

describe('EditableCellInput', () => {
  it('displays value in view mode', () => {
    render(<EditableCellInput value="Hello" onSave={() => {}} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('displays placeholder when value is empty', () => {
    render(<EditableCellInput value="" onSave={() => {}} placeholder="—" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies formatDisplay in view mode', () => {
    const formatDisplay = (val) => `₡${val}`;
    render(<EditableCellInput value={5000} onSave={() => {}} formatDisplay={formatDisplay} />);
    expect(screen.getByText('₡5000')).toBeInTheDocument();
  });

  it('enters edit mode on double click', async () => {
    const user = userEvent.setup();
    render(<EditableCellInput value="Test" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Enter key', async () => {
    const user = userEvent.setup();
    render(<EditableCellInput value="Test" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('enters edit mode on Space key', async () => {
    const user = userEvent.setup();
    render(<EditableCellInput value="Test" onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onSave on blur when value changed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellInput value="Old" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New');
    await user.tab();
    expect(onSave).toHaveBeenCalledWith('New');
  });

  it('does not call onSave on blur when value unchanged', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellInput value="Same" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    await user.tab();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('cancels edit on Escape key', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellInput value="Original" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Changed');
    await user.keyboard('{Escape}');
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('commits change on Enter key', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCellInput value="Old" onSave={onSave} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New{Enter}');
    expect(onSave).toHaveBeenCalledWith('New');
  });

  it('has correct aria-label', () => {
    render(<EditableCellInput value="TestVal" onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar: TestVal');
  });
});
