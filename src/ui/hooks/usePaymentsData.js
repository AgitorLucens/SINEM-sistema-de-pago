import { useState, useEffect, useCallback } from 'react';
import {
    getPaymentConcepts, getPaymentDivisions, getAllPayments, getAllStudents
} from "../constant/DBFunctions.jsx";

const allMonths = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
];

export function usePaymentsData(setError) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [concepts, setConcepts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [isConceptsLoading, setIsConceptsLoading] = useState(false);
    const [isDivisionsLoading, setIsDivisionsLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [months] = useState(allMonths);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const loadedData = await getAllPayments();
            loadedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setPayments(loadedData);
        } catch (e) {
            console.error("Error al cargar pagos:", e);
            setError("Error al cargar datos desde la base de datos local: " + e.message);
        } finally {
            setIsLoading(false);
        }
    }, [setError]);

    useEffect(() => {
        const loadMetadata = async () => {
            setIsConceptsLoading(true);
            setIsDivisionsLoading(true);
            try {
                const [fetchedConcepts, fetchedDivisions, fetchedStudents] = await Promise.all([
                    getPaymentConcepts(),
                    getPaymentDivisions(),
                    getAllStudents()
                ]);

                setConcepts(Array.isArray(fetchedConcepts) ? fetchedConcepts : []);
                setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
            } catch (err) {
                console.error("Error al cargar metadata:", err);
                setError("No se pudieron cargar los conceptos/cursos de pago.");
            } finally {
                setIsConceptsLoading(false);
                setIsDivisionsLoading(false);
            }
        };

        loadMetadata();
        fetchPayments();
    }, [fetchPayments, setError]);

    const isTotalLoading = isLoading || isConceptsLoading || isDivisionsLoading;

    return {
        payments, setPayments, fetchPayments, isLoading,
        concepts, divisions, students, months, isTotalLoading,
    };
}
