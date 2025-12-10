import PaymentsTable from '../../components/payments/PaymentsTable.jsx'; 
import PaymentsForm from '../../components/payments/PaymentsForm.jsx'; 
import PaymentsModal from '../../components/payments/PaymentsModal.jsx';

import {getPaymentConcepts, getPaymentDivisions }from "../../constant/PaymentConstant.jsx"

import { useState, useEffect, useCallback } from 'react';

const Payments = () => {
    // 1. Estado para la lista de pagos
    const initialFormState = {
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        method: 'TRANSFERENCIA',
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');


    const [concepts, setConcepts] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [isConceptsLoading, setIsConceptsLoading] = useState(false);
    const [isDivsionsLoading, setIsDivisionsLoading] = useState(false);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const loadedData = await window.api.getAllPayments(); 
            
            loadedData.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return dateB.getTime() - dateA.getTime(); 
            });

            setPayments(loadedData);
        } catch (e) {
            console.error("Error al cargar datos vía IPC:", e);
            setError("Error al cargar datos desde la base de datos local: " + e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        const loadConcepts = async () => {
            setIsConceptsLoading(true);
            try {
                const fetchedConcepts = await getPaymentConcepts();
                setConcepts(Array.isArray(fetchedConcepts) ? fetchedConcepts : []);
                
                // Opcional: Si solo hay un concepto, seleccionarlo por defecto
                if (fetchedConcepts.length === 1) {
                    setFormData(prev => ({ ...prev, concept: fetchedConcepts[0].id }));
                }

            } catch (err) {
                console.error("Error al cargar conceptos:", err);
                setError("No se pudieron cargar los conceptos de pago.");
            } finally {
                setIsConceptsLoading(false);
            }
        };

        const loadDivisions = async () => {
            setIsDivisionsLoading(true);
            try {
                const fetchedDivisions = await getPaymentDivisions();
                setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                
                // Opcional: Si solo hay un concepto, seleccionarlo por defecto
                if (fetchedDivisions.length === 1) {
                    setFormData(prev => ({ ...prev, division: fetchedDivisions[0].id }));
                }

            } catch (err) {
                console.error("Error al cargar cursos:", err);
                setError("No se pudieron cargar los cursos de pago.");
            } finally {
                setIsDivisionsLoading(false);
            }
        };
        loadDivisions();
        loadConcepts();
    }, []); // Se ejecuta solo una vez al montar


    useEffect(() => {
        fetchPayments();

    }, [fetchPayments]);

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
            return;
        }

        const paymentDataToSend = {
            date: formData.date,
            amount: amountNumber,
            payment_method: formData.method,
            concept_id: formData.concept,
            division_id: formData.division,
            student_id: null,
            invoice_id: null,
            created_by: 1, // Simulación de usuario
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),

        };

        setIsLoading(true);
        try {
            await window.api.addPayment(paymentDataToSend);

            setFormData(initialFormState);
            setError(null);
            await fetchPayments(); 
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            setIsLoading(false);
        }
        setIsModalOpen(false); // Cierra el modal al guardar
        setTimeout(() => setMessage(''), 5000);
    };

    const deletePayment = useCallback(async (paymentId) => {
        setIsLoading(true);
        try {
            await window.api.deletePayment(paymentId);
            
            setError(null);
            await fetchPayments();
        } catch (e) {
            console.error("Error al eliminar el pago vía IPC:", e);
            setError("Error al eliminar el pago: " + e.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchPayments]); 



    return (
        <div style={{ padding: '0.5rem' }}>
            {/* Encabezado y botón de registro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="card-title" style={{ color: '#4f46e5', margin: 0 }}>Historial de Pagos </h2>
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
                    ➕ Registrar Nuevo Pago
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
            <PaymentsTable payments={payments} onDeletePayment={deletePayment}/>

            {/* Renderiza el Modal que contiene el formulario */}
            <PaymentsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // Permite cerrar el modal con la X
                title="Registrar Nuevo Pago (Ingresos)"
            >
                <PaymentsForm 
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    concepts={concepts}
                    divisions={divisions}
                />
            </PaymentsModal>
        </div>
    );
};

export default Payments;