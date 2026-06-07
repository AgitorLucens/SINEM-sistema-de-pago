import StudentsTable from '../../components/students/StudentsTable';
import Modal from '../../components/generic/modal/Modal.jsx';
import ConfirmDeleteModal from '../../components/generic/modal/ConfirmDeleteModal.jsx';
import StudentDetail from '../../components/students/StudentDetail.jsx';
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import StudentForm from '../../components/students/StudentsForm';
import StudentImportCard from '../../components/students/StudentImportCard.jsx';
import { getAllStudents, addStudent, deleteStudentById,
         getYearsOfPayments, getPaymentByStudentId
 } from '../../constant/DBFunctions.jsx';
import { useForm } from '../../hooks/useForm.js';
import { useStatusMessages } from '../../hooks/useStatusMessages.js';
import { useEntityDelete } from '../../hooks/useEntityDelete.js';
import { PlusCircledIcon, ArrowUpIcon } from "@radix-ui/react-icons";

import { useState, useEffect, useCallback } from 'react';

import './students.css';

const Students = () => {
    const { formData, handleChange, resetForm } = useForm({
        name: '', reference: '', phone: '', email: '', active: '',
        scholarship: '', scholarship_amount: '',
    });
    const { message, setMessage, error, setError, showMessage, showError } = useStatusMessages();

    const [students, setStudents] = useState([]);
    const [yearsPayments, setYearsPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPayments, setStudentPayments] = useState([]);
    const [file, setFile] = useState(null);

    const loadStudentPayments = useCallback(async (student) => {
        const studentPayments = await getPaymentByStudentId(student.id);
        setSelectedStudent(student);
        setStudentPayments(studentPayments);
        if (studentPayments.length > 0) {
            setSelectedYear(Number(studentPayments[0].year));
        }
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedYearsPayments, fetchedStudents] = await Promise.all([
                getYearsOfPayments(),
                getAllStudents()
            ]);
            setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
            setYearsPayments(Array.isArray(fetchedYearsPayments) ? fetchedYearsPayments : []);
        } catch (e) {
            console.error("Error al recargar estudiantes:", e);
            setError("Error al recargar el historial de egresos.");
        } finally {
            setIsLoading(false);
        }
    }, [setError]);

    const deleteCtrl = useEntityDelete({
        onDelete: deleteStudentById,
        onRefresh: fetchData,
    });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTableUpdate = useCallback(async (data, func) => {
        const res = await func(data);
        if (!res.success){
            showError(res.error);
            return;
        }
        showMessage("Estudiante actualizado exitosamente");
        await fetchData();
    }, [fetchData, showMessage, showError]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.reference || !formData.active) {
            showError("Por favor, complete todos los campos obligatorios. (Nombre, Email, Referencia, Activo)");
            return;
        }

        if (!formData.name) {
            showError("Introduzca un nombre para el estudiante.");
            return;
        }

        if (!formData.email) {
            showError("Introduzca un email para el estudiante.");
            return;
        }

        const studentDataToSend = {
            name: formData.name,
            reference: formData.reference,
            phone: formData.phone,
            email: formData.email,
            active: formData.active,
            scholarship: formData.scholarship,
            scholarship_amount: formData.scholarship_amount,
        };

        setIsLoading(true);
        try {
            await addStudent(studentDataToSend);
            resetForm();
            setError(null);
            await fetchData();
        } catch (e) {
            console.error("Error al guardar el pago vía IPC:", e);
            showError("Error al guardar el pago: " + (e.message || 'Error desconocido. Verifique la consola.'));
        } finally {
            setIsLoading(false);
        }
        setIsModalOpen(false);
        showMessage("Estudiante registrado exitosamente");
    }, [formData, fetchData, resetForm, showMessage, showError, setError]);

    const handleDeleteRequest = useCallback((e, studentId) => {
        e.stopPropagation();
        deleteCtrl.openDeleteModal(studentId);
    }, [deleteCtrl]);

    const handleConfirmDelete = useCallback(async () => {
        try {
            await deleteCtrl.confirmDelete();
            showMessage('Estudiante eliminado correctamente.');
        } catch (e) {
            console.error("Error al eliminar el estudiante:", e);
            showError("Error al eliminar el estudiante: " + e.message);
        }
    }, [deleteCtrl, showMessage, showError]);

    return (
        <div className='container-student'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title">Estudiantes</h2>
                <div>
                    <button
                        onClick={() => setIsModalImportOpen(true)}
                        className='btn-primary-export'
                    >
                        <ArrowUpIcon/> Importar Estudiantes
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <span> <PlusCircledIcon/> Registrar Nuevo Estudiante</span>
                    </button>
                </div>
            </div>

            {(message && !isModalDetailOpen && !isModalOpen) && (
                <SuccessMessage message={message} />
            )}
            {(error && !isModalDetailOpen && !isModalOpen) && (
                <ErrorMessage message={error} />
            )}

            <StudentsTable students={students}
                           loadStudent={loadStudentPayments}
                           modalDetailOpen={setIsModalDetailOpen}
                           onDeleteStudent={handleDeleteRequest}
                           confirmingId={deleteCtrl.confirmingId}
                           handleTableUpdate={handleTableUpdate}
            />

            <Modal
                isOpen={isModalImportOpen}
                onClose={() => {
                    setIsModalImportOpen(false);
                    setError("");
                    setFile(null);
                }}
                title="Importar Estudiantes"
            >
                {error && (
                    <ErrorMessage message={error} />
                )}
                <StudentImportCard
                    fetchData={fetchData}
                    file={file}
                    setFile={setFile}
                    setModal={setIsModalImportOpen}
                    setError={setError}
                    setMessage={setMessage}
                />
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                    setError("");
                }}
                title="Registrar Nuevo Estudiante"
            >
                {error && (
                    <ErrorMessage message={error} />
                )}
                <StudentForm
                    formData={formData}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={deleteCtrl.isDeleteOpen}
                onClose={deleteCtrl.cancelDelete}
                onConfirm={handleConfirmDelete}
                title="Borrar Estudiante"
                itemName="estudiante"
            />

            <Modal
                isOpen={isModalDetailOpen}
                onClose={() => setIsModalDetailOpen(false)}
                title="Detalle del Estudiante"
            >
                {error && (
                    <ErrorMessage message={error} />
                )}
                {(message) && (
                    <SuccessMessage message={message} />
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
