// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectRadix from './SelectRadix.jsx';

const options = [
  { value: '1', label: 'Option A' },
  { value: '2', label: 'Option B' },
];

describe('SelectRadix', () => {
  it('renders trigger with placeholder', () => {
    render(<SelectRadix options={options} onChange={() => {}} />);
    expect(screen.getByText('Seleccione una opción')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<SelectRadix label="My Label" options={options} onChange={() => {}} />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('renders with empty options array', () => {
    const { container } = render(<SelectRadix options={[]} onChange={() => {}} />);
    expect(container.querySelector('.SelectTrigger')).toBeInTheDocument();
  });
});
