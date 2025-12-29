import PaymentsTable from '../../components/payments/PaymentsTable.jsx'; 
import PaymentsForm from '../../components/payments/PaymentsForm.jsx'; 
import PaymentFilters from '../../components/payments/PaymentsFilter.jsx';
import PaymentsDetail from '../../components/payments/PaymentsDetail.jsx';
import Modal from '../../components/generic/modal/Modal.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import {getPaymentConcepts, getPaymentDivisions, getAllPayments, getAllStudents,
        deletePaymentById, addPaymentWithConsecutive,
        getNextConsecutiveByYear
 } from "../../constant/DBFunctions.jsx";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { useState, useEffect, useCallback, useMemo } from 'react';
import './payments.css';

const Payments = () => {
    
    // --- Estados de Datos y UI ---
    const initialFormState = {
        student_id: '',
        amount: '',
        date: null,
        month: 0, 
        year: 0,
        method: '',
        concept: '',
        division: '',
        consecutive: 0,
        receipt: '',
    };
    
    const initialFilterState = {
        concept: '',
        division: '',
        method: '',
        startDate: '',
        endDate: '',
    };
    
    const allMonths = [
        { label: "Enero", value: 1},
        { label: "Febrero", value: 2},
        { label: "Marzo", value: 3},
        { label: "Abril", value: 4},
        { label: "Mayo", value: 5},
        { label: "Junio", value: 6},
        { label: "Julio", value: 7},
        { label: "Agosto", value: 8},
        { label: "Septiembre", value: 9},
        { label: "Octubre", value: 10},
        { label: "Noviembre", value: 11},
        { label: "Diciembre", value: 12},
    ]

    // datos del formulario
    const [formData, setFormData] = useState(initialFormState);
    
    // pagos para tabla
    const [payments, setPayments] = useState([]);
    const [filterState, setFilterState] = useState(initialFilterState); // Estado de los filtros
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState('');
    const [message, setMessage] = useState('');

    // agregar pago
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // eliminar pago
    const [confirmingId, setConfirmingId] = useState(null);

    // datos de los filtros
    const [concepts, setConcepts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [isConceptsLoading, setIsConceptsLoading] = useState(false);
    const [isDivisionsLoading, setIsDivisionsLoading] = useState(false); // Estado corregido
    const [months, setMonths] = useState(allMonths);

    // estudiantes
    const [students, setStudents] = useState([]);


    // ver detalles pago
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleRowClick = (payment) => {
        setSelectedPayment(payment);
        setIsDetailModalOpen(true);
    };

   // const handle

    // --- Cuando usuario escoge Tipo de Pago
    const handleConceptChange = (conceptId) => {
        
       const selectedConcept = concepts.find(
            c => c.id === Number(conceptId)
        );

        setFormData(prev => ({
            ...prev,
            concept: conceptId,
            amount: selectedConcept?.amount ?? ""
        }));
    };

    const handleAmountChange = (e) => {
        handleChange(e);
    };

    const handleDateChange = async (date) => {
        handleChange({
            target: { name: "date", value: date }
        });

        const yearDate = new Date(date).getFullYear();

        const nextConsecutive = await getNextConsecutiveByYear(yearDate);

        setFormData(prev => ({
            ...prev,
            year: yearDate,
            consecutive: nextConsecutive
        }));
    };

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
        setError(false);
        try {
            const loadedData = await getAllPayments(); 
            
            // Ordenar por timestamp descendente
            loadedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); 
            //console.log(JSON.stringify(loadedData));
            setPayments(loadedData);
        } catch (e) {
            console.error("Error al cargar pagos:", e);
            setError(true);
            setErrorInfo("Error al cargar datos desde la base de datos local: " + e.message);
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
                const [fetchedConcepts, fetchedDivisions, fetchedStudents] = await Promise.all([
                    getPaymentConcepts(),
                    getPaymentDivisions(),
                    getAllStudents()
                ]);

                setConcepts(Array.isArray(fetchedConcepts) ? fetchedConcepts : []);
                setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
                //console.log(JSON.stringify(fetchedStudents));
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
            setError(true);
            setErrorInfo("Por favor, completa todos los campos obligatorios (Monto, Concepto, División).");
            return;
        }

        setError(false); setErrorInfo("");

        if (!formData.date) {
            setError(true);
            setErrorInfo("Por favor, ingrese una fecha");
            //setTimeout(() => { setError("Por favor, introduzca una fecha"); setMessage(''); }, 4000);
            return;
        }

        setError(false); setErrorInfo("");

        const paymentDataToSend = {
            date: new Date(formData.date).toISOString(),
            amount: amountNumber,
            receipt: formData.receipt,
            payment_method: formData.method,
            concept_id: parseInt(formData.concept, 10),
            division_id: parseInt(formData.division, 10),
            student_id: parseInt(formData.student_id,10),
            year: formData.year,
            month: formData.month,
            sequence: formData.consecutive,
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
        };

        setIsLoading(true);
        //console.log(JSON.stringify(formData));
        const err = await addPaymentWithConsecutive(paymentDataToSend);
        if (!err.success){
            setError(true);
            setErrorInfo(err.error);
            return
        }
        setFormData(initialFormState);
        setMessage("Pago creado exitosamente");
        setTimeout(() => { setMessage(""); setErrorInfo(''); }, 4000);
        await fetchPayments(); 
        setIsModalOpen(false); 
        setIsLoading(false);
    }, [formData, fetchPayments, initialFormState]);

    const deletePayment = async (e, paymentId) => {
        // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
        e.stopPropagation();
        if (confirmingId === paymentId) {
            setIsLoading(true);
            e.stopPropagation();
            if (!window.confirm("¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer.")) {
                setIsLoading(false);
                setConfirmingId(null);
                return;
            }
            try {
                await deletePaymentById(paymentId);
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
            
            setConfirmingId(null);
        
        } else {
            setConfirmingId(paymentId);
            setTimeout(() => setConfirmingId(null), 4000);
        }
    }; 

    const isTotalLoading = isLoading || isConceptsLoading || isDivisionsLoading;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="header-container">
                {/* Encabezado y botón de registro */}
                <div className="header-text-group">
                    <h2 className="section-title">
                        Gestión de Pagos
                    </h2>
                </div>
                <div className="header-action">
                    <button
                        onClick={() => {
                            setFormData(initialFormState);
                            setError(null);
                            setIsModalOpen(true);
                        }} 
                        disabled={isTotalLoading}
                        className="btn btn-primary"
                    >
                        <span ><PlusCircledIcon/>
                        Registrar Nuevo Pago
                        </span> 
                    </button>
                </div>
            </div>
            {/* Mensaje de confirmación/error */}
            {(message) && (
                <SuccessMessage
                    message={message}
                />
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
                    onRowClick={handleRowClick}
                    onDeletePayment={deletePayment}
                    confirmingId={confirmingId}
                />
            )}
            {/* modal detalles pago */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setFormData(initialFormState);
                    setIsDetailModalOpen(false)}}
                title="Detalles del pago"
            >
                <PaymentsDetail
                    detail={selectedPayment}
                    isLoading={isLoading}
                />
            </Modal>
            {/* modal formulario */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Pago (Ingresos)"
            >
                {/* Mensaje de Error */}
                {error && (
                    <ErrorMessage
                        message={errorInfo}
                    />
                )}
                <PaymentsForm 
                    formData={formData}
                    handleChange={handleChange}
                    handleConcept={handleConceptChange}
                    handleAmount={handleAmountChange}
                    handleDate={handleDateChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    concepts={concepts}
                    divisions={divisions}
                    students={students}
                    months={months}
                    formError={error}
                />
            </Modal>
        </div>
    );
};

export default Payments;