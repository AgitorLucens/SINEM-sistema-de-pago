import { useState, useCallback, useEffect } from "react";
import ExportCard from "../../components/exports/ExportCard.jsx";
import Modal from "../../components/generic/modal/Modal.jsx";
import ExportForm from "../../components/exports/ExportForm.jsx";

import {getYearsOfPayments,getYearsOfExpenses,getStudentsActive,
        getPaymentsByYear,getExpensesByYear,getStudentsByActive,
        exportPaymentsByYearToExcel,exportExpensesByYearToExcel,exportStudentsByActiveToExcel} from "../../constant/PaymentConstant.jsx"

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
        console.log("Exportando datos de:", selectedType, data);
        if (selectedType === "Pagos") {
            const payments = await getPaymentsByYear(data);
            exportPaymentsByYearToExcel(payments)
        } else if(selectedType === "Gastos") {
            const expenses = await getExpensesByYear(data);
            exportExpensesByYearToExcel(expenses)
        } else if(selectedType === "Estudiantes") {
            const students = await getStudentsByActive(data);
            exportStudentsByActiveToExcel(students);
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
        <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Pricing</h1>

            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>

                <ExportCard
                    title="Ingresos"
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Pagos")
                    }}
                />

                <ExportCard
                    title="Egresos"
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Gastos")
                    }}
                />

                <ExportCard
                    title="Estudiantes"
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Estudiantes")
                    }}
                />

                <ExportCard
                    title="Todo"
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
                <ExportForm
                    type={selectedType}
                    data={exportData}
                    selectData={selectData}
                    handleChange={handleExport}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
  
        </div>
  );
};

export default Export;