// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from './DatePicker.jsx';

describe('DatePicker', () => {
  it('renders placeholder when no value is provided', () => {
    render(<DatePicker onChange={() => {}} />);
    expect(screen.getByText('Seleccionar fecha')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<DatePicker onChange={() => {}} placeholder="Pick a date" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders formatted date when value is provided', () => {
    const date = new Date(2025, 0, 15);
    render(<DatePicker value={date} onChange={() => {}} />);
    expect(screen.getByText('15/01/2025')).toBeInTheDocument();
  });

  it('renders the trigger button', () => {
    render(<DatePicker onChange={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has a calendar icon', () => {
    const { container } = render(<DatePicker onChange={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
