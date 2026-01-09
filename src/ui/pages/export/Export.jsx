import { useState, useCallback, useEffect } from "react";
import ExportCard from "../../components/exports/ExportCard.jsx";
import Modal from "../../components/generic/modal/Modal.jsx";
import ExportForm from "../../components/exports/ExportForm.jsx";
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import { Users, FileText,  TrendingUp, TrendingDown} from "../../components/icons/Icons.jsx";

import {getYearsOfPayments,getYearsOfExpenses,getStudentsActive,
        getPaymentsByYear,getExpensesByYear,getStudentsByActive,
        getAllPayments, getAllExpenses,
        getPaymentDivisions,getPaymentConcepts,
        exportPaymentsByYearToExcel,exportExpensesByYearToExcel,exportStudentsByActiveToExcel
    } from "../../constant/DBFunctions.jsx"

const EXPORT_FILTERS = {
  Pagos: {
    years: true,
    concepts: true,
    methods: true,
    divisions: true,
    studentStatus: false,
  },
  Gastos: {
    years: true,
    concepts: false,
    methods: false,
    divisions: false,
    studentStatus: false,
  },
  Estudiantes: {
    years: true,
    concepts: false,
    methods: false,
    divisions: false,
    studentStatus: true,
  },
  Todo: {
    years: true,
    concepts: true,
    methods: true,
    divisions: true,
    studentStatus: true,
  },
};

import './export.css';
const Export = () => {
    //escoger card
    const [isModalOpen,setIsModalOpen] = useState(null);
    const [selectedType,setSelectedType] = useState(null);
    const [selectData, setSelectData] = useState(null);

    //Años
    const [yearsPayments,setYearsPayments] = useState([]);
    const [yearsExpenses,setYearsExpenses] = useState([]);

    //Filtros
    //estudiantes
    const [filterInitialized, setFilterInitialized] = useState(false);
    const [studentActive,setStudentActive] = useState([]);
    const statusOptions = studentActive.map(s => ({
        active: s.active,
        label: s.active === 1 ? "Activo" : "Inactivo"
    }));

    //pagos
    const [divisions, setDivisions] = useState([]);
    const [concepts, setConcepts] = useState([]);
    const methodsOptions = [
        { value: 0, label: "Efectivo"},
        { value: 1, label: "Transferencias"}
    ]
    const [methods, setMethods] = useState(methodsOptions);

    //filtros
    const [filters, setFilters] = useState({
            payments: {
                years: [],
                divisions: [],
                concepts: [],
                methods: [],
            },
            expenses: {
                years: [],
            },
            students: {
                years: [],
                studentStatus: [],
            },
            all: {
                payments: {
                    years: [],
                    divisions: [],
                    concepts: [],
                    methods: [],
                },
                expenses: {
                    years: [],
                },
                students: {
                    years: [],
                    status: [],
                }
            }
    });

    const [error,setError] = useState("");

    const exportData =
            selectedType === "Pagos"
                ? yearsPayments
                : selectedType === "Gastos"
                ? yearsExpenses
                : selectedType === "Estudiantes"
                ? yearsPayments
                : [];

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const val = name === 'amount' ? value : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    }, []);


    const handleExport = async () => {
        //console.log("Exportando datos de:", selectedType, data);
        let err;
        if (selectedType === "Pagos") {
            let payments;
            if (filters.concepts.length<1){
                setError("Escoja al menos un concepto de pago.");
                return
            }
            if (filters.divisions.length<1){
                setError("Escoja al menos un curso.");
                return
            }
            if (filters.methods.length<1){
                setError("Escoja al menos un metodo de pago.");
                return
            }
            if (filters.year.length<1){
                setError("Escoja al menos un año.");
                return
            }
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
            if (!filters.studentStatus || filters.studentStatus.length<1){
                setError("Escoja al menos un estado de estudiante.");
                return
            }
            const statuses = filters.studentStatus.map(s => s.active);
            const students = await getStudentsByActive(statuses);
            err = await exportStudentsByActiveToExcel(students);
        }
        if (!err.success) {
                setError(err.error);
                return
            }
        setIsModalOpen(false);
    };

    const fetchData = useCallback(async () => {

        try {
            const [fetchedYearPayments, fetchedYearExpenses, fetchedActiveStudents,fetchedDivisions,fetchedConcepts] = await Promise.all([
                        getYearsOfPayments(),
                        getYearsOfExpenses(),
                        getStudentsActive(),
                        getPaymentDivisions(),
                        getPaymentConcepts(),  
                ]);
                setYearsPayments(Array.isArray(fetchedYearPayments) ? fetchedYearPayments : []);
                setYearsExpenses(Array.isArray(fetchedYearExpenses) ? fetchedYearExpenses : []);
                setStudentActive(Array.isArray(fetchedActiveStudents) ? fetchedActiveStudents : []);
                setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                setConcepts(Array.isArray(fetchedConcepts) ? fetchedConcepts : []);
                //console.log(JSON.stringify(fetchedConcepts));
            } catch (e) {
                console.error("Error al cargar datos a exportar:", e);
                setError("Error al cargar datos desde la base de datos local: " + e.message);
                setTimeout(() => { setError(""); }, 4000);
            } finally {
                //setIsLoading(false);
            }
    }, []);
    
    // Cargar Pagos, Conceptos y Divisiones al montar
    useEffect(() => {   
        fetchData();
    }, [fetchData]);


    //setear estado inicial filtros
    useEffect(() => {
        if (filterInitialized) return

        let ready =
            concepts.length > 0 &&
            divisions.length > 0 &&
            studentActive.length > 0;

        if (!ready) return;

        const expenseYears = yearsExpenses?.map(y =>y.year) ?? [];
        const paymentYears = yearsPayments?.map(y =>y.year) ?? [];

        setFilters(prev => ({
            ...prev,

            // pagos
            payments: {
                ...prev.payments,
                years: Array.isArray(paymentYears) ? paymentYears : [],
                concepts: concepts.map(c => Number(c.id)),
                divisions: divisions.map(d => Number(d.id)),
                methods: methodsOptions.map(m => m.value),
            },

            // estudiantes
            students: {
                ...prev.students,
                years: Array.isArray(paymentYears) ? paymentYears : [],
                studentStatus: studentActive.map(s => Number(s.active)),
            },
            
            // gastos
            expenses: {
                ...prev.expenses,
                years: expenseYears,
            },

            // historico
            all: {
                ...prev.all,
                payments: {
                    ...prev.all.payments,
                    years: Array.isArray(paymentYears) ? paymentYears : [],
                    concepts: concepts.map(c => Number(c.id)),
                    divisions: divisions.map(d => Number(d.id)),
                    methods: methodsOptions.map(m => m.value),
                },
                expenses: {
                    ...prev.all.expenses,
                    years: expenseYears,
                },
                students: {
                    ...prev.all.students,
                    years: Array.isArray(paymentYears) ? paymentYears : [],
                    studentStatus: studentActive.map(s => Number(s.active)),
                }
            }
        }));
        
        setFilterInitialized(true);
        
    }, [concepts, divisions, studentActive, methodsOptions, filterInitialized]);

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
                    disabled={yearsPayments.length > 0 ? false : true}
                    disabledMessage={"Agrega pago para exportar"}
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
                    disabled={yearsExpenses.length > 0 ? false : true}
                    disabledMessage={"Agrega gasto para exportar"}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Gastos")
                    }}
                />

                <ExportCard
                    title="Estudiantes"
                    description="Listado de alumnos matriculados por año"
                    colorClass={"color-estudiantes"}
                    disabled={studentActive.length > 0 ? false : true}
                    disabledMessage={"Agrega gasto para exportar"}
                    icon={Users}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Estudiantes")
                    }}
                />

                <ExportCard
                    title="Historico"
                    description="Archivo que incluye todos los módulos."
                    colorClass={"color-completo"}
                    icon={FileText}
                    onClick={() => {
                        setIsModalOpen(true)
                        setSelectedType("Todo")
                    }}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Informacion a exportar"
            >
                {/* Mensaje de Error */}
                {error && (
                    <ErrorMessage
                        message={error}
                    />
                )}
                <ExportForm
                    type={selectedType}
                    data={exportData}
                    concepts={concepts}
                    divisions={divisions}
                    methods={methods}
                    filterConfig={EXPORT_FILTERS[selectedType]}
                    filters={filters}
                    setFilters={setFilters}
                    yearsData={{ 
                        yearPayments: yearsPayments ?? [],
                        yearExpenses: yearsExpenses ?? [], 
                    }}
                    studentStatus={statusOptions}
                    selectData={selectData}
                    handleChange={handleExport}
                    formState={{
                        payments: yearsPayments.length > 0 ? true : false,
                        expenses: yearsExpenses.length > 0 ? true : false,
                        students: studentActive.length > 0 ? true : false,
                    }}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            </div>
        </div>
  );
};

export default Export;