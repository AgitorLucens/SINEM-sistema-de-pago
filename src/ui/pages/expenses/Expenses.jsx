import ExpensesTable from '../../components/expenses/ExpensesTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import ConfirmDeleteModal from '../../components/generic/modal/ConfirmDeleteModal.jsx';
import ExpensesForm from '../../components/expenses/ExpensesForm.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import { getAllExpenses, addExpense, deleteExpenseById } from '../../constant/DBFunctions.jsx';
import { useStatusMessages } from '../../hooks/useStatusMessages.js';
import { useEntityDelete } from '../../hooks/useEntityDelete.js';
import { useForm } from '../../hooks/useForm.js';

import { useState, useEffect, useCallback } from 'react';
import { PlusCircledIcon } from "@radix-ui/react-icons";

import './expenses.css';

const Expenses = () => {
    const { formData, setFormData, handleChange, resetForm } = useForm({
        amount: '',
        date: null,
        description: '',
        reference: '',
        type: '',
    });
    const { message, setMessage, error, setError } = useStatusMessages();

    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchExpenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedExpenses = await getAllExpenses();
            setExpenses(Array.isArray(fetchedExpenses) ? fetchedExpenses : []);
        } catch (e) {
            console.error("Error al recargar egresos:", e);
            setError("Error al recargar el historial de egresos.");
        } finally {
            setIsLoading(false);
        }
    }, [setError]);

    const deleteCtrl = useEntityDelete({
        onDelete: deleteExpenseById,
        onRefresh: fetchExpenses,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError("Por favor, introduce un monto válido y positivo.");
            return;
        }
        if (!formData.description || !formData.date || !formData.reference) {
            setError("Por favor, ingresa los campos obligatorios. (Detalle, Fecha o Refencia)");
            return;
        }

        const expensesDataToSend = {
            date: new Date(formData.date).toISOString(),
            description: formData.description,
            reference: formData.reference,
            amount: amountNumber,
            type: formData.type,
        };

        setIsLoading(true);
        try {
            await addExpense(expensesDataToSend);
            resetForm();
            setError("");
            await fetchExpenses();
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            setIsLoading(false);
        }
        setIsModalOpen(false);
        setMessage("Gasto registrado exitosamente");
    }, [formData, fetchExpenses, resetForm, setMessage, setError]);

    const handleTableUpdate = useCallback(async (data, func) => {
        const res = await func(data);
        if (!res.success){
            setError(res.error);
            return
        }
        setMessage("Pago actualizado exitosamente");
        await fetchExpenses();
    }, [fetchExpenses, setMessage, setError]);

    const handleDeleteRequest = useCallback((e, expenseId) => {
        e.stopPropagation();
        deleteCtrl.openDeleteModal(expenseId);
    }, [deleteCtrl]);

    const handleConfirmDelete = useCallback(async () => {
        try {
            await deleteCtrl.confirmDelete();
            setMessage('Gasto eliminado correctamente.');
        } catch (e) {
            console.error("Error al eliminar el pago:", e);
            setError("Error al eliminar el pago: " + e.message);
        }
    }, [deleteCtrl, setMessage, setError]);

    return (
        <div className='container-report'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" >Historial de Egresos</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    <span> <PlusCircledIcon/> Registrar Nuevo Egreso</span>
                </button>
            </div>

            {message && (
                <SuccessMessage message={message} />
            )}

            <ExpensesTable expenses={expenses}
                           confirmingId={deleteCtrl.confirmingId}
                           handleTableUpdate={handleTableUpdate}
                           onDeleteExpense={handleDeleteRequest}/>

            <ConfirmDeleteModal
                isOpen={deleteCtrl.isDeleteOpen}
                onClose={deleteCtrl.cancelDelete}
                onConfirm={handleConfirmDelete}
                title="Borrar Egreso"
                itemName="egreso"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    resetForm();
                    setIsModalOpen(false);
                    setError("");
                }}
                title="Registrar Nuevo Egreso"
            >
                {error && (
                    <ErrorMessage message={error} />
                )}

                <ExpensesForm
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Modal>
        </div>
    );
};

export default Expenses;
