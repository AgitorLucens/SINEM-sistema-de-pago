// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PricingCard from './PricingCard.jsx';

const basePrice = {
  name: 'Mensualidad',
  amount: 25000,
};

describe('PricingCard', () => {
  it('renders price name in heading', () => {
    render(<PricingCard price={basePrice} id={1} onClick={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Mensualidad' })).toBeInTheDocument();
  });

  it('renders formatted amount in CRC', () => {
    render(<PricingCard price={basePrice} id={1} onClick={() => {}} />);
    expect(screen.getByText(/\u20A1/)).toBeInTheDocument();
  });

  it('renders "MONTO ACTUAL" label', () => {
    render(<PricingCard price={basePrice} id={1} onClick={() => {}} />);
    expect(screen.getByText('MONTO ACTUAL')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PricingCard price={basePrice} id={1} onClick={onClick} />);
    fireEvent.click(screen.getByRole('heading', { name: 'Mensualidad' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies card id class', () => {
    const { container } = render(<PricingCard price={basePrice} id={2} onClick={() => {}} />);
    expect(container.querySelector('.card')).toHaveClass('card-2');
  });

  it('renders with zero amount', () => {
    const zeroPrice = { name: 'Gratis', amount: 0 };
    render(<PricingCard price={zeroPrice} id={1} onClick={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Gratis' })).toBeInTheDocument();
  });
});
