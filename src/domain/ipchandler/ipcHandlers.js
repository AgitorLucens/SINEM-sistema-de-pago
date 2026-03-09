import { app, ipcMain } from 'electron';

export default function setUpHandlers(dbInstance, excelInstance) {
    /*
        Pagina Pagos
    */
    ipcMain.handle('add-payment', async (_, paymentData) => {
        return dbInstance.addPayment(paymentData);
    });

    ipcMain.handle('update-payment', async (_, paymentData) => {
        return dbInstance.updatePayment(paymentData);
    });

    ipcMain.handle('add-payment-without-consecutive', async (_, paymentData) => {
        return dbInstance.addPaymentWithConsecutive(paymentData);
    });

    ipcMain.handle('get-consecutive', async (_, year) => {
        return dbInstance.getNextConsecutiveByYear(year);
    });

    ipcMain.handle('get-all-payments', async () => {
        return dbInstance.getAllPayments();
    });

    ipcMain.handle('get-payments-by-year', async (_, year) => {
        return dbInstance.getPaymentsByYear(year);
    });

    ipcMain.handle('get-year-payments', async () => {
        return dbInstance.getYearsOfPayments();
    });

    ipcMain.handle('get-consecutive-payments', async () => {
        return dbInstance.getYearsOfPayments();
    });

    ipcMain.handle('get-date-payments', async () => {
        return dbInstance.getDateOfPayments();
    });

    ipcMain.handle('get-payment-by-student-id', async (_, id) => {
        return dbInstance.getPaymentByStudentId(id);
    });

    ipcMain.handle('delete-payment-by-id', async (_, id) => {
        return dbInstance.deletePaymentById(id);
    });

    ipcMain.handle('get-payment-concepts', async () => {
        return dbInstance.getPaymentsConcepts();
    });

    ipcMain.handle('get-payment-divisions', async () => {
        return dbInstance.getPaymentsDivisions();
    });

    ipcMain.handle('get-delay-payment', async (_, year) => {
        return dbInstance.getDelayPayments(year);
    });

    ipcMain.handle('get-expected-income', async (_, data) => {
        return dbInstance.getExpectedIncome(data);
    });

    ipcMain.handle('get-payment-amount', async (_, data) => {
        const { divisionId, conceptId } = data;
        return dbInstance.getPaymentAmount(divisionId, conceptId);
    });

    /*
        Pagina Egresos
    */
    ipcMain.handle('get-all-expenses', async () => {
        return dbInstance.getAllExpenses();
    });

    ipcMain.handle('get-expenses-by-year', async (_, year) => {
        return dbInstance.getExpensesByYear(year);
    });

    ipcMain.handle('get-year-expenses', async (_) => {
        return dbInstance.getYearsOfExpenses();
    });

    ipcMain.handle('add-expense', async (_, expenseData) => {
        return dbInstance.addExpense(expenseData);
    });

    ipcMain.handle('update-expense', async (_, expenseData) => {
        return dbInstance.updateExpense(expenseData);
    });

    ipcMain.handle('delete-expense-by-id', async (_, id) => {
        return dbInstance.deleteExpenseById(id);
    });

    /*
        Pagina Estudiantes
    */
    ipcMain.handle('get-all-students', async () => {
        return dbInstance.getAllStudents();
    });

    ipcMain.handle('get-students-by-active', async (_, active) => {
        return dbInstance.getStudentsByActive(active);
    });

    ipcMain.handle('get-students-active', async () => {
        return dbInstance.getStudentsActive();
    });

    ipcMain.handle('get-students-count', async () => {
        return dbInstance.getStudentCount();
    });

    ipcMain.handle('add-student', async (_, studentsData) => {
        return dbInstance.addStudent(studentsData);
    });

    ipcMain.handle('update-student', async (_, studentsData) => {
        return dbInstance.updateStudent(studentsData);
    });

    ipcMain.handle('delete-student-by-id', async (_, id) => {
        return dbInstance.deleteStudentById(id);
    });

    /*
        Pagina Profesores
    */
    ipcMain.handle('get-all-teachers', async () => {
        return dbInstance.getAllTeachers();
    });

    ipcMain.handle('add-teacher', async (_, teacherData) => {
        return dbInstance.addTeacher(teacherData);
    });

    ipcMain.handle('delete-teacher-by-id', async (_, id) => {
        return dbInstance.deleteTeacherById(id);
    });

    ipcMain.handle('update-teacher', async (_, teacherData) => {
        return dbInstance.updateTeacher(teacherData);
    });

    /*
        Pagina Report
    */
    ipcMain.handle('get-cash-register', async () => {
        return dbInstance.getCashRegister();
    });

    /*
        Pagina Precios
    */
    ipcMain.handle('add-division', async (_, division) => {
        return dbInstance.addDivision(division);
    });

    ipcMain.handle('delete-division', async (_, id) => {
        return dbInstance.deleteDivision(id);
    });

    ipcMain.handle('update-division', async (_, data) => {
        return dbInstance.updateDivision(data.id, data.name);
    });

    ipcMain.handle('update-price-concept', async (_, concept) => {
        return dbInstance.updatePriceConcept(concept);
    });

    ipcMain.handle('update-price-division', async (_, division) => {
        return dbInstance.updatePriceDivision(division);
    });

    ipcMain.handle('get-all-division-payment-concepts', async () => {
        return dbInstance.getAllDivisionPaymentConcepts();
    });

    ipcMain.handle('update-division-payment-concept', async (_, data) => {
        return dbInstance.updateDivisionPaymentConcept(data.id, data.amount);
    });

    /*
        Excel
    */
    ipcMain.handle('export-receipt-excel', async (_, payment) => {
        return excelInstance.exportReceiptToExcel(payment);
    });

    ipcMain.handle('export-report-excel', async (_, data) => {
        const {
            payments
        } = data;
        return excelInstance.exportReportToExcel(
            payments
        );
    });

    ipcMain.handle('export-cash-register-report', async (_, data) => {
        return excelInstance.exportCashRegisterReportToExcel(data);
    });

    ipcMain.handle('export-payments-by-year', async (_, paymentData) => {
        return excelInstance.exportPaymentsByYearToExcel(paymentData);
    });

    ipcMain.handle('export-expenses-by-year', async (_, expensesData) => {
        return excelInstance.exportExpensesByYearToExcel(expensesData);
    });

    ipcMain.handle('export-students-by-active', async (_, studentData) => {
        const { students, payments, years } = studentData;
        return excelInstance.exportStudentsByActiveToExcel(students, payments, years);
    });

    ipcMain.handle('export-students-template', async () => {
        return excelInstance.exportTemplateStudents();
    });

    ipcMain.handle('export-historic', async (_, data) => {
        return excelInstance.exportHistoric(data);
    });

    ipcMain.handle('import-student-from-excel', async (_, studentsData) => {
        return excelInstance.importStudentsFromExcel(studentsData);
    });

    ipcMain.handle('import-student', async (_, studentsData) => {
        return dbInstance.importStudents(studentsData);
    });

    ipcMain.handle('export-delay-by-month-report', async (_, data) => {
        return excelInstance.exportDelayByMonthReportToExcel(data);
    });

    ipcMain.handle('export-delay-by-teacher-report', async (_, data) => {
        return excelInstance.exportDelayByTeacherReportToExcel(data);
    });

    /*
        App functionality
    */
    ipcMain.handle('add-image', async (_, imageData) => {
        return dbInstance.addImage(imageData);
    });

    ipcMain.handle('get-images', async () => {
        return dbInstance.getImages();
    });

    ipcMain.handle('set-image', async (_, imageState) => {
        return dbInstance.setImage(imageState);
    });

    ipcMain.handle('get-current-image', async () => {
        return dbInstance.getCurrentImage();
    });

    ipcMain.handle('delete-image-by-id', async (_, id) => {
        return dbInstance.deleteImageById(id);
    });

    ipcMain.handle('app:quit', async () => {
        return app.quit();
    });
}