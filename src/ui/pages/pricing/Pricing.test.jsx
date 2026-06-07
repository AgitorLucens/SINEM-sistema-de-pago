// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  getPaymentConcepts: vi.fn().mockResolvedValue([]),
  getPaymentDivisions: vi.fn().mockResolvedValue([]),
  updatePriceConcept: vi.fn().mockResolvedValue({ success: true }),
  updatePriceDivision: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('../../components/pricing/PricingCard', () => ({
  default: ({ price, onClick }) =>
    <div data-testid="pricing-card" onClick={onClick}>{price?.name}</div>,
}));
vi.mock('../../components/pricing/PricingForm', () => ({
  default: () => <div data-testid="pricing-form" />,
}));
vi.mock('../../components/pricing/PricingTable', () => ({
  default: ({ onBack }) => <div data-testid="pricing-table"><button onClick={onBack}>Back</button></div>,
}));
vi.mock('../../components/generic/modal/Modal', () => ({
  default: ({ children, isOpen, title }) =>
    isOpen ? <div data-testid="modal" data-title={title}>{children}</div> : null,
}));
vi.mock('../../components/generic/message/ErrorMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="error-message">{message}</div> : null,
}));
vi.mock('../../components/generic/message/SuccessMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="success-message">{message}</div> : null,
}));

vi.mock('@radix-ui/react-icons', () => ({
  TableIcon: () => <svg data-testid="table-icon" />,
}));

beforeEach(() => {
  window.api = {
    getAllPayments: vi.fn().mockResolvedValue([]),
    getPaymentConcepts: vi.fn().mockResolvedValue([]),
    getPaymentDivisions: vi.fn().mockResolvedValue([]),
    updatePriceConcept: vi.fn().mockResolvedValue({ success: true }),
    updatePriceDivision: vi.fn().mockResolvedValue({ success: true }),
  };
});

import Pricing from './Pricing.jsx';

describe('Pricing page', () => {
  it('renders title and loading state then content', async () => {
    await act(async () => {
      render(<Pricing />);
    });
    expect(screen.getByText('Precios')).toBeInTheDocument();
  });

  it('renders the course type card', async () => {
    await act(async () => {
      render(<Pricing />);
    });
    expect(screen.getByText('Curso / Tipo de Pago')).toBeInTheDocument();
  });
});
