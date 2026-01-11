import { useState, useCallback, useEffect } from "react";
import ExportCard from "../../components/exports/ExportCard.jsx";
import Modal from "../../components/generic/modal/Modal.jsx";
import ExportForm from "../../components/exports/ExportForm.jsx";
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import { Users, FileText,  TrendingUp, TrendingDown} from "../../components/icons/Icons.jsx";

import {getYearsOfPayments,getYearsOfExpenses,getStudentsActive,
        getPaymentsByYear,getExpensesByYear,getStudentsByActive,
        getAllPayments, getAllExpenses, getAllStudents,
        getPaymentDivisions,getPaymentConcepts,
        exportPaymentsByYearToExcel,exportExpensesByYearToExcel,exportStudentsByActiveToExcel, exportHistoric
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
        { value: 1, label: "Transferencia"}
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
    const [message, setMessage] = useState("");

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
            if (filters.payments.concepts.length === 0){
                setError("Escoja al menos un concepto de pago.");
                return
            }
            if (filters.payments.divisions.length === 0){
                setError("Escoja al menos un curso.");
                return
            }
            if (filters.payments.methods.length === 0){
                setError("Escoja al menos un metodo de pago.");
                return
            }
            if (filters.payments.years.length === 0){
                setError("Escoja al menos un año.");
                return
            }
           
            payments = await getAllPayments();
            const filteredPayments = payments.filter(p => {
                const valueM = methodsOptions.find(
                    m => m.label === p.payment_method
                )?.value;
                // Año
                if (
                    filters.payments.years.length &&
                    !filters.payments.years.includes(String(p.year))
                ) {
                    return false;
                }

                // División
                if (
                    filters.payments.divisions.length &&
                    !filters.payments.divisions.includes(p.division_id)
                ) {
                    return false;
                }

                // Concepto
                if (
                    filters.payments.concepts.length &&
                    !filters.payments.concepts.includes(p.concept_id)
                ) {
                    return false;
                }

                // Método de pago (0 / 1)
                if (
                    filters.payments.methods.length &&
                    !filters.payments.methods.includes(valueM)
                ) {
                    
                    return false;
                }

                return true;
            });
            err = await exportPaymentsByYearToExcel({
                                                    paymentsFiltered: filteredPayments,
                                                    name: `Pagos${filters.payments.years?.length === yearsPayments?.length ? " Historico" : ""}`});
              
        } else if(selectedType === "Gastos") {
            if (!filters.expenses.years || filters.expenses.years === 0){
                setError("Escoja al menos un año para los gastos");
                return
            }
            const expenses = await getAllExpenses();
            const filteredExpenses = expenses.filter(e => {
                if (
                    filters.expenses.years.length &&
                    !filters.expenses.years.includes(String(new Date(e.date).getFullYear()))
                ) {
                    return false;
                }
                return true;
            })
            err = await exportExpensesByYearToExcel(filteredExpenses);

        } else if(selectedType === "Estudiantes") {
            if (!filters.students.studentStatus || filters.students.studentStatus.length === 0){
                setError("Escoja al menos un estado de estudiante.");
                return
            }
            if (!filters.students.years || filters.students.studentStatus.years === 0){
                setError("Escoja al menos un estado de estudiante.");
                return
            }
            //const statuses = filters.studentStatus.map(s => s.active);
            const students = await getAllStudents();
            const payments = await getAllPayments();

            const filteredStudents = students.filter(s => {
                if (
                    filters.students.studentStatus.length &&
                    !filters.students.studentStatus.includes(s.active)
                ) {
                    return false;
                }
                return true;
            });

            
            const filteredPayments = payments.filter(p => {
                if (
                    filters.students.years.length &&
                    !filters.students.years.includes(String(p.year,10))
                ) {
                    return false;
                }
                return true;
            });

            err = await exportStudentsByActiveToExcel({
                                                        students: filteredStudents,
                                                        payments: filteredPayments,
                                                        years: filters.students.years,
                                                    });
        } else if (selectedType === "Todo") {
            //Pagos
            if (yearsPayments.length > 0 && 
                filters.payments.concepts.length === 0){
                setError("Escoja al menos un concepto de pago.");
                return
            }
            if (yearsPayments.length > 0 && 
                filters.payments.divisions.length === 0){
                setError("Escoja al menos un curso.");
                return
            }
            if (yearsPayments.length > 0 &&
                filters.payments.methods.length === 0){
                setError("Escoja al menos un metodo de pago.");
                return
            }
            if (yearsPayments.length > 0 &&
                filters.payments.years.length === 0){
                setError("Escoja al menos un año para pagos.");
                return
            }
            //Gastos
            if (yearsExpenses.length > 0 && filters.expenses.years === 0){
                setError("Escoja al menos un año para los gastos.");
                return
            }
            //Estudiantes
            if (studentActive.length && filters.students.studentStatus.length === 0){
                setError("Escoja al menos un estado de estudiante.");
                return
            }
            if (yearsPayments.length && filters.students.years === 0){
                setError("Escoja al menos año.");
                return
            }
            //data
            const students = await getAllStudents();
            const payments = await getAllPayments();
            const expenses = await getAllExpenses();

            //pagos      
            const filteredPayments = payments?.filter(p => {
                if (
                    filters.students.years.length &&
                    !filters.students.years.includes(String(p.year,10))
                ) {
                    return false;
                }
                return true;
            });

            //estudiantes
            const filteredStudents = students.filter(s => {
                if (
                    filters.students.studentStatus.length &&
                    !filters.students.studentStatus.includes(s.active)
                ) {
                    return false;
                }
                return true;
            });

            //gastos
            const filteredExpenses = expenses.filter(e => {
                if (
                    filters.expenses.years.length &&
                    !filters.expenses.years.includes(String(new Date(e.date).getFullYear()))
                ) {
                    return false;
                }
                return true;
            })
            err = await exportHistoric({
                                        payments: filteredPayments,
                                        years: filters?.students.years,
                                        students: filteredStudents,
                                        expenses: filteredExpenses,
                                        });

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
                onClose={() => {
                    setError("");
                    setMessage("");
                    setIsModalOpen(false)
                }}
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