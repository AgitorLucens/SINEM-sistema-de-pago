// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

const api = {
    // Pagina Pagos
    addPayment: (paymentData) => ipcRenderer.invoke('add-payment', paymentData),
    updatePayment: (paymentData) => ipcRenderer.invoke('update-payment', paymentData),
    addPaymentWithConsecutive: (data) => ipcRenderer.invoke('add-payment-without-consecutive', data),
    getNextConsecutiveByYear: (year) => ipcRenderer.invoke('get-consecutive', year),
    getAllPayments: () => ipcRenderer.invoke('get-all-payments'),
    getPaymentsByYear: (year) => ipcRenderer.invoke('get-payments-by-year', year),
    getYearsOfPayments: () => ipcRenderer.invoke('get-year-payments'),
    getDateOfPayments: () => ipcRenderer.invoke('get-date-payments'),
    getPaymentByStudentId: (id) => ipcRenderer.invoke('get-payment-by-student-id', id),
    deletePaymentById: (id) => ipcRenderer.invoke('delete-payment-by-id', id),
    getPaymentConcepts: () => ipcRenderer.invoke('get-payment-concepts'),
    getPaymentDivisions: () => ipcRenderer.invoke('get-payment-divisions'),

    // Pagina Egresos
    getAllExpenses: () => ipcRenderer.invoke('get-all-expenses'),
    getExpensesByYear: (year) => ipcRenderer.invoke('get-expenses-by-year', year),
    getYearsOfExpenses: () => ipcRenderer.invoke('get-year-expenses'),
    addExpense: (expenseData) => ipcRenderer.invoke('add-expense', expenseData),
    updateExpense: (expenseData) => ipcRenderer.invoke('update-expense', expenseData),
    deleteExpenseById: (id) => ipcRenderer.invoke('delete-expense-by-id', id),

    // Pagina Estudiantes
    getAllStudents: () => ipcRenderer.invoke('get-all-students'),
    getStudentsByActive: (active) => ipcRenderer.invoke('get-students-by-active', active),
    getStudentsActive: () => ipcRenderer.invoke('get-students-active'),
    addStudent: (studentData) => ipcRenderer.invoke('add-student', studentData),
    updateStudent: (studentData) => ipcRenderer.invoke('update-student', studentData),
    getPaymentById: (paymentId) => ipcRenderer.invoke('get-payment-by-id', paymentId),
    deleteStudentById: (id) => ipcRenderer.invoke('delete-student-by-id', id),

    // Pagina Precios
    updatePriceConcept: (concept) => ipcRenderer.invoke('update-price-concept', concept),

    // Excel
    exportReceiptToExcel: (payment) => ipcRenderer.invoke('export-receipt-excel', payment),
    exportReportToExcel: (data) => ipcRenderer.invoke('export-report-excel', data),
        
    exportPaymentsByYearToExcel: (paymentData) => ipcRenderer.invoke('export-payments-by-year', paymentData),
    exportExpensesByYearToExcel: (expenseData) => ipcRenderer.invoke('export-expenses-by-year', expenseData),
    exportStudentsByActiveToExcel: (studentData) => ipcRenderer.invoke('export-students-by-active', studentData),
    exportHistoric: (data) => ipcRenderer.invoke('export-historic', data),
    // App functionality
    quitApp: () => ipcRenderer.invoke("app:quit"),
}

contextBridge.exposeInMainWorld('api', api);