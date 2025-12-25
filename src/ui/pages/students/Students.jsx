import StudentsTable from '../../components/students/StudentsTable';
import StudentsModal from '../../components/students/StudentsModal';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import StudentForm from '../../components/students/StudentsForm';
import { getAllStudents, addStudent, deleteStudentById } from '../../constant/DBFunctions.jsx'; 
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { useState, useEffect, useCallback } from 'react';

const Students = () => {

    const initialFormState = {
        name: '',
        reference: '',
        phone: '',
        email: '',
        active: '',
    };
        
    const [formData, setFormData] = useState(initialFormState);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false); 

    // eliminar estudiante
    const [confirmingId, setConfirmingId] = useState(null);

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


    const handleChange = (e) => {
        const { name, value } = e.target;
        // La lógica de manejo de entrada se mantiene aquí
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };


    const handleSubmit = async (e) => {
            e.preventDefault();

            const studentDataToSend = {
                name: formData.name,
                reference: formData.reference,
                phone: formData.phone,
                email: formData.email,
                active: formData.active,
            };

            setIsLoading(true);
            try {
                await addStudent(studentDataToSend);
      
                setFormData(initialFormState);
                setError(null);
                await fetchStudents(); 
            } catch (e) {
                console.error("Error al guardar el pago vía IPC:", e);
                setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
            } finally {
                setIsLoading(false);
            }
            setIsModalOpen(false); // Cierra el modal al guardar
            setTimeout(() => setMessage(''), 5000);
    
    };

    const deleteStudent = async (e, studentId) => {
            // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
            e.stopPropagation();
            if (confirmingId === studentId) {
                setIsLoading(true);
                e.stopPropagation();
                if (!window.confirm("¿Estás seguro de que quieres eliminar este estudiante? Esta acción no se puede deshacer.")) {
                    setIsLoading(false);
                    setConfirmingId(null);
                    return;
                }
                try {
                    await deleteStudentById(studentId);
                    setMessage('Estudiante eliminado correctamente.');
                    setError(null);
                    await fetchStudents();
                } catch (e) {
                    console.error("Error al eliminar el estudiante:", e);
                    setError("Error al eliminar el estudiante: " + e.message);
                } finally {
                    setIsLoading(false);
                    setTimeout(() => { setError(null); setMessage(''); }, 5000); 
                }
                
                setConfirmingId(null);
            
            } else {
                setConfirmingId(studentId);
                setTimeout(() => setConfirmingId(null), 4000);
            }
    }; 

    return (
        <div style={{ padding: '0.5rem' }}>
            {/* Encabezado y botón de registro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="card-title" style={{ color: '#4f46e5', margin: 0 }}>Estudiantes</h2>
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
                    <PlusCircledIcon/> Registrar Nuevo Estudiante
                </button>
            </div>

            {/* Mensaje de confirmación/error */}
            {message && (
                <SuccessMessage
                    message={message}
                />
            )}

            {/* Renderiza la Tabla */}
            <StudentsTable students={students} 
                           onDeleteStudent={deleteStudent}
                           confirmingId={confirmingId}/>

            {/* Renderiza el Modal que contiene el formulario */}
            
            <StudentsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // Permite cerrar el modal con la X
                title="Registrar Nuevo Estudiante"
            >
                {error && (
                    <ErrorMessage
                        message={error}
                    />
                )}
                <StudentForm 
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                
            </StudentsModal>
            
        </div>
    );
};

export default Students;