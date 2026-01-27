import StudentsTable from '../../components/students/StudentsTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import StudentsDetail from '../../components/students/StudentDetail.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import StudentForm from '../../components/students/StudentsForm';
import { getAllStudents, addStudent, deleteStudentById,
         getYearsOfPayments, getPaymentByStudentId
 } from '../../constant/DBFunctions.jsx'; 
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { useState, useEffect, useCallback } from 'react';
import StudentDetail from '../../components/students/StudentDetail.jsx';

import './students.css';
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
    const [yearsPayments, setYearsPayments] = useState([]);


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPayments, setStudentPayments] = useState([]);
    // eliminar estudiante
    const [confirmingId, setConfirmingId] = useState(null);
    const [acceptDelete, setAcceptDelete] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    //student details
    const loadStudentPayments = async (student) => {
        //console.log("estudante entrane: "+JSON.stringify(student));
        const studentPayments = await getPaymentByStudentId(student.id);
        //console.log(studentPayments);
        setSelectedStudent(student);
        setStudentPayments(studentPayments);
        if (studentPayments.length > 0) {
            setSelectedYear(Number(studentPayments[0].year))
        }
    }

    // cargar tabla
    const fetchData = useCallback(async () => {
            setIsLoading(true);
            try {
                //console.log("Cargando estudiantes...");
                const [fetchedYearsPayments,fetchedStudents] = await Promise.all([
                    getYearsOfPayments(),
                    getAllStudents()
                ]);
                //console.log(fetchedYearsPayments);
                setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
                setYearsPayments(Array.isArray(fetchedYearsPayments) ? fetchedYearsPayments : []);
                //console.log(fetchStudents);
            } catch (e) {
                console.error("Error al recargar estudiantes:", e);
                setError("Error al recargar el historial de egresos.");
            } finally {
                setIsLoading(false);
            }
        }, []);
    

    // Cargar Pagos, Conceptos y Divisiones al montar
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handles

    const handleTableUpdate = async (data, func) => {
        const res = await func(data);
        if (!res.success){
            setError(res.error);
            setTimeout(() => { setError(""); setMessage(''); }, 4000);
            return
        }
        setMessage("Estudiante actualizado exitosamente");
        setTimeout(() => { setMessage(""); setError(''); }, 4000);
        await fetchData(); 
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // La lógica de manejo de entrada se mantiene aquí
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };


    const handleSubmit = async (e) => {
            e.preventDefault();

            if (!formData.name || !formData.email || !formData.reference || !formData.active) {
                setError("Por favor, complete todos los campos obligatorios. (Nombre, Email, Referencia, Activo)");
                setTimeout(() => { setError(""); setMessage(''); }, 4000);
                return;
            }

            if (!formData.name) {
                setError("Introduzca un nombre para el estudiante.");
                setTimeout(() => { setError(""); setMessage(''); }, 4000);
                return;
            }

            if (!formData.email) {
                setError("Introduzca un email para el estudiante.");
                setTimeout(() => { setError(""); setMessage(''); }, 4000); 
                return;
            }

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
                await fetchData(); 
            } catch (e) {
                console.error("Error al guardar el pago vía IPC:", e);
                setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
            } finally {
                setIsLoading(false);
            }
            setIsModalOpen(false); // Cierra el modal al guardar
            setMessage("Estudiante registrado exitosamente");
            setTimeout(() => setMessage(''), 5000);
    
    };

    const deleteStudent = async (e, studentId) => {
            // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
            e.stopPropagation();
            if (confirmingId === studentId) {
                setIsLoading(true);
                e.stopPropagation();
                setIsDeleteOpen(true);
                if (acceptDelete === false) {
                    setIsLoading(false);
                    return
                }
                /*
                if (!window.confirm("¿Estás seguro de que quieres eliminar este estudiante? Esta acción no se puede deshacer.")) {
                    setIsLoading(false);
                    setConfirmingId(null);
                    return;
                }
                */
                try {
                    await deleteStudentById(studentId);
                    setMessage('Estudiante eliminado correctamente.');
                    setError(null);
                    await fetchData();
                } catch (e) {
                    console.error("Error al eliminar el estudiante:", e);
                    setError("Error al eliminar el estudiante: " + e.message);
                } finally {
                    setIsLoading(false);
                    setIsDeleteOpen(false);
                    setConfirmingId(null);
                    setAcceptDelete(false);
                    setTimeout(() => { setError(null); setMessage(''); }, 5000); 
                }
                
                setConfirmingId(null);
            
            } else {
                setConfirmingId(studentId);
                setTimeout(() => { 
                    if (isDeleteOpen)
                        setConfirmingId(null);
                }, 4000);
            }
    }; 

    return (
        <div className='container-student'>
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
            {(message && !isModalDetailOpen && !isModalOpen) && (
                <SuccessMessage
                    message={message}
                />
            )}
            {(error && !isModalDetailOpen && !isModalOpen) && (
                <ErrorMessage
                    message={error}
                />
            )}

            {/* Renderiza la Tabla */}
            <StudentsTable students={students} 
                           loadStudent={loadStudentPayments}
                           modalDetailOpen={setIsModalDetailOpen}
                           onDeleteStudent={deleteStudent}
                           confirmingId={confirmingId}
                           handleTableUpdate={handleTableUpdate}
            />

            {/* Renderiza el Modal que contiene el formulario */}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                            setIsModalOpen(false);
                            setSelectedStudent(null);
                            setError("");
                        }} // Permite cerrar el modal con la X
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
                
            </Modal>
            {/* modal confirmacion borrado*/}
            <Modal 
                isOpen={isDeleteOpen}
                onClose={ ()=>{
                    setConfirmingId(null);
                    setIsDeleteOpen(false);
                }}
                title="Borrar Estudiante"
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
                                deleteStudent(e,confirmingId);
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
            {/* modal ver detalles*/}
            <Modal 
                isOpen={isModalDetailOpen} 
                onClose={() => setIsModalDetailOpen(false)

                } // Permite cerrar el modal con la X
                title="Detalle del Estudiante"
            >
                {error && (
                    <ErrorMessage
                        message={error}
                    />
                )}
                {(message) && (
                    <SuccessMessage
                        message={message}
                    />
                )}
                <StudentDetail
                    student={selectedStudent}
                    payments={studentPayments}
                    years={yearsPayments}
                    filterYear={selectedYear}
                    handleTableUpdate={handleTableUpdate}
                    onClick={setSelectedStudent}
                    setFilterYear={setSelectedYear}
                />
                
            </Modal>
        </div>
    );
};

export default Students;