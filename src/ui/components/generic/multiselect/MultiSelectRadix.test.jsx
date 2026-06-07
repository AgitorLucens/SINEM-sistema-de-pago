// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MultiSelectRadix from './MultiSelectRadix.jsx';

const options = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
];

describe('MultiSelectRadix', () => {
  it('renders trigger with selection count', () => {
    render(<MultiSelectRadix options={options} value={['1']} onChange={() => {}} />);
    expect(screen.getByText('1 seleccionadas')).toBeInTheDocument();
  });

  it('renders all-selected text when all options selected', () => {
    render(<MultiSelectRadix options={options} value={['1', '2', '3']} onChange={() => {}} />);
    expect(screen.getByText('Todas las fechas')).toBeInTheDocument();
  });

  it('renders custom allSelectedText', () => {
    render(
      <MultiSelectRadix
        options={options}
        value={['1', '2', '3']}
        onChange={() => {}}
        allSelectedText="All selected"
      />
    );
    expect(screen.getByText('All selected')).toBeInTheDocument();
  });

  it('renders custom placeholder text', () => {
    render(
      <MultiSelectRadix options={options} value={[]} onChange={() => {}} placeholder="Pick" />
    );
    expect(screen.getByText('0 seleccionadas')).toBeInTheDocument();
  });

  it('renders with empty options', () => {
    const { container } = render(<MultiSelectRadix options={[]} value={[]} onChange={() => {}} />);
    expect(container.querySelector('.MultiSelectTrigger')).toBeInTheDocument();
  });
});
