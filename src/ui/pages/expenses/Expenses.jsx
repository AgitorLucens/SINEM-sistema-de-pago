import ExpensesTable from '../../components/expenses/ExpensesTable';
import ExpensesModal from '../../components/expenses/ExpensesModal.jsx';
import ExpensesForm from '../../components/expenses/ExpensesForm.jsx';

import { getAllExpenses, addExpense } from '../../constant/PaymentConstant';

import { useState, useEffect, useCallback } from 'react';

const Expenses = () => {
    // 1. Estado para la lista de pagos
    const initialFormState = {
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        description: '',
        reference: '',
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    //se usa este callback por cuestiones de rendimiento
    const fetchExpenses = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log("Cargando egresos...");
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
        console.log(JSON.stringify(formData));
        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError("Por favor, introduce un monto válido y positivo.");
            return;
        }

        const expensesDataToSend = {
            date: formData.date,
            description: formData.description,
            reference: formData.reference,
            amount: amountNumber,
        };

        setIsLoading(true);
        try {
            await addExpense(expensesDataToSend);
  
            setFormData(initialFormState);
            setError(null);
            await fetchExpenses(); 
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            setIsLoading(false);
        }
        setIsModalOpen(false); // Cierra el modal al guardar
        setTimeout(() => setMessage(''), 5000);

    };

    return (
        <div style={{ padding: '0.5rem' }}>
            {/* Encabezado y botón de registro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="card-title" style={{ color: '#4f46e5', margin: 0 }}>Historial de Egresos</h2>
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
                    ➕ Registrar Nuevo Egreso
                </button>
            </div>

            {/* Mensaje de confirmación/error */}
            {message && (
                <div 
                    style={{ 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem', 
                        marginBottom: '1rem',
                        backgroundColor: message.startsWith('Error') ? '#fee2e2' : '#d1fae5', 
                        color: message.startsWith('Error') ? '#991b1b' : '#065f46', 
                        fontWeight: '500' 
                    }}
                >
                    {message}
                </div>
            )}

            {/* Renderiza la Tabla */}
            <ExpensesTable expenses={expenses} />

            {/* Renderiza el Modal que contiene el formulario */}
            
            <ExpensesModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // Permite cerrar el modal con la X
                title="Registrar Nuevo Gasto (Egreso)"
            >
                <ExpensesForm 
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </ExpensesModal>
            
        </div>
    );
};

export default Expenses;