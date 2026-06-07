import { useState, useCallback, useRef } from 'react';

const AUTO_DISMISS_MS = 5000;

export function useStatusMessages() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const messageTimer = useRef(null);
    const errorTimer = useRef(null);

    const clearTimers = useCallback(() => {
        if (messageTimer.current) clearTimeout(messageTimer.current);
        if (errorTimer.current) clearTimeout(errorTimer.current);
    }, []);

    const showMessage = useCallback((msg) => {
        setMessage(msg);
        clearTimers();
        messageTimer.current = setTimeout(() => setMessage(''), AUTO_DISMISS_MS);
    }, [clearTimers]);

    const showError = useCallback((err) => {
        setError(err);
        clearTimers();
        errorTimer.current = setTimeout(() => setError(''), AUTO_DISMISS_MS);
    }, [clearTimers]);

    const clearAll = useCallback(() => {
        clearTimers();
        setMessage('');
        setError('');
    }, [clearTimers]);

    return { message, error, setMessage, setError, showMessage, showError, clearAll };
}
