// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../constant/DBFunctions.jsx', () => ({
  addImage: vi.fn().mockResolvedValue({ success: true }),
  getImages: vi.fn().mockResolvedValue([]),
  setImage: vi.fn().mockResolvedValue({ success: true }),
  getCurrentImage: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../components/settings/ImageSelector', () => ({
  default: ({ images, onAdd, onSelect, onDelete }) =>
    <div data-testid="image-selector" />,
}));
vi.mock('../../components/generic/message/ErrorMessage', () => ({
  default: ({ message }) =>
    message ? <div data-testid="error-message">{message}</div> : null,
}));

vi.mock('../../assets/SINEM.png', () => ({ default: 'sinem-logo.png' }));

beforeEach(() => {
  window.api = {
    addImage: vi.fn().mockResolvedValue({ success: true }),
    getImages: vi.fn().mockResolvedValue([]),
    setImage: vi.fn().mockResolvedValue({ success: true }),
    getCurrentImage: vi.fn().mockResolvedValue({}),
    deleteImageById: vi.fn().mockResolvedValue({ success: true }),
  };
});

import Settings from './Settings.jsx';

describe('Settings page', () => {
  it('renders title and subtitle', async () => {
    await act(async () => {
      render(<Settings />);
    });
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText(/Personaliza la apariencia/i)).toBeInTheDocument();
  });

  it('renders image library section and selector', async () => {
    await act(async () => {
      render(<Settings />);
    });
    expect(screen.getByText('Biblioteca de Imágenes')).toBeInTheDocument();
    expect(screen.getByTestId('image-selector')).toBeInTheDocument();
  });
});
