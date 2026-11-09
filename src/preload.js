// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from './ipc/channels.js';

/*
    The renderer's ONLY bridge to the main process: window.api.
    Namespaced by domain — the namespaces mirror the layout of
    src/domain/db/repositories and src/ipc/channels.js.

    Channel strings are NEVER written here; they come from channels.js
    so preload and main cannot drift apart.
*/
const api = {
    // Pagos
    payments: {
        addPayment: (paymentData) => ipcRenderer.invoke(CHANNELS.payments.addPayment, paymentData),
        updatePayment: (paymentData) => ipcRenderer.invoke(CHANNELS.payments.updatePayment, paymentData),
        addPaymentWithConsecutive: (data) => ipcRenderer.invoke(CHANNELS.payments.addPaymentWithConsecutive, data),
        getNextConsecutiveByYear: (year) => ipcRenderer.invoke(CHANNELS.payments.getNextConsecutiveByYear, year),
        getAllPayments: () => ipcRenderer.invoke(CHANNELS.payments.getAllPayments),
        getPaymentsByYear: (year) => ipcRenderer.invoke(CHANNELS.payments.getPaymentsByYear, year),
        getYearsOfPayments: () => ipcRenderer.invoke(CHANNELS.payments.getYearsOfPayments),
        getDateOfPayments: () => ipcRenderer.invoke(CHANNELS.payments.getDateOfPayments),
        getPaymentByStudentId: (id) => ipcRenderer.invoke(CHANNELS.payments.getPaymentByStudentId, id),
        deletePaymentById: (id) => ipcRenderer.invoke(CHANNELS.payments.deletePaymentById, id),
    },

    pricing: {
        getPaymentConcepts: () => ipcRenderer.invoke(CHANNELS.pricing.getPaymentConcepts),
        getPaymentDivisions: () => ipcRenderer.invoke(CHANNELS.pricing.getPaymentDivisions),
        getPaymentAmount: (data) => ipcRenderer.invoke(CHANNELS.pricing.getPaymentAmount, data),
        addDivision: (division) => ipcRenderer.invoke(CHANNELS.pricing.addDivision, division),
        deleteDivision: (id) => ipcRenderer.invoke(CHANNELS.pricing.deleteDivision, id),
        updateDivision: (data) => ipcRenderer.invoke(CHANNELS.pricing.updateDivision, data),
        updatePriceConcept: (concept) => ipcRenderer.invoke(CHANNELS.pricing.updatePriceConcept, concept),
        updatePriceDivision: (division) => ipcRenderer.invoke(CHANNELS.pricing.updatePriceDivision, division),
        getAllDivisionPaymentConcepts: () => ipcRenderer.invoke(CHANNELS.pricing.getAllDivisionPaymentConcepts),
        updateDivisionPaymentConcept: (data) => ipcRenderer.invoke(CHANNELS.pricing.updateDivisionPaymentConcept, data),
    },

    reports: {
        getDelayPayments: (year) => ipcRenderer.invoke(CHANNELS.reports.getDelayPayments, year),
        getExpectedIncome: (data) => ipcRenderer.invoke(CHANNELS.reports.getExpectedIncome, data),
        getCashRegister: () => ipcRenderer.invoke(CHANNELS.reports.getCashRegister),
    },

    // Egresos
    expenses: {
        getAllExpenses: () => ipcRenderer.invoke(CHANNELS.expenses.getAllExpenses),
        getExpensesByYear: (year) => ipcRenderer.invoke(CHANNELS.expenses.getExpensesByYear, year),
        getYearsOfExpenses: () => ipcRenderer.invoke(CHANNELS.expenses.getYearsOfExpenses),
        addExpense: (expenseData) => ipcRenderer.invoke(CHANNELS.expenses.addExpense, expenseData),
        updateExpense: (expenseData) => ipcRenderer.invoke(CHANNELS.expenses.updateExpense, expenseData),
        deleteExpenseById: (id) => ipcRenderer.invoke(CHANNELS.expenses.deleteExpenseById, id),
    },

    // Estudiantes
    students: {
        getAllStudents: () => ipcRenderer.invoke(CHANNELS.students.getAllStudents),
        getStudentsByActive: (active) => ipcRenderer.invoke(CHANNELS.students.getStudentsByActive, active),
        getStudentsActive: () => ipcRenderer.invoke(CHANNELS.students.getStudentsActive),
        getStudentCount: () => ipcRenderer.invoke(CHANNELS.students.getStudentCount),
        addStudent: (studentData) => ipcRenderer.invoke(CHANNELS.students.addStudent, studentData),
        updateStudent: (studentData) => ipcRenderer.invoke(CHANNELS.students.updateStudent, studentData),
        deleteStudentById: (id) => ipcRenderer.invoke(CHANNELS.students.deleteStudentById, id),
        importStudents: (studentsData) => ipcRenderer.invoke(CHANNELS.students.importStudents, studentsData),
    },

    // Profesores
    teachers: {
        getAllTeachers: () => ipcRenderer.invoke(CHANNELS.teachers.getAllTeachers),
        addTeacher: (teacherData) => ipcRenderer.invoke(CHANNELS.teachers.addTeacher, teacherData),
        deleteTeacherById: (id) => ipcRenderer.invoke(CHANNELS.teachers.deleteTeacherById, id),
        updateTeacher: (teacherData) => ipcRenderer.invoke(CHANNELS.teachers.updateTeacher, teacherData),
    },

    // Excel
    excel: {
        exportReceiptToExcel: (payment) => ipcRenderer.invoke(CHANNELS.excel.exportReceiptToExcel, payment),
        exportReportToExcel: (data) => ipcRenderer.invoke(CHANNELS.excel.exportReportToExcel, data),
        exportCashRegisterReportToExcel: (data) => ipcRenderer.invoke(CHANNELS.excel.exportCashRegisterReportToExcel, data),
        exportPaymentsByYearToExcel: (paymentData) => ipcRenderer.invoke(CHANNELS.excel.exportPaymentsByYearToExcel, paymentData),
        exportExpensesByYearToExcel: (expenseData) => ipcRenderer.invoke(CHANNELS.excel.exportExpensesByYearToExcel, expenseData),
        exportStudentsByActiveToExcel: (studentData) => ipcRenderer.invoke(CHANNELS.excel.exportStudentsByActiveToExcel, studentData),
        exportTemplateStudents: () => ipcRenderer.invoke(CHANNELS.excel.exportTemplateStudents),
        exportHistoric: (data) => ipcRenderer.invoke(CHANNELS.excel.exportHistoric, data),
        exportDelayByMonthReportToExcel: (data) => ipcRenderer.invoke(CHANNELS.excel.exportDelayByMonthReportToExcel, data),
        exportDelayByTeacherReportToExcel: (data) => ipcRenderer.invoke(CHANNELS.excel.exportDelayByTeacherReportToExcel, data),
        importStudentsFromExcel: (studentsData) => ipcRenderer.invoke(CHANNELS.excel.importStudentsFromExcel, studentsData),
    },

    // App functionality
    images: {
        addImage: (imageData) => ipcRenderer.invoke(CHANNELS.images.addImage, imageData),
        getImages: () => ipcRenderer.invoke(CHANNELS.images.getImages),
        setImage: (imageState) => ipcRenderer.invoke(CHANNELS.images.setImage, imageState),
        getCurrentImage: () => ipcRenderer.invoke(CHANNELS.images.getCurrentImage),
        deleteImageById: (id) => ipcRenderer.invoke(CHANNELS.images.deleteImageById, id),
    },

    app: {
        quitApp: () => ipcRenderer.invoke(CHANNELS.app.quitApp),
    },
}

contextBridge.exposeInMainWorld('api', api);
