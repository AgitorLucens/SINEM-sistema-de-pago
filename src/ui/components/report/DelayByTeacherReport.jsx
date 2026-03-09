import { useState, useEffect, useMemo } from 'react';
import { DownloadIcon, InfoCircledIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { getAllTeachers, getAllStudents, getAllPayments, getYearsOfPayments } from '../../constant/DBFunctions.jsx';
import SelectRadix from '../generic/select/SelectRadix.jsx';
import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix.jsx";
import { formatMonth } from '../generic/function/Function.jsx';
import { exportDelayByTeacherReportToExcel } from '../../constant/DBFunctions.jsx';
import './delaybyteacherreport.css';

const DelayByTeacherReport = ({ onBack }) => {

    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('1'); // Default to January
    const [yearsPayments, setYearsPayments] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);

    // Month options for the dropdown (all 12 months)
    const monthOptions = useMemo(() => {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return monthNames.map((name, index) => ({
            value: index + 1,
            label: name
        }));
    }, []);

    const report = useMemo(() => {
        // Create a map of division_id to teacher name
        const divisionToTeacher = {};
        teachers.forEach(t => {
            if (t.division_id) {
                divisionToTeacher[t.division_id] = t.name;
            }
        });

        // Normalize selectedYears to numbers for consistent comparison
        const selectedYearsNum = selectedYears.map(y => Number(y));
        const selectedMonthNum = Number(selectedMonth);

        // Track unique students per teacher (based on their payments)
        const teacherStudents = {};
        const teacherPayments = {};

        payments.forEach(p => {
            const teacherName = divisionToTeacher[p.division_id];

            if (teacherName) {
                // Initialize teacher data if not exists
                if (!teacherStudents[teacherName]) {
                    teacherStudents[teacherName] = new Set();
                    teacherPayments[teacherName] = new Set();
                }

                // Only count students enrolled in the selected year(s)
                if (p.concept_type === "Mensualidad" && selectedYearsNum.includes(Number(p.year))) {
                    teacherStudents[teacherName].add(p.student_id);

                    // Check if they paid for the selected month
                    if (Number(p.month) === selectedMonthNum) {
                        teacherPayments[teacherName].add(p.student_id);
                    }
                }
            }
        });

        // Build the report array
        return Object.keys(teacherStudents).map(teacherName => {
            const totalStudents = teacherStudents[teacherName].size;
            const paidStudents = teacherPayments[teacherName].size;
            const unpaidStudents = totalStudents - paidStudents;
            const percentage = totalStudents > 0 ? ((paidStudents / totalStudents) * 100).toFixed(2) : '0.00';

            return {
                profesor: teacherName,
                matriculados: totalStudents,
                pagaronEnero: paidStudents,
                noPagaronEnero: unpaidStudents,
                porcentaje: percentage
            };
        });
    }, [payments, teachers, selectedMonth, selectedYears]);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const [teachers, students, payments, years] = await Promise.all([
                    getAllTeachers(),
                    getAllStudents(),
                    getAllPayments(),
                    getYearsOfPayments()
                ]);
                setTeachers(teachers);
                setStudents(students);
                setPayments(payments);
                setYearsPayments(years);
                // Initialize with all years selected by default
                setSelectedYears(years?.map(y => y.year) || []);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        };

        fetchTeacherData();
    }, []);

    const handleExport = async () => {
        const result = await exportDelayByTeacherReportToExcel({
            teachers: teachers,
            students: students,
            payments: payments,
            selectedMonth: selectedMonth
        });
        if (result.success) {
            console.log("Export successful");
        } else {
            console.error("Export failed");
        }
    };

    return (
        <div className="delay-teacher-report-container">
            <div className="header-income-report">
                <div className="header-income-report-title">
                    <button
                        onClick={onBack}
                        className="btn-back-report"
                        title="Volver a selección de reportes"
                    >
                        <ChevronLeftIcon />
                        Volver
                    </button>
                    <h1>Reporte de Morosidad por Profesor</h1>
                </div>
                <div className="download-button">
                    <button
                        onClick={() => handleExport()}
                        disabled={payments.length === 0 ? true : false}
                        className={`btn btn-primary${payments.length === 0 ? " export-card--disabled" : "-export"}`}
                    >
                        {payments.length === 0 ? <InfoCircledIcon /> : <DownloadIcon />}
                        {payments.length === 0 ? "Agregue Ingreso" : "Descargar Excel"}
                    </button>
                </div>
            </div>
            <div className="filter-section">
                <SelectRadix
                    label="Filtrar por mes:"
                    options={monthOptions}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="Seleccionar mes"
                />
                <div>
                    <label htmlFor="">
                        Seleccionar años
                    </label>
                    <MultiSelectRadix
                        options={yearsPayments?.map(y => ({ value: y.year, label: y.year }))}
                        value={selectedYears}
                        allSelectedText="Todos los años"
                        onChange={(years) => {
                            if (years?.length < 1) return;
                            setSelectedYears(years);
                        }}
                        placeholder="Escoger Años"
                    />
                </div>

            </div>
            <div className="report-content">
                <div className="teacher-table-wrapper">
                    <table className="teacher-report-table">
                        <thead>
                            <tr>
                                <th>NOMBRE DEL PROFESOR</th>
                                <th className="text-center">MATRICULADOS</th>
                                <th className="text-center">PAGARON {formatMonth(selectedMonth)}</th>
                                <th className="text-center">NO PAGARON {formatMonth(selectedMonth)}</th>
                                <th className="text-center">% CUMPLIMIENTO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((r) => (
                                <tr key={r.profesor}>
                                    <td className="teacher-name">{r.profesor}</td>
                                    <td className="text-center number-cell">{r.matriculados}</td>
                                    <td className="text-center number-cell">{r.pagaronEnero}</td>
                                    <td className="text-center number-cell text-muted">{r.noPagaronEnero}</td>
                                    <td className="text-center compliance-cell">{r.porcentaje}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DelayByTeacherReport;
