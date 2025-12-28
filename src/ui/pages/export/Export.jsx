import { useState, useCallback, useEffect } from "react";
import ExportCard from "../../components/exports/ExportCard.jsx";
import Modal from "../../components/generic/modal/Modal.jsx";
import ExportForm from "../../components/exports/ExportForm.jsx";
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import { Users, FileText,  TrendingUp, TrendingDown} from "../../components/icons/Icons.jsx";

import {getYearsOfPayments,getYearsOfExpenses,getStudentsActive,
        getPaymentsByYear,getExpensesByYear,getStudentsByActive,
        getAllPayments, getAllExpenses,
        exportPaymentsByYearToExcel,exportExpensesByYearToExcel,exportStudentsByActiveToExcel
    } from "../../constant/DBFunctions.jsx"

import './export.css';
import { se } from "react-day-picker/locale";
const Export = () => {
    const [isModalOpen,setIsModalOpen] = useState(null);
    const [selectedType,setSelectedType] = useState(null);
    const [selectData, setSelectData] = useState(null);

    //Años
    const [yearsPayments,setYearsPayments] = useState([]);
    const [yearsExpenses,setYearsExpenses] = useState([]);
    //Estudiante Estado
    const [studentActive,setStudentActive] = useState([]);

    const [error,setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState("");

    const exportData =
            selectedType === "Pagos"
                ? yearsPayments
                : selectedType === "Gastos"
                ? yearsExpenses
                : selectedType === "Estudiantes"
                ? studentActive
                : [];

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    }, []);


    const handleExport = async (data) => {
        //console.log("Exportando datos de:", selectedType, data);
        if (!data) {
            setErrorInfo("Escoga los valores adecuados")
            setError(true);
            return
        }
        setErrorInfo("");
        setError(false);
        let err;
        if (selectedType === "Pagos") {
            let payments;
            if (data === "all"){
                payments = await getAllPayments();
                err = await exportPaymentsByYearToExcel(payments);
            } else {
                payments = await getPaymentsByYear(data);
                err = await exportPaymentsByYearToExcel(payments);
            }   
        } else if(selectedType === "Gastos") {
            if (data === "all"){
                expenses = await getAllExpenses();
                err = await exportExpensesByYearToExcel(expenses);
            } else {
                expenses = await getExpensesByYear(data);
                err = await exportExpensesByYearToExcel(expenses);
            }
        } else if(selectedType === "Estudiantes") {
            const students = await getStudentsByActive(data);
            const err = await exportStudentsByActiveToExcel(students);
        }
        if (!err.success) {
                setError(true);
                setErrorInfo(err.error);
                return
            }
        setIsModalOpen(false);
    };

    const fetchData = useCallback(async () => {

        setError(null);
        try {
            const [fetchedYearPayments, fetchedYearExpenses, fetchedActiveStudents] = await Promise.all([
                        getYearsOfPayments(),
                        getYearsOfExpenses(),
                        getStudentsActive()
                ]);
                setYearsPayments(Array.isArray(fetchedYearPayments) ? fetchedYearPayments : []);
                setYearsExpenses(Array.isArray(fetchedYearExpenses) ? fetchedYearExpenses : []);
                setStudentActive(Array.isArray(fetchedActiveStudents) ? fetchedActiveStudents : []);
                
            } catch (e) {
                console.error("Error al cargar datos a exportar:", e);
                setError("Error al cargar datos desde la base de datos local: " + e.message);
            } finally {
                //setIsLoading(false);
            }
    }, []);
    
    // Cargar Pagos, Conceptos y Divisiones al montar
    useEffect(() => {   
        fetchData();
    }, [fetchData]);


    return (
        <div className="container-export">
            <div className="content-wrapper-export">
                <div className="export-header">
                    <h1>Exportación de Datos</h1>
                    <p>Selecciona el módulo administrativo para generar el reporte en Excel.</p>
                </div>

            <div className="grid-export-card">

                <ExportCard
                    title="Ingresos"
                    description="Pagos, matrículas y mensualidades recibidas."
                    colorClass={"color-ingresos"}
                    icon={TrendingUp}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Pagos")
                    }}
                />

                <ExportCard
                    title="Egresos"
                    description="Gastos incluidos en el sistema."
                    colorClass={"color-egresos"}
                    icon={TrendingDown}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Gastos")
                    }}
                />

                <ExportCard
                    title="Estudiantes"
                    description="Listado de alumnos matriculados por año"
                    colorClass={"color-estudiantes"}
                    icon={Users}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Estudiantes")
                    }}
                />

                <ExportCard
                    title="Todo"
                    description="Archivo que incluye todos los módulos."
                    colorClass={"color-completo"}
                    icon={FileText}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("")
                    }}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Pagos a exportar"
            >
                {/* Mensaje de Error */}
                {error && (
                    <ErrorMessage
                        message={errorInfo}
                    />
                )}
                <ExportForm
                    type={selectedType}
                    data={exportData}
                    selectData={selectData}
                    handleChange={handleExport}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            </div>
        </div>
  );
};

export default Export;