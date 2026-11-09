/*
    Single source of truth for every IPC channel name.

    The preload script (renderer side) and the IPC registrars (main
    side) BOTH import from this module, so a channel name can never
    drift between the two processes — a typo here fails at startup
    wiring, not silently at runtime.

    Convention: '<namespace>:<action>'.
    The keys inside each namespace mirror the window.api method names
    exposed by preload.js.

    Adding a new operation:
      1. repository method (src/domain/db/repositories/*.js)
      2. one handle() line in the matching registrar file
      3. one entry here
      4. one wrapper in src/ui/constant/DBFunctions.jsx
*/
export const CHANNELS = {
    payments: {
        addPayment: 'payments:add',
        updatePayment: 'payments:update',
        addPaymentWithConsecutive: 'payments:add-with-consecutive',
        getNextConsecutiveByYear: 'payments:next-consecutive',
        getAllPayments: 'payments:get-all',
        getPaymentsByYear: 'payments:get-by-year',
        getYearsOfPayments: 'payments:get-years',
        getDateOfPayments: 'payments:get-dates',
        getPaymentByStudentId: 'payments:get-by-student-id',
        deletePaymentById: 'payments:delete-by-id',
    },
    pricing: {
        getPaymentConcepts: 'pricing:get-concepts',
        getPaymentDivisions: 'pricing:get-divisions',
        getPaymentAmount: 'pricing:get-amount',
        addDivision: 'pricing:add-division',
        deleteDivision: 'pricing:delete-division',
        updateDivision: 'pricing:update-division',
        updatePriceConcept: 'pricing:update-price-concept',
        updatePriceDivision: 'pricing:update-price-division',
        getAllDivisionPaymentConcepts: 'pricing:get-division-payment-concepts',
        updateDivisionPaymentConcept: 'pricing:update-division-payment-concept',
    },
    reports: {
        getDelayPayments: 'reports:get-delay',
        getExpectedIncome: 'reports:get-expected-income',
        getCashRegister: 'reports:get-cash-register',
    },
    expenses: {
        getAllExpenses: 'expenses:get-all',
        getExpensesByYear: 'expenses:get-by-year',
        getYearsOfExpenses: 'expenses:get-years',
        addExpense: 'expenses:add',
        updateExpense: 'expenses:update',
        deleteExpenseById: 'expenses:delete-by-id',
    },
    students: {
        getAllStudents: 'students:get-all',
        getStudentsByActive: 'students:get-by-active',
        getStudentsActive: 'students:get-active-flags',
        getStudentCount: 'students:get-count',
        addStudent: 'students:add',
        updateStudent: 'students:update',
        deleteStudentById: 'students:delete-by-id',
        importStudents: 'students:import',
    },
    teachers: {
        getAllTeachers: 'teachers:get-all',
        addTeacher: 'teachers:add',
        deleteTeacherById: 'teachers:delete-by-id',
        updateTeacher: 'teachers:update',
    },
    excel: {
        exportReceiptToExcel: 'excel:export-receipt',
        exportReportToExcel: 'excel:export-report',
        exportCashRegisterReportToExcel: 'excel:export-cash-register-report',
        exportPaymentsByYearToExcel: 'excel:export-payments-by-year',
        exportExpensesByYearToExcel: 'excel:export-expenses-by-year',
        exportStudentsByActiveToExcel: 'excel:export-students-by-active',
        exportTemplateStudents: 'excel:export-students-template',
        exportHistoric: 'excel:export-historic',
        exportDelayByMonthReportToExcel: 'excel:export-delay-by-month-report',
        exportDelayByTeacherReportToExcel: 'excel:export-delay-by-teacher-report',
        importStudentsFromExcel: 'excel:import-students-from-excel',
    },
    images: {
        addImage: 'images:add',
        getImages: 'images:get-all',
        setImage: 'images:set-current',
        getCurrentImage: 'images:get-current',
        deleteImageById: 'images:delete-by-id',
    },
    app: {
        quitApp: 'app:quit',
    },
};
