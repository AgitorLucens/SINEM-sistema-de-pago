import PaymentsTable from '../../components/payments/PaymentsTable.jsx'; 
import PaymentsForm from '../../components/payments/PaymentsForm.jsx'; 
import PaymentsModal from '../../components/payments/PaymentsModal.jsx';
import PaymentFilters from '../../components/payments/PaymentsFilter.jsx';

import {getPaymentConcepts, getPaymentDivisions, getAllPayments } from "../../constant/PaymentConstant.jsx"

import { useState, useEffect, useCallback, useMemo } from 'react';

const Payments = () => {
    
    // --- Estados de Datos y UI ---
    const initialFormState = {
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        method: 'TRANSFERENCIA',
        concept: '',
        division: '',
    };
    
    const initialFilterState = {
        concept: '',
        division: '',
        method: '',
        startDate: '',
        endDate: '',
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [payments, setPayments] = useState([]); // Pagos sin filtrar
    const [filterState, setFilterState] = useState(initialFilterState); // Estado de los filtros
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const [concepts, setConcepts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [isConceptsLoading, setIsConceptsLoading] = useState(false);
    const [isDivisionsLoading, setIsDivisionsLoading] = useState(false); // Estado corregido

    // --- Handlers de Filtros ---
    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterState(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilterState(initialFilterState);
    }, [initialFilterState]);

    // --- Lógica de Carga de Datos ---
    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const loadedData = await getAllPayments(); 
            
            // Ordenar por timestamp descendente
            loadedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); 

            setPayments(loadedData);
        } catch (e) {
            console.error("Error al cargar pagos:", e);
            setError("Error al cargar datos desde la base de datos local: " + e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar Pagos, Conceptos y Divisiones al montar
    useEffect(() => {
        const loadMetadata = async () => {
            setIsConceptsLoading(true);
            setIsDivisionsLoading(true); // CORREGIDO: De setIsDivsionsLoading a setIsDivisionsLoading
            try {
                const [fetchedConcepts, fetchedDivisions] = await Promise.all([
                    getPaymentConcepts(),
                    getPaymentDivisions()
                ]);

                setConcepts(Array.isArray(fetchedConcepts) ? fetchedConcepts : []);
                setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                console.log(fetchedConcepts);
                //console.log("\n"+fetchedDivisions);
            } catch (err) {
                console.error("Error al cargar metadata:", err);
                setError("No se pudieron cargar los conceptos/cursos de pago.");
            } finally {
                setIsConceptsLoading(false);
                setIsDivisionsLoading(false); // CORREGIDO: De setIsDivsionsLoading a setIsDivisionsLoading
            }
        };

        loadMetadata();
        fetchPayments();
    }, [fetchPayments]);

    // --- Lógica de Filtrado (Clasificación) ---
    const filteredPayments = useMemo(() => {
        
        if (payments.length === 0) return [];
        
        return payments.filter(payment => {
            //console.log("filtro"+JSON.stringify(filterState)+"\n");
            //console.log(JSON.stringify(payments));

            const { concept, division, method, startDate, endDate } = filterState;

            // 1. Filtrar por Concepto (Tipo de Pago)
            if (concept && concept !== payment.concept_type ) {
                return false;
            }

            // 2. Filtrar por División/Curso
            if (division && division !== payment.division_name ) {
                return false;
            }

            // 3. Filtrar por Método de Pago
            if (method && method !== payment.payment_method ) {
                return false;
            }

            // 4. Filtrar por Rango de Fechas
            if (startDate) {
                if (payment.date < startDate) return false;
            }
            if (endDate) {
                if (payment.date > endDate) return false;
            }

            return true;
        });
    }, [payments, filterState]);


    // --- Handlers de Formulario y Eliminación ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError(null);
        
        const amountNumber = parseFloat(formData.amount);
        
        if (isNaN(amountNumber) || amountNumber <= 0 || !formData.concept || !formData.division) {
            setError("Por favor, completa todos los campos obligatorios (Monto, Concepto, División).");
            return;
        }

        const paymentDataToSend = {
            date: formData.date,
            amount: amountNumber,
            payment_method: formData.method,
            concept_id: parseInt(formData.concept, 10),
            division_id: parseInt(formData.division, 10),
            student_id: null, 
            invoice_id: null,
            created_by: 1, 
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
        };

        setIsLoading(true);
        try {
            await window.api.addPayment(paymentDataToSend);
            setFormData(initialFormState);
            setMessage('Pago registrado con éxito.');
            await fetchPayments(); 
            setIsModalOpen(false); 
        } catch (e) {
            console.error("Error al guardar el pago:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido.'));
        } finally {
            setIsLoading(false);
            setTimeout(() => { setError(null); setMessage(''); }, 5000);
        }
    }, [formData, fetchPayments, initialFormState]);

    const deletePayment = useCallback(async (paymentId) => {
        // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
        if (!window.confirm("¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer.")) {
            return;
        }
        setIsLoading(true);
        try {
            await window.api.deletePayment(paymentId);
            setMessage('Pago eliminado correctamente.');
            setError(null);
            await fetchPayments();
        } catch (e) {
            console.error("Error al eliminar el pago:", e);
            setError("Error al eliminar el pago: " + e.message);
        } finally {
            setIsLoading(false);
            setTimeout(() => { setError(null); setMessage(''); }, 5000); 
        }
    }, [fetchPayments]); 

    const isTotalLoading = isLoading || isConceptsLoading || isDivisionsLoading;


    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            
            {/* Encabezado y botón de registro */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="title">
                    Gestión de Pagos (Ingresos)
                </h2>
                <button
                    onClick={() => {
                        setFormData(initialFormState);
                        setError(null);
                        setIsModalOpen(true);
                    }} 
                    disabled={isTotalLoading}
                    className="btn btn-primary"
                >
                    <span >➕ </span> Registrar Nuevo Pago
                </button>
            </div>

            {/* Mensaje de confirmación/error */}
            {(message || error) && (
                <div 
                    className={`p-4 mb-6 rounded-lg font-medium ${error ? 'bg-red-100 text-red-700 border-red-400' : 'bg-green-100 text-green-700 border-green-400'} border`}
                >
                    {error || message}
                </div>
            )}
            
            {/* Indicador de Carga */}
            {isTotalLoading && (
                <div className="p-4 text-center text-indigo-600 font-semibold">
                    Cargando datos... Por favor, espera.
                </div>
            )}

            {/* Panel de Filtros (Clasificación) */}
            {!isTotalLoading && (
                <PaymentFilters 
                    filterState={filterState}
                    handleFilterChange={handleFilterChange}
                    clearFilters={handleClearFilters}
                    concepts={concepts}
                    divisions={divisions}
                />
            )}

            {/* Renderiza la Tabla (con datos filtrados) */}
            {!isTotalLoading && (
                <PaymentsTable 
                    payments={filteredPayments} 
                    onDeletePayment={deletePayment}
                    concepts={concepts} 
                    divisions={divisions} 
                />
            )}

            {/* Renderiza el Modal que contiene el formulario */}
            <PaymentsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Pago (Ingresos)"
            >
                <PaymentsForm 
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    concepts={concepts}
                    divisions={divisions}
                    formError={error}
                />
            </PaymentsModal>
        </div>
    );
};

export default Payments;