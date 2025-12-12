import StudentsTable from '../../components/students/StudentsTable'
import StudentsModal from '../../components/students/StudentsModal'
import { getAllStudents } from '../../constant/PaymentConstant'; 

import { useState, useEffect, useCallback } from 'react';

const Students = () => {

    const initialFormState = {
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        description: '',
        reference: '',
    };
        
    const [formData, setFormData] = useState(initialFormState);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false); 

    const fetchStudents = useCallback(async () => {
            setIsLoading(true);
            try {
                console.log("Cargando estudiantes...");
                const fetchedStudents = await getAllStudents();
                setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
                console.log(fetchStudents);
            } catch (e) {
                console.error("Error al recargar estudiantes:", e);
                setError("Error al recargar el historial de egresos.");
            } finally {
                setIsLoading(false);
            }
        }, []);
    

    // Cargar Pagos, Conceptos y Divisiones al montar
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

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
            <StudentsTable students={students} />

            {/* Renderiza el Modal que contiene el formulario */}
            
            <StudentsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // Permite cerrar el modal con la X
                title="Registrar Nuevo Gasto (Egreso)"
            >
                {/*
                <ExpensesForm 
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                */}
            </StudentsModal>
            
        </div>
    );
};

export default Students;