import PaymentsTable from '../../components/payments/PaymentsTable.jsx'; 
import PaymentsForm from '../../components/payments/PaymentsForm.jsx'; 
import PaymentFilters from '../../components/payments/PaymentsFilter.jsx';
import PaymentsDetail from '../../components/payments/PaymentsDetail.jsx';
import Modal from '../../components/generic/modal/Modal.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import {getPaymentConcepts, getPaymentDivisions, getAllPayments, getAllStudents,
        deletePaymentById, addPaymentWithConsecutive,
        getNextConsecutiveByYear, exportReceiptToExcel
 } from "../../constant/DBFunctions.jsx";
import { PlusCircledIcon, InfoCircledIcon, DownloadIcon } from "@radix-ui/react-icons";

import { useState, useEffect, useCallback, useMemo } from 'react';

import './payments.css';
const Payments = () => {
    
    // --- Estados de Datos y UI ---
    const initialFormState = {
        student_id: '',
        amount: '',
        date: null,
        month: '', 
        year: 0,
        method: '',
        concept: '',
        division: '',
        consecutive: 0,
        receipt: '',
    };
    
    const initialFilterState = {
        concept: [],
        division: [],
        method: [],
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

    const paymentMethods = [
        {label: "Efectivo", value: "Efectivo"},
        {label: "Transferencia", value: "Transferencia"}
    ]

    // datos del formulario
    const [formData, setFormData] = useState(initialFormState);

    // pagos para tabla
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');

    // agregar pago
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // generar recibo
    const [receipt, setReceipt] = useState(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    // eliminar pago
    const [confirmingId, setConfirmingId] = useState(null);
    const [acceptDelete, setAcceptDelete] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // datos de los filtros
    const [filterState, setFilterState] = useState(initialFilterState); // Estado de los filtros
    const [initFilters, setInitFilters] = useState(false);
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


    const handleTableUpdate = async (data, func) => {
        const res = await func(data);
        if (!res.success){
            setError(res.error);
            setTimeout(() => { setError(""); setMessage(''); }, 4000);
            return
        }
        setMessage("Pago actualizado exitosamente");
        setTimeout(() => { setMessage(""); setError(''); }, 4000);
        await fetchPayments(); 
    }

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

        setFilterState(prev => ({
            ...prev,
            concept: concepts.map(c => c.name),
            division: divisions.map(d => d.name),
            method: paymentMethods.map(m => m.value),
            startDate: '',
            endDate: '',
        }));

    }, [concepts, divisions, paymentMethods]);

    // --- Lógica de Carga de Datos ---
    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const loadedData = await getAllPayments(); 
            
            // Ordenar por timestamp descendente
            loadedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); 
            //console.log(JSON.stringify(loadedData));
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

    // Inicializar filtros
    useEffect(() => {
        if (initFilters) return;

        let ready =
            concepts.length &&
            divisions.length &&
            paymentMethods.length;

        if (!ready) return;

        setFilterState(prev => ({
            ...prev,
            concept: concepts.map(c => c.name),
            division: divisions.map(d => d.name),
            method: paymentMethods.map(m => m.value),
        }));
        setInitFilters(true);
    }, [concepts, divisions, paymentMethods, initFilters]);

    const normalize = (d) => {
        if (!d) return null;

        const str = typeof d === "string" ? d : d.toISOString();
        const [y, m, day] = str.split("T")[0].split("-");

        return new Date(Number(y), Number(m) - 1, Number(day));
    };

    // --- Logica de Filtrado  ---
    const filteredPayments = useMemo(() => {
        
        if (payments.length === 0) return [];
        
        return payments.filter(payment => {

            const { startDate, endDate } = filterState;

            // 1. Filtrar por Concepto (Tipo de Pago)
            if (filterState.concept.length > 0 && !filterState.concept.includes(payment.concept_type)) {
                return false;
            }

            // 2. Filtrar por División/Curso
                
            if (filterState.division.length > 0 && !filterState.division.includes(payment.division_name)) {
                return false;
            }

            // 3. Filtrar por Método de Pago
            if (filterState.method.length > 0 && !filterState.method.includes(payment.payment_method)) {
                return false;
            }

            // 4. Filtrar por Rango de Fechas
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


    // --- Handlers de Formulario y Eliminación ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError("");
        
        const amountNumber = parseFloat(formData.amount);
        
        if (isNaN(amountNumber) || amountNumber <= 0 || !formData.concept || !formData.division || !formData.method) {
            setError("Por favor, completa todos los campos obligatorios (Monto, Concepto, Curso, Metodo de Pago).");
            return;
        }

        if (!formData.student_id) {
            setError("Por favor, ingrese un estudiante");
            return;
        }

        if (!formData.date) {
            setError("Por favor, ingrese una fecha");
            return;
        }

        if (!formData.division) {
            setError("Por favor, ingrese un curso");
            return;
        }

        setError("");

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
        //console.log(JSON.stringify(err));
        if (!err.success){
            setError(err.error);
            return
        }
        setFormData(initialFormState);

        setIsReceiptOpen(true);
        setReceipt(err.payment);
        /*
        setMessage("Pago creado exitosamente");
        setTimeout(() => { setMessage(""); setError(''); }, 4000);
        */
        await fetchPayments(); 
        setIsModalOpen(false); 
        setIsLoading(false);
    }, [formData, fetchPayments, initialFormState]);

    const deletePayment = async (e, paymentId) => {
        e.stopPropagation();
        if (confirmingId === paymentId) {
            setIsLoading(true);
            e.stopPropagation();
            setIsDeleteOpen(true);
            if (acceptDelete === false) {
                setIsLoading(false);
                return
            }
            try {
                await deletePaymentById(paymentId);
                setMessage('Pago eliminado correctamente.');
                setError(""); 
                await fetchPayments();
            } catch (e) {
                console.error("Error al eliminar el pago:", e);
                setError("Error al eliminar el pago: " + e.message);
            } finally {
                setIsLoading(false);
                setIsDeleteOpen(false);
                setConfirmingId(null);
                setAcceptDelete(false);
                setTimeout(() => { setError(""); setMessage(''); }, 5000); 
            }
            
            setConfirmingId(null);
        
        } else {
            setConfirmingId(paymentId);
            setTimeout(() => {
                if (isDeleteOpen)
                    setConfirmingId(null)
            }, 4000);
        }
    }; 

    const isTotalLoading = isLoading || isConceptsLoading || isDivisionsLoading;

    return (
        <div className="container-payment">
            <div className="header-container">
                {/* Encabezado y botón de registro */}
                <div className="header-text-group">
                    <h2 className="section-title">
                        Gestión de Ingresos
                    </h2>
                </div>
                <div className="header-action">
                    <button

                        onClick={() => {
                            setFormData(initialFormState);
                            setError("");
                            setIsModalOpen(true);
                        }} 
                        disabled={(isTotalLoading || students.length === 0)}
                        className={`btn btn-primary ${students.length === 0 ? " export-card--disabled" : " export-card--enable"}`}
                    >
                        <span> {students.length === 0 ? <InfoCircledIcon/> : <PlusCircledIcon/>}
                        {payments.length === 0 ? "Agregue Estudiante" : "Registrar Nuevo Ingreso"}
                        </span> 
                    </button>
                </div>
            </div>
            {/* Mensaje de confirmación/error */}
            {(message && !isModalOpen && !isDetailModalOpen) && (
                <SuccessMessage
                    message={message}
                />
            )}
            {(error && !isModalOpen && !isDetailModalOpen) && (
                <ErrorMessage
                    message={error}
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
                    setFilterState={setFilterState}
                    handleFilterChange={handleFilterChange}
                    clearFilters={handleClearFilters}
                    concepts={concepts}
                    divisions={divisions}
                    methods={paymentMethods}
                />
            )}

            {/* Renderiza la Tabla (con datos filtrados) */}
            {!isTotalLoading && (
                <PaymentsTable 
                    payments={filteredPayments}
                    concepts={concepts}
                    divisions={divisions}
                    students={students}
                    onRowClick={handleRowClick}
                    onDeletePayment={deletePayment}
                    confirmingId={confirmingId}
                    handleTableUpdate={handleTableUpdate}
                />
            )}
            {/* modal detalles pago */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setFormData(initialFormState);
                    setIsDetailModalOpen(false);
                    }}
                title="Detalles del pago"
            >
                {(message) && (
                    <SuccessMessage
                        message={message}
                    />
                )}
                <PaymentsDetail
                    detail={selectedPayment}
                    divisions={divisions}
                    concepts={concepts}
                    months={months}
                    students={students}
                    onClick={setSelectedPayment}
                    isLoading={isLoading}
                    handleTableUpdate={handleTableUpdate}
                />
            </Modal>
            {/* confirmacion borrado */}
            <Modal 
                isOpen={isDeleteOpen}
                onClose={ ()=>{
                    setConfirmingId(null);
                    setIsDeleteOpen(false);
                }}
                title="Borrar Ingreso"
            >
                <div>
                    <div className="alert-delete">
                        <p>
                        <strong>¿Estás seguro de que quieres eliminar este pago?</strong> Esta accion no se puede deshacer.
                        </p>
                    </div>
                    <button className="btn-delete-confirm"
                            onClick={(e)=>{
                                setAcceptDelete(true);
                                deletePayment(e,confirmingId);
                                }}>
                        Eliminar
                    </button>
                    <button className="btn-ghost-export"
                            onClick={()=>{
                                setConfirmingId(null);
                                setIsDeleteOpen(false);
                                }}>
                        Cancelar
                    </button>
                </div>
            </Modal>
            
            {/* generar factura */}
            <Modal 
                isOpen={isReceiptOpen}
                onClose={ ()=>{  
                    setIsReceiptOpen(false);
                    setMessage("Se genero Ingreso exitosamente");
                    setTimeout(() => { setMessage(""); setError(''); }, 4000);
                }}
                title="Generar Factura"
            >
                <div>
                    <div className="alert-box">
                        ¿Desea generar una factura para este pago?
                        <p>
                        <strong>Nota:</strong> Los datos se procesarán en formato <strong>.xlsx</strong>.
                        </p>
                    </div>
                    <button className="btn-primary-export"
                            onClick={()=>{
                                exportReceiptToExcel(receipt);
                                setIsReceiptOpen(false);
                                setMessage("Se genero Ingreso y factura exitosamente");
                                setTimeout(() => { setMessage(""); setError(''); }, 4000);
                                }}>
                        <DownloadIcon size={18} />
                        Generar Factura
                    </button>
                    <button className="btn-ghost-export"
                            onClick={()=>{
                                setIsReceiptOpen(false);
                                setMessage("Se genero Ingreso exitosamente");
                                setTimeout(() => { setMessage(""); setError(''); }, 4000);
                                }}>
                        Cancelar
                    </button>
                </div>
            </Modal>

            {/* modal formulario */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setError("");
                }}
                title="Registrar Nuevo Ingreso"
            >
                {/* Mensaje de Error */}
                {error && (
                    <ErrorMessage
                        message={error}
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