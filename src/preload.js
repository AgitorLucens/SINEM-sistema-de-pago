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
    getDelayPayments: (year) => ipcRenderer.invoke('get-delay-payment', year),

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
    getStudentCount: () => ipcRenderer.invoke('get-students-count'),
    addStudent: (studentData) => ipcRenderer.invoke('add-student', studentData),
    updateStudent: (studentData) => ipcRenderer.invoke('update-student', studentData),
    getPaymentById: (paymentId) => ipcRenderer.invoke('get-payment-by-id', paymentId),
    deleteStudentById: (id) => ipcRenderer.invoke('delete-student-by-id', id),

    // Pagina Profesores
    getAllTeachers: () => ipcRenderer.invoke('get-all-teachers'),
    addTeacher: (teacherData) => ipcRenderer.invoke('add-teacher', teacherData),
    deleteTeacherById: (id) => ipcRenderer.invoke('delete-teacher-by-id', id),
    updateTeacher: (teacherData) => ipcRenderer.invoke('update-teacher', teacherData),

    // Pagina Precios
    addDivision: (division) => ipcRenderer.invoke('add-division', division),
    deleteDivision: (id) => ipcRenderer.invoke('delete-division', id),
    updateDivision: (data) => ipcRenderer.invoke('update-division', data),
    updatePriceConcept: (concept) => ipcRenderer.invoke('update-price-concept', concept),
    updatePriceDivision: (division) => ipcRenderer.invoke('update-price-division', division),
    getAllDivisionPaymentConcepts: () => ipcRenderer.invoke('get-all-division-payment-concepts'),
    updateDivisionPaymentConcept: (data) => ipcRenderer.invoke('update-division-payment-concept', data),
    getPaymentAmount: (data) => ipcRenderer.invoke('get-payment-amount', data),

    // Pagina Reporte
    getCashRegister: () => ipcRenderer.invoke('get-cash-register'),
    getExpectedIncome: (data) => ipcRenderer.invoke('get-expected-income',data),

    // Excel
    exportReceiptToExcel: (payment) => ipcRenderer.invoke('export-receipt-excel', payment),
    exportReportToExcel: (data) => ipcRenderer.invoke('export-report-excel', data),     
    exportPaymentsByYearToExcel: (paymentData) => ipcRenderer.invoke('export-payments-by-year', paymentData),
    exportExpensesByYearToExcel: (expenseData) => ipcRenderer.invoke('export-expenses-by-year', expenseData),
    exportStudentsByActiveToExcel: (studentData) => ipcRenderer.invoke('export-students-by-active', studentData),
    exportTemplateStudents: () => ipcRenderer.invoke('export-students-template'),
    exportHistoric: (data) => ipcRenderer.invoke('export-historic', data),
    exportCashRegisterReportToExcel: (data) => ipcRenderer.invoke('export-cash-register-report', data),
    exportDelayByMonthReportToExcel: (data) => ipcRenderer.invoke('export-delay-by-month-report', data),
    exportDelayByTeacherReportToExcel: (data) => ipcRenderer.invoke('export-delay-by-teacher-report', data),

    importStudentsFromExcel: (studentsData) => ipcRenderer.invoke('import-student-from-excel', studentsData),
    importStudents: (studentsData) => ipcRenderer.invoke('import-student', studentsData),
    
    // App functionality
    addImage: (imageData) => ipcRenderer.invoke('add-image', imageData),
    getImages: () => ipcRenderer.invoke('get-images'),
    setImage: (imageState) => ipcRenderer.invoke('set-image', imageState),
    getCurrentImage: () => ipcRenderer.invoke('get-current-image'),
    deleteImageById: (id) => ipcRenderer.invoke('delete-image-by-id', id),
    quitApp: () => ipcRenderer.invoke("app:quit"),
}

contextBridge.exposeInMainWorld('api', api);