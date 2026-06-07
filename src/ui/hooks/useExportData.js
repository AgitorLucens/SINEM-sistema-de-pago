import { useState, useCallback, useEffect, useMemo } from "react";
import {
    getYearsOfPayments, getYearsOfExpenses, getStudentsActive,
    getAllPayments, getAllExpenses, getAllStudents,
    getPaymentDivisions, getPaymentConcepts,
    exportPaymentsByYearToExcel, exportExpensesByYearToExcel,
    exportStudentsByActiveToExcel, exportHistoric,
} from "../constant/DBFunctions.jsx";

const methodsOptions = [
    { value: 0, label: "Efectivo" },
    { value: 1, label: "Transferencia" },
];

const initialFilters = {
    payments: { years: [], divisions: [], concepts: [], methods: [] },
    expenses: { years: [] },
    students: { years: [], studentStatus: [] },
        all: {
            payments: { years: [], divisions: [], concepts: [], methods: [] },
            expenses: { years: [] },
            students: { years: [], studentStatus: [], concepts: [], divisions: [], methods: [] },
        },
};

export const EXPORT_FILTERS = {
  Pagos: { years: true, concepts: true, methods: true, divisions: true, studentStatus: false },
  Gastos: { years: true, concepts: false, methods: false, divisions: false, studentStatus: false },
  Estudiantes: { years: true, concepts: false, methods: false, divisions: false, studentStatus: true },
  Todo: { years: true, concepts: true, methods: true, divisions: true, studentStatus: true },
};

export const METHODS_OPTIONS = methodsOptions;

export function useExportData() {
    const [yearsPayments, setYearsPayments] = useState([]);
    const [yearsExpenses, setYearsExpenses] = useState([]);
    const [studentActive, setStudentActive] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [concepts, setConcepts] = useState([]);
    const [filterInitialized, setFilterInitialized] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectData, setSelectData] = useState(null);

  const exportOptions = useMemo(() => ({
    yearPayments: (yearsPayments ?? []).map(y => ({ value: y.year, label: y.year })),
    yearExpenses: (yearsExpenses ?? []).map(y => ({ value: y.year, label: y.year })),
    concepts: concepts.map(c => ({ value: Number(c.id), label: c.name })),
    divisions: divisions.map(d => ({ value: Number(d.id), label: d.name })),
    methods: methodsOptions.map(m => ({ value: m.value, label: m.label })),
    studentStatus: studentActive.map(s => ({
      value: Number(s.active),
      label: s.active === 1 ? "Activo" : "Inactivo",
    })),
  }), [yearsPayments, yearsExpenses, concepts, divisions, studentActive]);

  const exportData = useMemo(() => {
    if (selectedType === "Pagos" || selectedType === "Estudiantes") return yearsPayments;
    if (selectedType === "Gastos") return yearsExpenses;
    return [];
  }, [selectedType, yearsPayments, yearsExpenses]);

    const fetchData = useCallback(async () => {
        try {
            const [fetchedYearPayments, fetchedYearExpenses, fetchedActiveStudents, fetchedDivisions, fetchedConcepts] =
                await Promise.all([
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
        } catch (e) {
            console.error("Error al cargar datos a exportar:", e);
            setError("Error al cargar datos desde la base de datos local: " + e.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (filterInitialized) return;

        const ready = concepts.length > 0 && divisions.length > 0 && studentActive.length > 0;
        if (!ready) return;

        const expenseYears = yearsExpenses?.map(y => y.year) ?? [];
        const paymentYears = yearsPayments?.map(y => y.year) ?? [];

        setFilters(prev => ({
            ...prev,
            payments: {
                ...prev.payments,
                years: Array.isArray(paymentYears) ? paymentYears : [],
                concepts: concepts.map(c => Number(c.id)),
                divisions: divisions.map(d => Number(d.id)),
                methods: methodsOptions.map(m => m.value),
            },
            students: {
                ...prev.students,
                years: Array.isArray(paymentYears) ? paymentYears : [],
                studentStatus: studentActive.map(s => Number(s.active)),
            },
            expenses: {
                ...prev.expenses,
                years: expenseYears,
            },
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
                },
            },
        }));

        setFilterInitialized(true);
    }, [concepts, divisions, studentActive, filterInitialized, yearsPayments, yearsExpenses]);

    const openExportModal = useCallback((type) => {
        setSelectedType(type);
        setIsModalOpen(true);
    }, []);

    const closeExportModal = useCallback(() => {
        setError("");
        setMessage("");
        setIsModalOpen(false);
    }, []);

    const handleExport = useCallback(async () => {
        let err;
        if (selectedType === "Pagos") {
            if (filters.payments.concepts.length === 0) {
                setError("Escoja al menos un concepto de pago."); return;
            }
            if (filters.payments.divisions.length === 0) {
                setError("Escoja al menos un curso."); return;
            }
            if (filters.payments.methods.length === 0) {
                setError("Escoja al menos un metodo de pago."); return;
            }
            if (filters.payments.years.length === 0) {
                setError("Escoja al menos un año."); return;
            }

            const payments = await getAllPayments();
            const filteredPayments = payments.filter(p => {
                const valueM = methodsOptions.find(m => m.label === p.payment_method)?.value;
                if (filters.payments.years.length && !filters.payments.years.includes(String(p.year))) return false;
                if (filters.payments.divisions.length && !filters.payments.divisions.includes(p.division_id)) return false;
                if (filters.payments.concepts.length && !filters.payments.concepts.includes(p.concept_id)) return false;
                if (filters.payments.methods.length && !filters.payments.methods.includes(valueM)) return false;
                return true;
            });
            err = await exportPaymentsByYearToExcel({
                paymentsFiltered: filteredPayments,
                name: `Ingresos${filters.payments.years?.length === yearsPayments?.length ? " Historico" : ""}`,
            });
        } else if (selectedType === "Gastos") {
            if (!filters.expenses.years || filters.expenses.years.length === 0) {
                setError("Escoja al menos un año para los gastos"); return;
            }
            const expenses = await getAllExpenses();
            const filteredExpenses = expenses.filter(e => {
                if (filters.expenses.years.length && !filters.expenses.years.includes(String(new Date(e.date).getFullYear()))) return false;
                return true;
            });
            err = await exportExpensesByYearToExcel(filteredExpenses);
        } else if (selectedType === "Estudiantes") {
    if (!filters.students.studentStatus || filters.students.studentStatus.length === 0) {
      setError("Escoja al menos un estado de estudiante."); return;
    }
    if (!filters.students.years || filters.students.years.length === 0) {
      setError("Escoja al menos un año."); return;
    }
            const students = await getAllStudents();
            const payments = await getAllPayments();
            const filteredStudents = students.filter(s => {
                if (filters.students.studentStatus.length && !filters.students.studentStatus.includes(s.active)) return false;
                return true;
            });
            const filteredPayments = payments.filter(p => {
                if (filters.students.years.length && !filters.students.years.includes(String(p.year, 10))) return false;
                return true;
            });
            err = await exportStudentsByActiveToExcel({
                students: filteredStudents,
                payments: filteredPayments,
                years: filters.students.years,
            });
  } else if (selectedType === "Todo") {
    if (yearsPayments.length > 0 && filters.all.payments.concepts.length === 0) {
      setError("Escoja al menos un concepto de pago."); return;
    }
    if (yearsPayments.length > 0 && filters.all.payments.divisions.length === 0) {
      setError("Escoja al menos un curso."); return;
    }
    if (yearsPayments.length > 0 && filters.all.payments.methods.length === 0) {
      setError("Escoja al menos un metodo de pago."); return;
    }
    if (yearsPayments.length > 0 && filters.all.payments.years.length === 0) {
      setError("Escoja al menos un año para pagos."); return;
    }
    if (yearsExpenses.length > 0 && filters.all.expenses.years.length === 0) {
      setError("Escoja al menos un año para los gastos."); return;
    }
    if (studentActive.length && filters.all.students.studentStatus.length === 0) {
      setError("Escoja al menos un estado de estudiante."); return;
    }
    if (yearsPayments.length && filters.all.students.years.length === 0) {
      setError("Escoja al menos año."); return;
    }

    const students = await getAllStudents();
    const payments = await getAllPayments();
    const expenses = await getAllExpenses();

    const filteredPayments = payments?.filter(p => {
      if (filters.all.payments.years.length && !filters.all.payments.years.includes(String(p.year, 10))) return false;
      if (filters.all.payments.divisions.length && !filters.all.payments.divisions.includes(p.division_id)) return false;
      if (filters.all.payments.concepts.length && !filters.all.payments.concepts.includes(p.concept_id)) return false;
      if (filters.all.payments.methods.length) {
        const valueM = methodsOptions.find(m => m.label === p.payment_method)?.value;
        if (!filters.all.payments.methods.includes(valueM)) return false;
      }
      return true;
    });
    const filteredStudents = students.filter(s => {
      if (filters.all.students.studentStatus.length && !filters.all.students.studentStatus.includes(s.active)) return false;
      return true;
    });
    const filteredExpenses = expenses.filter(e => {
      if (filters.all.expenses.years.length && !filters.all.expenses.years.includes(String(new Date(e.date).getFullYear()))) return false;
      return true;
    });
    err = await exportHistoric({
      payments: filteredPayments,
      years: filters?.all.students.years,
      students: filteredStudents,
      expenses: filteredExpenses,
    });
        }

        if (!err?.success) {
            setError(err?.error || "Error al exportar.");
            return;
        }
        setIsModalOpen(false);
    }, [selectedType, filters, yearsPayments, yearsExpenses, studentActive]);

  return {
    yearsPayments, yearsExpenses, studentActive, divisions, concepts,
    filters, setFilters,
    error, setError, message, setMessage,
    isModalOpen, setIsModalOpen,
    selectedType, setSelectedType,
    selectData, setSelectData,
    exportOptions, exportData,
    openExportModal, closeExportModal, handleExport,
  };
}
