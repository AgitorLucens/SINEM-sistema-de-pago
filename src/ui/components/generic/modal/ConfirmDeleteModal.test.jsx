// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

describe('ConfirmDeleteModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmDeleteModal isOpen={false} onClose={() => {}} onConfirm={() => {}} title="Delete" itemName="registro" />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the confirm message with item name', () => {
    render(
      <ConfirmDeleteModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="Eliminar" itemName="estudiante" />
    );
    expect(screen.getByText(/estudiante/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro/i)).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <ConfirmDeleteModal isOpen={true} onClose={() => {}} onConfirm={() => {}} title="Eliminar Estudiante" itemName="estudiante" />
    );
    expect(screen.getByText('Eliminar Estudiante')).toBeInTheDocument();
  });

  it('calls onConfirm when Eliminar button is clicked', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen={true} onClose={onClose} onConfirm={onConfirm} title="Eliminar" itemName="registro" />
    );
    const buttons = screen.getAllByText('Eliminar');
    const confirmButton = buttons.find((btn) => btn.tagName === 'BUTTON');
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancelar button is clicked', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen={true} onClose={onClose} onConfirm={onConfirm} title="Eliminar" itemName="registro" />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen={true} onClose={onClose} onConfirm={() => {}} title="Eliminar" itemName="registro" />
    );
    const cerrarButton = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(cerrarButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal isOpen={true} onClose={onClose} onConfirm={() => {}} title="Eliminar" itemName="registro" />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
