import ExpensesTable from '../../components/expenses/ExpensesTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import ExpensesForm from '../../components/expenses/ExpensesForm.jsx';
import ErrorMessaage from '../../components/generic/message/ErrorMessage.jsx';
import SuccessMessaage from '../../components/generic/message/SuccessMessage.jsx';
import { getAllExpenses, addExpense, deleteExpenseById } from '../../constant/DBFunctions.jsx';

import { useState, useEffect, useCallback } from 'react';
import { PlusCircledIcon } from "@radix-ui/react-icons";
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';

import './expenses.css';
const Expenses = () => {
    // 1. Estado para la lista de pagos
    const initialFormState = {
        amount: '',
        date: null,
        description: '',
        reference: '',
        type: '',
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // eliminar pago
    const [confirmingId, setConfirmingId] = useState(null);
    const [acceptDelete, setAcceptDelete] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    //se usa este callback por cuestiones de rendimiento
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
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Controla la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // La lógica de manejo de entrada se mantiene aquí
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    // Lógica para registrar y añadir un nuevo pago
    const handleSubmit = async (e) => {
        e.preventDefault();
        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError("Por favor, introduce un monto válido y positivo.");
            setTimeout(() => { setError(""); setMessage(''); }, 4000); 
            return;
        }
        if (!formData.description || !formData.date || !formData.reference) {
            setError("Por favor, ingresa los campos obligatorios. (Detalle, Fecha o Refencia)");
            setTimeout(() => { setError(""); setMessage(''); }, 4000);
            return;
        }

        if (!formData.date) {
            setError("Por favor, selecciona una fecha válida.");
            setTimeout(() => { setError(""); setMessage(''); }, 4000); 
            return;
        }

        if (!formData.description){
            setError("Por favor, ingresa una detalle para el gasto.");
            setTimeout(() => { setError(""); setMessage(''); }, 4000);
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
  
            setFormData(initialFormState);
            setError("");
            await fetchExpenses(); 
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            setIsLoading(false);
        }
        setIsModalOpen(false); // Cierra el modal al guardar
        setMessage("Gasto registrado exitosamente");
        setTimeout(() => setMessage(''), 5000);

    };

    const handleTableUpdate = async (data, func) => {
        const res = await func(data);
        if (!res.success){
            setError(res.error);
            setTimeout(() => { setError(""); setMessage(''); }, 4000);
            return
        }
        setMessage("Pago actualizado exitosamente");
        setTimeout(() => { setMessage(""); setError(''); }, 4000);
        await fetchExpenses(); 
    }

    const deleteExpense = async (e, expenseId) => {
            // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
            e.stopPropagation();
            if (confirmingId === expenseId) {
                setIsLoading(true);
                e.stopPropagation();
                setIsDeleteOpen(true);
                if (acceptDelete === false) {
                    setIsLoading(false);
                    return
                }
                try {
                    await deleteExpenseById(expenseId);
                    setMessage('Gasto eliminado correctamente.');
                    setError(null);
                    await fetchExpenses();
                } catch (e) {
                    console.error("Error al eliminar el pago:", e);
                    setError("Error al eliminar el pago: " + e.message);
                } finally {
                    setIsLoading(false);
                    setIsDeleteOpen(false);
                    setConfirmingId(null);
                    setAcceptDelete(false);
                    setTimeout(() => { setError(null); setMessage(''); }, 5000); 
                }
                
                setConfirmingId(null);
            
            } else {
                setConfirmingId(expenseId);
                setTimeout(() => {
                    if (isDeleteOpen)
                        setConfirmingId(null);
                }, 4000);
            }
        }; 

    return (
        <div className='container-report'>
            {/* Encabezado y botón de registro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" >Historial de Egresos</h2>
                <button
                    onClick={() => setIsModalOpen(true)} // Abre el modal
                    style={{
                        backgroundColor: '#4f46e5', 
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                    <PlusCircledIcon/> Registrar Nuevo Egreso
                </button>
            </div>

            {/* mensaje exito */}
            {message && (
                <SuccessMessaage
                    message={message}
                />
            )}

            {/* tabla */}
            <ExpensesTable expenses={expenses} 
                           confirmingId={confirmingId}
                           handleTableUpdate={handleTableUpdate}
                           onDeleteExpense={deleteExpense}/>


            {/* modal delete gasto */}
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
                        <strong>¿Estás seguro de que quieres eliminar este Egreso?</strong> Esta accion no se puede deshacer.
                        </p>
                    </div>
                    <button className="btn-delete-confirm"
                            onClick={(e)=>{
                                setAcceptDelete(true);
                                deleteExpense(e,confirmingId);
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

            {/* modal gasto */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setFormData(initialFormState);
                    setIsModalOpen(false);
                    setError("");
                }} // Permite cerrar el modal con la X
                title="Registrar Nuevo Egreso"
            >
                {error &&(
                    <ErrorMessage
                        message={error}
                    />
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