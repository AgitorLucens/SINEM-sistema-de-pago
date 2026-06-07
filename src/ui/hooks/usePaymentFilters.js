import { useState, useEffect, useMemo, useCallback } from 'react';

const paymentMethods = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
];

const initialFilterState = {
    concept: [],
    division: [],
    method: [],
    startDate: '',
    endDate: '',
};

export function usePaymentFilters(payments, concepts, divisions) {
    const [filterState, setFilterState] = useState(initialFilterState);
    const [initFilters, setInitFilters] = useState(false);

    useEffect(() => {
        if (initFilters) return;
        if (!concepts.length || !divisions.length) return;

        setFilterState(prev => ({
            ...prev,
            concept: concepts.map(c => c.name),
            division: divisions.map(d => d.name),
            method: paymentMethods.map(m => m.value),
        }));
        setInitFilters(true);
    }, [concepts, divisions, initFilters]);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterState(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilterState(prev => ({
            ...prev,
            concept: concepts.map(c => c.name),
            division: divisions.map(d => d.name),
            method: paymentMethods.map(m => m.value),
            startDate: '',
            endDate: '',
        }));
    }, [concepts, divisions]);

    const normalize = (d) => {
        if (!d) return null;
        const str = typeof d === "string" ? d : d.toISOString();
        const [y, m, day] = str.split("T")[0].split("-");
        return new Date(Number(y), Number(m) - 1, Number(day));
    };

    const filteredPayments = useMemo(() => {
        if (payments.length === 0) return [];

        return payments.filter(payment => {
            const { startDate, endDate } = filterState;

            if (filterState.concept.length > 0 && !filterState.concept.includes(payment.concept_type)) {
                return false;
            }

            if (filterState.division.length > 0 &&
                payment.division_name &&
                !filterState.division.includes(payment.division_name)) {
                return false;
            }

            if (filterState.method.length > 0 && !filterState.method.includes(payment.payment_method)) {
                return false;
            }

            const paymentDate = normalize(payment.date);

            if (startDate) {
                const start = normalize(startDate);
                if (paymentDate < start) return false;
            }

            if (endDate) {
                const end = normalize(endDate);
                if (paymentDate > end) return false;
            }

            return true;
        });
    }, [payments, filterState]);

    return {
        filterState, setFilterState,
        handleFilterChange, handleClearFilters,
        filteredPayments,
    };
}
