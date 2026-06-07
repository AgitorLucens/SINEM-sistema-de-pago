import PaymentsTable from '../../components/payments/PaymentsTable.jsx';
import PaymentsForm from '../../components/payments/PaymentsForm.jsx';
import PaymentFilters from '../../components/payments/PaymentsFilter.jsx';
import PaymentsDetail from '../../components/payments/PaymentsDetail.jsx';
import Modal from '../../components/generic/modal/Modal.jsx';
import ConfirmDeleteModal from '../../components/generic/modal/ConfirmDeleteModal.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import {
    addPaymentWithConsecutive, deletePaymentById,
    getPaymentAmount, getNextConsecutiveByYear, exportReceiptToExcel,
} from "../../constant/DBFunctions.jsx";
import { usePaymentsData } from '../../hooks/usePaymentsData.js';
import { usePaymentFilters } from '../../hooks/usePaymentFilters.js';
import { useForm } from '../../hooks/useForm.js';
import { useStatusMessages } from '../../hooks/useStatusMessages.js';
import { useEntityDelete } from '../../hooks/useEntityDelete.js';
import { PlusCircledIcon, InfoCircledIcon, DownloadIcon } from "@radix-ui/react-icons";

import { useState, useCallback } from 'react';

import './payments.css';

const initialFormState = {
    student_id: '',
    amount: '',
    date: null,
    month: '',
    semester: "",
    year: 0,
    method: '',
    concept: '',
    division: '',
    consecutive: 0,
    receipt: '',
};

const paymentMethods = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
];

const Payments = () => {
    const { message, setMessage, error, setError } = useStatusMessages();
    const paymentsData = usePaymentsData(setError);
    const { payments, fetchPayments, concepts, divisions, students, months, isTotalLoading } = paymentsData;
    const { filterState, setFilterState, handleFilterChange, handleClearFilters, filteredPayments } =
        usePaymentFilters(payments, concepts, divisions);
    const { formData, setFormData, handleChange, resetForm } = useForm(initialFormState);
    const deleteCtrl = useEntityDelete({
        onDelete: deletePaymentById,
        onRefresh: fetchPayments,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const handleRowClick = useCallback((payment) => {
        setSelectedPayment(payment);
        setIsDetailModalOpen(true);
    }, []);

    const handleStudentChange = useCallback((studentId) => {
        const selected = students.find(s => String(s.id) === String(studentId));
        setFormData(prev => ({
            ...prev,
            student_id: studentId,
            ...(selected && selected.scholarship === 1
                ? { amount: selected.scholarship_amount ?? "" }
                : {})
        }));
    }, [students, setFormData]);

    const handleConceptChange = useCallback(async (conceptId) => {
        setFormData(prev => ({ ...prev, concept: conceptId }));
    }, [setFormData]);

    const handleDivisionChange = useCallback(async (divisionId) => {
        setFormData(prev => ({ ...prev, division: divisionId }));
    }, [setFormData]);

    const fetchAndSetAmount = useCallback(async (divisionId, conceptId) => {
        const selectedStudent = students.find(s => String(s.id) === String(formData.student_id));
        if (selectedStudent && selectedStudent.scholarship === 1) {
            return;
        }
        const amount = await getPaymentAmount(divisionId, conceptId);
        setFormData(prev => ({ ...prev, amount: amount ?? "" }));
    }, [students, formData.student_id, setFormData]);

    const handleAmountChange = useCallback((e) => {
        handleChange(e);
    }, [handleChange]);

    const handleDateChange = useCallback(async (date) => {
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
    }, [handleChange, setFormData]);

    const handleTableUpdate = useCallback(async (data, func) => {
        const res = await func(data);
        if (!res.success) {
            setError(res.error);
            return;
        }
        setMessage("Pago actualizado exitosamente");
        await fetchPayments();
    }, [fetchPayments, setMessage, setError]);

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

        if (formData.concept && formData.concept === "1" && !formData.semester) {
            setError("Por favor, ingrese un semestre para la matricula");
            return;
        }

        if (formData.concept && (formData.concept === "2" || formData.concept === "3") && !formData.month) {
            setError("Por favor, ingrese un mes para la mensualidad");
            return;
        }

        const paymentDataToSend = {
            date: new Date(formData.date).toISOString(),
            amount: amountNumber,
            receipt: formData.receipt,
            payment_method: formData.method,
            concept_id: parseInt(formData.concept, 10),
            division_id: parseInt(formData.division, 10),
            student_id: parseInt(formData.student_id, 10),
            year: formData.year,
            semester: formData.semester || null,
            month: formData.month || null,
            sequence: formData.consecutive,
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
        };

        const err = await addPaymentWithConsecutive(paymentDataToSend);
        if (!err.success) {
            if (err.error.includes("payments.student_id") &&
                err.error.includes("payments.semester")) {
                setError("Ya existe una Matricula para este Semestre y Curso.");
                return;
            }
            setError("Error al Agregar Ingreso.");
            return;
        }

        resetForm();
        setIsReceiptOpen(true);
        setReceipt(err.payment);
        await fetchPayments();
        setIsModalOpen(false);
    }, [formData, fetchPayments, resetForm, setError]);

    const handleDeleteRequest = useCallback((e, paymentId) => {
        e.stopPropagation();
        deleteCtrl.openDeleteModal(paymentId);
    }, [deleteCtrl]);

    const handleConfirmDelete = useCallback(async () => {
        try {
            await deleteCtrl.confirmDelete();
            setMessage('Pago eliminado correctamente.');
        } catch (e) {
            console.error("Error al eliminar el pago:", e);
            setError("Error al eliminar el pago: " + e.message);
        }
    }, [deleteCtrl, setMessage, setError]);

    return (
        <div className="container-payment">
            <div className="header-container">
                <div className="header-text-group">
                    <h2 className="section-title">
                        Gestión de Ingresos
                    </h2>
                </div>
                <div className="header-action">
                    <button
                        onClick={() => {
                            resetForm();
                            setError("");
                            setIsModalOpen(true);
                        }}
                        disabled={(isTotalLoading || students.length === 0)}
                        className={`btn btn-primary ${students.length === 0 ? " export-card--disabled" : " export-card--enable"}`}
                    >
                        <span> {students.length === 0 ? <InfoCircledIcon /> : <PlusCircledIcon />}
                            {students.length === 0 ? "Agregue Estudiante" : "Registrar Nuevo Ingreso"}
                        </span>
                    </button>
                </div>
            </div>

            {(message && !isModalOpen && !isDetailModalOpen) && (
                <SuccessMessage message={message} />
            )}
            {(error && !isModalOpen && !isDetailModalOpen) && (
                <ErrorMessage message={error} />
            )}

            {isTotalLoading && (
                <div className="p-4 text-center text-indigo-600 font-semibold">
                    Cargando datos... Por favor, espera.
                </div>
            )}

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

            {!isTotalLoading && (
                <PaymentsTable
                    payments={filteredPayments}
                    concepts={concepts}
                    divisions={divisions}
                    students={students}
                    onRowClick={handleRowClick}
                    onDeletePayment={handleDeleteRequest}
                    confirmingId={deleteCtrl.confirmingId}
                    handleTableUpdate={handleTableUpdate}
                />
            )}

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    resetForm();
                    setIsDetailModalOpen(false);
                }}
                title="Detalles del pago"
            >
                {(message) && (
                    <SuccessMessage message={message} />
                )}
                <PaymentsDetail
                    detail={selectedPayment}
                    divisions={divisions}
                    concepts={concepts}
                    months={months}
                    students={students}
                    onClick={setSelectedPayment}
                    isLoading={false}
                    handleTableUpdate={handleTableUpdate}
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={deleteCtrl.isDeleteOpen}
                onClose={deleteCtrl.cancelDelete}
                onConfirm={handleConfirmDelete}
                title="Borrar Ingreso"
                itemName="pago"
            />

            <Modal
                isOpen={isReceiptOpen}
                onClose={() => {
                    setIsReceiptOpen(false);
                    setMessage("Se genero Ingreso exitosamente");
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
                        onClick={() => {
                            exportReceiptToExcel(receipt);
                            setIsReceiptOpen(false);
                            setMessage("Se genero Ingreso y factura exitosamente");
                        }}>
                        <DownloadIcon size={18} />
                        Generar Factura
                    </button>
                    <button className="btn-ghost-export"
                        onClick={() => {
                            setIsReceiptOpen(false);
                            setMessage("Se genero Ingreso exitosamente");
                        }}>
                        Cancelar
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError("");
                }}
                title="Registrar Nuevo Ingreso"
            >
                {error && (
                    <ErrorMessage message={error} />
                )}
                <PaymentsForm
                    formData={formData}
                    handleChange={handleChange}
                    handleStudent={handleStudentChange}
                    handleConcept={handleConceptChange}
                    handleDivision={handleDivisionChange}
                    handleAmount={handleAmountChange}
                    handleDate={handleDateChange}
                    onSubmit={handleSubmit}
                    isLoading={false}
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
