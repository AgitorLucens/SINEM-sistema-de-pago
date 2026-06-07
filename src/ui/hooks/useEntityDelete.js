import { useState, useCallback } from 'react';

const CONFIRMATION_TIMEOUT_MS = 4000;

export function useEntityDelete({ onDelete, onRefresh }) {
    const [confirmingId, setConfirmingId] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const requestDelete = useCallback((id) => {
        setConfirmingId(id);
        setTimeout(() => {
            setConfirmingId(prev => prev === id ? null : prev);
        }, CONFIRMATION_TIMEOUT_MS);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (confirmingId == null) return;
        try {
            await onDelete(confirmingId);
            if (onRefresh) await onRefresh();
        } finally {
            setConfirmingId(null);
            setIsDeleteOpen(false);
        }
    }, [confirmingId, onDelete, onRefresh]);

    const cancelDelete = useCallback(() => {
        setConfirmingId(null);
        setIsDeleteOpen(false);
    }, []);

    const openDeleteModal = useCallback((id) => {
        setConfirmingId(id);
        setIsDeleteOpen(true);
    }, []);

    return {
        confirmingId,
        isDeleteOpen,
        setIsDeleteOpen,
        requestDelete,
        confirmDelete,
        cancelDelete,
        openDeleteModal,
    };
}
