// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableCellSearchDropdown from './EditableCellSearchDropdown.jsx';

const mockOptions = [
  { value: '1', label: 'Search A' },
  { value: '2', label: 'Search B' },
  { value: '3', label: 'Search C' },
];

vi.mock('../searchselect/SearchSelectRadix', () => ({
  default: ({ value, options, valueKey, labelKey, onChange }) => (
    <select
      data-testid="search-select-radix"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt[valueKey]} value={String(opt[valueKey])}>
          {opt[labelKey]}
        </option>
      ))}
    </select>
  ),
}));

describe('EditableCellSearchDropdown', () => {
  it('displays value in view mode', () => {
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} />);
    expect(screen.getByText('Search A')).toBeInTheDocument();
  });

  it('displays dash when value is empty', () => {
    render(<EditableCellSearchDropdown value="" options={mockOptions} onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('displays dash when value is null', () => {
    render(<EditableCellSearchDropdown value={null} options={mockOptions} onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders with undefined options gracefully', () => {
    render(<EditableCellSearchDropdown value="" onSave={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('enters edit mode on double click', async () => {
    const user = userEvent.setup();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} />);
    const cell = screen.getByRole('button');
    await user.dblClick(cell);
    expect(screen.getByTestId('search-select-radix')).toBeInTheDocument();
  });

  it('enters edit mode on Enter key', async () => {
    const user = userEvent.setup();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('search-select-radix')).toBeInTheDocument();
  });

  it('enters edit mode on Space key', async () => {
    const user = userEvent.setup();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} />);
    const cell = screen.getByRole('button');
    cell.focus();
    await user.keyboard(' ');
    expect(screen.getByTestId('search-select-radix')).toBeInTheDocument();
  });

  it('calls onSave with new value when selected', () => {
    const onSave = vi.fn();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={onSave} />);
    fireEvent.dblClick(screen.getByRole('button'));
    fireEvent.change(screen.getByTestId('search-select-radix'), { target: { value: '2' } });
    expect(onSave).toHaveBeenCalledWith('2');
  });

  it('does not call onSave when same value is selected', () => {
    const onSave = vi.fn();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} valueKey="label" onSave={onSave} />);
    fireEvent.dblClick(screen.getByRole('button'));
    const select = screen.getByTestId('search-select-radix');
    fireEvent.change(select, { target: { value: 'Search A' } });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('has correct aria-label with value', () => {
    render(<EditableCellSearchDropdown value="Search B" options={mockOptions} onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar: Search B');
  });

  it('has correct aria-label when empty', () => {
    render(<EditableCellSearchDropdown value="" options={mockOptions} onSave={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Editar celda vacía');
  });

  it('applies custom width in edit mode', async () => {
    const user = userEvent.setup();
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} width="300px" />);
    await user.dblClick(screen.getByRole('button'));
    expect(screen.getByTestId('search-select-radix').parentElement).toHaveStyle('width: 300px');
  });

  it('uses custom valueKey and labelKey', () => {
    const customOptions = [
      { id: 'a', name: 'Alpha' },
      { id: 'b', name: 'Beta' },
    ];
    render(<EditableCellSearchDropdown value="Alpha" options={customOptions} valueKey="id" labelKey="name" onSave={() => {}} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('exits edit mode when select closes', () => {
    render(<EditableCellSearchDropdown value="Search A" options={mockOptions} onSave={() => {}} />);
    fireEvent.dblClick(screen.getByRole('button'));
    expect(screen.getByTestId('search-select-radix')).toBeInTheDocument();
  });
});
