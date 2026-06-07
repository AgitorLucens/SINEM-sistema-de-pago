// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnToggleMenu from './ColumnToggleMenu.jsx';

const mockColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'phone', label: 'Teléfono' },
];

const mockVisibleColumns = {
  name: true,
  email: false,
  phone: true,
};

describe('ColumnToggleMenu', () => {
  it('renders the toggle button with default label', () => {
    render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={mockColumns} />);
    expect(screen.getByText('Columnas')).toBeInTheDocument();
  });

  it('renders the toggle button with custom label', () => {
    render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={mockColumns} buttonLabel="Campos" />);
    expect(screen.getByText('Campos')).toBeInTheDocument();
  });

  it('menu is closed by default', () => {
    render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={mockColumns} />);
    expect(screen.queryByText('Nombre')).not.toBeInTheDocument();
  });

  it('opens menu when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ColumnToggleMenu visibleColumns={mockVisibleColumns} toggleColumn={() => {}} columns={mockColumns} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Correo')).toBeInTheDocument();
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
  });

  it('closes menu when toggle button is clicked again', async () => {
    const user = userEvent.setup();
    render(<ColumnToggleMenu visibleColumns={mockVisibleColumns} toggleColumn={() => {}} columns={mockColumns} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    await user.click(button);
    expect(screen.queryByText('Nombre')).not.toBeInTheDocument();
  });

  it('renders checkboxes with correct checked state', async () => {
    const user = userEvent.setup();
    render(<ColumnToggleMenu visibleColumns={mockVisibleColumns} toggleColumn={() => {}} columns={mockColumns} />);
    await user.click(screen.getByRole('button'));
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('calls toggleColumn with column key when checkbox is toggled', async () => {
    const toggleColumn = vi.fn();
    const user = userEvent.setup();
    render(<ColumnToggleMenu visibleColumns={mockVisibleColumns} toggleColumn={toggleColumn} columns={mockColumns} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(toggleColumn).toHaveBeenCalledWith('name');
  });

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ColumnToggleMenu visibleColumns={mockVisibleColumns} toggleColumn={() => {}} columns={mockColumns} />
      </div>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Nombre')).not.toBeInTheDocument();
  });

  it('renders empty columns list gracefully', async () => {
    const user = userEvent.setup();
    const { container } = render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={[]} />);
    await user.click(screen.getByRole('button'));
    const menuItems = container.querySelectorAll('.column-menu-item');
    expect(menuItems.length).toBe(0);
  });

  it('renders with undefined columns gracefully', async () => {
    const user = userEvent.setup();
    render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('adds active class when menu is open', async () => {
    const user = userEvent.setup();
    const { container } = render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={mockColumns} />);
    const button = container.querySelector('.column-toggle-btn');
    expect(button).not.toHaveClass('active');
    await user.click(button);
    expect(button).toHaveClass('active');
  });

  it('renders ArchiveIcon and Chevron icons', () => {
    const { container } = render(<ColumnToggleMenu visibleColumns={{}} toggleColumn={() => {}} columns={mockColumns} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
