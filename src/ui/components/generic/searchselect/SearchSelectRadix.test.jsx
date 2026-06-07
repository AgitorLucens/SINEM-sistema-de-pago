// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchSelectRadix from './SearchSelectRadix.jsx';

const options = [
  { value: '1', label: 'Alajuela' },
  { value: '2', label: 'Heredia' },
  { value: '3', label: 'San José' },
];

describe('SearchSelectRadix', () => {
  it('renders trigger with placeholder', () => {
    render(<SearchSelectRadix options={options} onChange={() => {}} />);
    expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
  });

  it('renders with empty options', () => {
    render(<SearchSelectRadix options={[]} onChange={() => {}} />);
    expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
  });
});
