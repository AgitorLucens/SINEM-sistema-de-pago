import TeachersTable from '../../components/teachers/TeachersTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import TeacherForm from '../../components/teachers/TeacherForm.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';

import { getAllTeachers, addTeacher, getPaymentDivisions,
         deleteTeacherById
 } from '../../constant/DBFunctions.jsx';

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from 'react';

import './teachers.css';
const Teachers = () => {
    const [initialFormState, setInitialFormState] = useState({
        name: '',
        division: '',
        amount: '',
    });

    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState("");
    // form
    const [formData, setFormData] = useState(initialFormState);
    const [divisions, setDivisions] = useState([]);


    // delete teacher
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);
    const [acceptDelete, setAcceptDelete] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        //setIsLoading(true);
        
        const teacherData = {
            name: formData.name,
            division_id: Number(formData.division),
            amount: parseFloat(formData.amount),
        };

        try {
            const res = await addTeacher(teacherData);
            if (!res.success) {
                if (res.error && res.error.includes('UNIQUE constraint failed')) {
                    setError("Error al guardar el profesor: Ya existe un profesor con ese Curso.");
                    return;
                }
            } else {
                setError("Error al guardar el profesor: " + (res.error || "Error desconocido."));
            }
            setFormData(initialFormState);
            setError("");
            await fetchTeachers();
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            setError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            //setIsLoading(false);
        }
        setIsModalOpen(false);
        setMessage("Profesor registrado exitosamente");
        setTimeout(() => setMessage(''), 5000);
        
    }, [formData, initialFormState]);
    
    useEffect(() => {
        getPaymentDivisions().then((data) => {
            setDivisions(data);
        }).catch((err) => {
            console.error("Error fetching divisions:", err);
        });
    }, []);
    
    const fetchTeachers = useCallback(async () => {
         getAllTeachers().then((data) => {
            setTeachers(Array.isArray(data) ? data : []);
        }).catch((err) => {
            console.error("Error fetching teachers:", err);
            setError("Error al cargar los datos de profesores");
        });   
    }, [])

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handleTableUpdate = async (data, func) => {
        const res = await func(data);
        if (!res.success){
            if (res.error && res.error.includes("UNIQUE constraint failed")){
                setError("Solo puede haber un Profesor por Curso");
                setTimeout(() => { setError("");}, 4000);
                return
            }
            setError(res.error);
            setTimeout(() => { setError("");}, 4000);
            return
        }
        setMessage("Pago actualizado exitosamente");
        setTimeout(() => { setMessage("");}, 4000);
        await fetchTeachers(); 
    }
    
    const deleteTeacher = async (e, teacherId) => {
                // En el entorno real, usa un modal o componente de confirmación en lugar de window.confirm()
                e.stopPropagation();
                if (confirmingId === teacherId) {
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
                        const res = await deleteTeacherById(teacherId);

                        setMessage('Profesor eliminado correctamente.');
                        setError(null);
                        await fetchTeachers();
                    } catch (e) {
                        console.error("Error al eliminar el profesor:", e);
                        setError("Error al eliminar el profesor: " + e.message);
                    } finally {
                        setIsLoading(false);
                        setIsDeleteOpen(false);
                        setConfirmingId(null);
                        setAcceptDelete(false);
                        setTimeout(() => { setError(""); setMessage(''); }, 5000); 
                    }
                    
                    setConfirmingId(null);
                
                } else {
                    setConfirmingId(teacherId);
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
                <h2 className="card-title" style={{ color: '#4f46e5', margin: 0 }}>
                    Profesores
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)} // Abre el modal (placeholder)
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
                    <PlusCircledIcon/> Registrar Nuevo Profesor
                </button>
            </div>

            {/* Mensaje de confirmación/error */}
            {message && (
                <SuccessMessage
                    message={message}
                />
            )}
            {(error && !isDeleteOpen && !isModalOpen) && (
                <ErrorMessage
                    message={error}
                />
            )}

            {/* modal confirmacion borrado*/}
            <Modal 
                isOpen={isDeleteOpen}
                onClose={ ()=>{
                    setConfirmingId(null);
                    setIsDeleteOpen(false);
                }}
                title="Borrar Profesor"
            >
                <div>
                    <div className="alert-delete">
                        <p>
                        <strong>¿Estás seguro de que quieres eliminar este profesor?</strong> Esta accion no se puede deshacer.
                        </p>
                    </div>
                    <button className="btn-delete-confirm"
                            onClick={(e)=>{
                                setAcceptDelete(true);
                                deleteTeacher(e,confirmingId);
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

            {/* Renderiza la Tabla de Profesores */}
            <TeachersTable 
                teachers={teachers}
                divisions={divisions}
                handleTableUpdate={handleTableUpdate}
                onDeleteTeacher={deleteTeacher}
                confirmingId={confirmingId}

            />
            
            {/* Renderiza el Modal que contiene el formulario (Placeholder) */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setError("");
                }} 
                title="Registrar Nuevo Profesor"
            >
                {(error && isModalOpen) && (
                    <ErrorMessage
                        message={error}
                    />
                )}
                <TeacherForm
                    formData={formData}
                    divisions={divisions}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Modal>
        </div>
    );
};

export default Teachers;