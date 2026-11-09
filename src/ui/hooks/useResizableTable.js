import { useState, useRef, useEffect, useCallback } from 'react';

const readStoredWidth = (storageKey, minWidth) => {
    try {
        const saved = localStorage.getItem(storageKey);
        const parsed = saved ? Number(saved) : NaN;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : minWidth;
    } catch {
        return minWidth;
    }
};

const useResizableTable = (storageKey, minWidth = 600) => {
    const [tableWidth, setTableWidth] = useState(() => readStoredWidth(storageKey, minWidth));

    const dragState = useRef(null);
    const tableWidthRef = useRef(tableWidth);
    tableWidthRef.current = tableWidth;

    const persistWidth = useCallback((width) => {
        try {
            localStorage.setItem(storageKey, String(width));
        } catch {
            // Best effort: storage can be unavailable (private mode, quota); width just won't persist.
        }
    }, [storageKey]);

    const handleMouseMove = useCallback((e) => {
        if (!dragState.current) return;

        const deltaX = e.clientX - dragState.current.startX;
        let newWidth = dragState.current.startWidth + deltaX;

        if (newWidth < minWidth) {
            newWidth = minWidth;
        }

        const maxAllowedWidth = window.innerWidth * 0.95;
        if (newWidth > maxAllowedWidth) {
            newWidth = maxAllowedWidth;
        }

        dragState.current.latestWidth = newWidth;
        setTableWidth(newWidth);
    }, [minWidth]);

    const handleMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (dragState.current && dragState.current.latestWidth != null) {
            persistWidth(dragState.current.latestWidth);
        }
        dragState.current = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, [handleMouseMove, persistWidth]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();

        dragState.current = {
            startX: e.clientX,
            startWidth: tableWidthRef.current,
            latestWidth: null,
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    }, [handleMouseMove, handleMouseUp]);

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            if (dragState.current && dragState.current.latestWidth != null) {
                persistWidth(dragState.current.latestWidth);
            }
            dragState.current = null;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [handleMouseMove, handleMouseUp, persistWidth]);

    return { tableWidth, handleMouseDown };
};

export default useResizableTable;
