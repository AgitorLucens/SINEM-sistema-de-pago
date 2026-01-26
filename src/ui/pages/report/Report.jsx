import ReportFilters from "../../components/report/ReportFilters.jsx";
import ReportTable from "../../components/report/ReportTable.jsx";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPaymentConcepts, getPaymentDivisions, getAllPayments,
        getDateOfPayments, exportReportToExcel
        } from "../../constant/DBFunctions.jsx";
import { DownloadIcon, InfoCircledIcon } from "@radix-ui/react-icons";

import './report.css';
const Report = () =>{
    const [error, setError] = useState("");
    const [payments, setPayments] = useState([]);
    // Listados para filtros
    const [dates, setDates] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const allMethods = [
           { label: "Efectivo", value: "Efectivo"} , 
           { label: "Transferencia", value: "Transferencia" }        
        ];

    // Estados
    const [selectedDate, setSelectedDate] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedMethods, setSelectedMethods] = useState(allMethods);

    
    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        return d.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replaceAll('/', '-');
    };

    const handleExportReport = async () => {
        
        if (!payments || payments.length === 0) {
            setError("No hay Ingresos registrados")
            setTimeout(() => setError(""), 4000);
            return
        } 

        const err = await exportReportToExcel({
            payments: payments
        });

        if (!err.sucess) {
            setError(err.error);
        }
    };

    // Lógica de filtrado
    const matrixData = useMemo(() => {
        const filteredByDate =
            selectedDate.length === 0
                ? payments
                : payments.filter(p => selectedDate.includes(formatDate(p.date)));

        const totals = {};

        selectedMethods.forEach(method => {
            totals[method.value] = {};

            selectedCourses.forEach(course => {
                totals[method.value][course.id] = filteredByDate
                .filter(
                    p =>
                        p.payment_method === method.value &&
                        p.division_name === course.name
                )
                .reduce((acc, curr) => acc + curr.amount, 0);
            });
        });

    return totals;
    }, [payments, selectedDate, selectedCourses, selectedMethods]);


    const columnTotals = useMemo(() => {
        const totals = {};
        selectedCourses.forEach(course => {
            totals[course.id] = selectedMethods.reduce(
                (acc, method) =>
                    acc + (matrixData[method.value]?.[course.id] || 0),0);
        });
        return totals;
    }, [matrixData, selectedCourses, selectedMethods]);

    
    const totalGeneral = Object.values(columnTotals).reduce((a, b) => a + b, 0);

    const toggleItemById = (item, list, setList) => {
        setList(prev =>
            prev.some(i => i.id === item.id)
            ? prev.filter(i => i.id !== item.id)
            : [...prev, item]
        );
    };

    const toggleItem = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const toggleMethod = (method) => {
        setSelectedMethods(prev =>
            prev.some(m => m.value === method.value)
            ? prev.filter(m => m.value !== method.value)
            : [...prev, method]
        );
    };


    useEffect(() => {
            const loadMetadata = async () => {
                //setIsConceptsLoading(true);
                //setIsDivisionsLoading(true); 
                try {
                    const [fetchedDivisions, fetchedPayments,fetchedDates] = await Promise.all([
                        getPaymentDivisions(),
                        getAllPayments(),
                        getDateOfPayments(),
                    ]);
    
                    setDivisions(Array.isArray(fetchedDivisions) ? fetchedDivisions : []);
                    setPayments(Array.isArray(fetchedPayments) ? fetchedPayments : []);
                    setDates(Array.isArray(fetchedDates) ? fetchedDates : []);
                    //console.log(JSON.stringify(fetchedPayments));
                    //console.log(JSON.stringify(fetchedDates));
                } catch (err) {
                    console.error("Error al cargar metadata:", err);
                    setError("No se pudieron cargar los conceptos/cursos de pago.");
                } finally {
                    //setIsConceptsLoading(false);
                    //setIsDivisionsLoading(false); 
                }
            };
    
            loadMetadata();
            
            //fetchPayments();
    }, [] );

    useEffect( () =>{
        if (divisions.length > 0 && selectedCourses.length === 0) {
            setSelectedCourses(divisions);
        }
    }, [divisions]);

    useEffect( ()=> {
        if (dates.length > 0 && selectedDate.length === 0) {
            setSelectedDate(dates.map(d => d.date_only));
        }
    }, [dates]);

    return(
        <div className="container-report">
            <div className="header-report">
                <div className="header">
                    <h1>Reporte de Ingresos</h1>
                    {/*<p>Visualización matricial de ingresos recaudados.</p>*/}
                </div>
                <div className="downlaod-button">
                    <button 
                        onClick={()=>handleExportReport()}
                        disabled={payments.length === 0 ? true : false}
                        className={`btn btn-primary${payments.length === 0 ? " export-card--disabled" : "-export"}`}
                        >
                        {payments.length === 0 ? <InfoCircledIcon/> : <DownloadIcon/>}
                       {payments.length === 0 ? "Agregue Ingreso" : "Descargar Excel"}
                    </button>
                </div>

            </div>
            <ReportFilters
                toggleItem={toggleMethod}
                toggleItemById={toggleItemById}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                selectedMethods={selectedMethods}
                setSelectedMethods={setSelectedMethods}
                uniqueDates={dates}
                allCourses={divisions}
                allMethods={allMethods}
            />
            <ReportTable
                totalGeneral={totalGeneral}
                selectedCourses={selectedCourses}
                selectedMethods={selectedMethods}
                matrixData={matrixData}
                columnTotals={columnTotals}
            />
        </div>
    )
};

export default Report;