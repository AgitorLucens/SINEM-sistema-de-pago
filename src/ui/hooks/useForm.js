import { useState, useCallback } from 'react';

export function useForm(initialState) {
    const [formData, setFormData] = useState(initialState);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialState);
    }, [initialState]);

    const setField = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const setFields = useCallback((fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
    }, []);

    return { formData, setFormData, handleChange, resetForm, setField, setFields };
}
