import TeachersTable from '../../components/teachers/TeachersTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import ConfirmDeleteModal from '../../components/generic/modal/ConfirmDeleteModal.jsx';
import TeacherForm from '../../components/teachers/TeacherForm.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';

import { getAllTeachers, addTeacher, getPaymentDivisions,
         deleteTeacherById
 } from '../../constant/DBFunctions.jsx';
import { useForm } from '../../hooks/useForm.js';
import { useStatusMessages } from '../../hooks/useStatusMessages.js';
import { useEntityDelete } from '../../hooks/useEntityDelete.js';

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from 'react';

import './teachers.css';

const Teachers = () => {
    const { formData, handleChange, resetForm } = useForm({
        name: '', division: '', amount: '',
    });
    const { message, error, setError, showMessage, showError } = useStatusMessages();

    const [teachers, setTeachers] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTeachers = useCallback(async () => {
        getAllTeachers().then((data) => {
            setTeachers(Array.isArray(data) ? data : []);
        }).catch((err) => {
            console.error("Error fetching teachers:", err);
            showError("Error al cargar los datos de profesores");
        });
    }, [showError]);

    const deleteCtrl = useEntityDelete({
        onDelete: deleteTeacherById,
        onRefresh: fetchTeachers,
    });

    useEffect(() => {
        getPaymentDivisions().then((data) => {
            setDivisions(data);
        }).catch((err) => {
            console.error("Error fetching divisions:", err);
        });
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const teacherData = {
            name: formData.name,
            division_id: Number(formData.division),
            amount: parseFloat(formData.amount),
        };

        try {
            const res = await addTeacher(teacherData);
            if (res.success) {
                resetForm();
                await fetchTeachers();
                setIsModalOpen(false);
                showMessage("Profesor registrado exitosamente");
                return;
            }
            if (res.error && res.error.includes('UNIQUE constraint failed')) {
                showError("Error al guardar el profesor: Ya existe un profesor con ese Curso.");
                return;
            }
            showError("Error al guardar el profesor: " + (res.error || "Error desconocido."));
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            showError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        }
    }, [formData, fetchTeachers, resetForm, showMessage, showError]);

    const handleTableUpdate = useCallback(async (data, func) => {
        const res = await func(data);
        if (!res.success){
            if (res.error && res.error.includes("UNIQUE constraint failed")){
                showError("Solo puede haber un Profesor por Curso");
                return;
            }
            showError(res.error);
            return;
        }
        showMessage("Pago actualizado exitosamente");
        await fetchTeachers();
    }, [fetchTeachers, showMessage, showError]);

    const handleDeleteRequest = useCallback((e, teacherId) => {
        e.stopPropagation();
        deleteCtrl.openDeleteModal(teacherId);
    }, [deleteCtrl]);

    const handleConfirmDelete = useCallback(async () => {
        try {
            await deleteCtrl.confirmDelete();
            showMessage('Profesor eliminado correctamente.');
        } catch (e) {
            console.error("Error al eliminar el profesor:", e);
            showError("Error al eliminar el profesor: " + e.message);
        }
    }, [deleteCtrl, showMessage, showError]);

    return (
        <div className='container-student'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title">Profesores</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
className="btn btn-primary"
>
<span> <PlusCircledIcon/> Registrar Nuevo Profesor</span>
                </button>
            </div>

            {message && (
                <SuccessMessage message={message} />
            )}
            {(error && !deleteCtrl.isDeleteOpen && !isModalOpen) && (
                <ErrorMessage message={error} />
            )}

            <ConfirmDeleteModal
                isOpen={deleteCtrl.isDeleteOpen}
                onClose={deleteCtrl.cancelDelete}
                onConfirm={handleConfirmDelete}
                title="Borrar Profesor"
                itemName="profesor"
            />

            <TeachersTable
                teachers={teachers}
                divisions={divisions}
                handleTableUpdate={handleTableUpdate}
                onDeleteTeacher={handleDeleteRequest}
                confirmingId={deleteCtrl.confirmingId}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError("");
                }}
                title="Registrar Nuevo Profesor"
            >
                {(error && isModalOpen) && (
                    <ErrorMessage message={error} />
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
