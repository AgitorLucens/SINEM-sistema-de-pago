import {ipcMain} from 'electron';
import {exportPaymentsToExcel,exportPaymentsByYearToExcel,exportExpensesByYearToExcel,
        exportStudentsByActiveToExcel} from "../excel/excel.js"

export default function setUpHandlers(dbInstance) {
    /*
        Pagina Pagos
    */
    ipcMain.handle('add-payment', async ( _ , paymentData) => {
        return dbInstance.addPayment(paymentData);
    });

    ipcMain.handle('get-all-payments', async () => {
        return dbInstance.getAllPayments();
    });

    ipcMain.handle('get-payments-by-year', async ( _ , year) => {
        return dbInstance.getPaymentsByYear(year);
    });

    ipcMain.handle('get-year-payments', async () => {
        return dbInstance.getYearsOfPayments();
    });

    ipcMain.handle('get-payment-by-id', async ( _ , id) => {
        return dbInstance.getPaymentById(id);
    });

    ipcMain.handle('delete-payment', async ( _ , id) => {
        return dbInstance.deletePayment(id);
    });

    ipcMain.handle('get-payment-concepts', async ( ) => {
        return dbInstance.getPaymentsConcepts();
    });

    ipcMain.handle('get-payment-divisions', async ( ) => {
        return dbInstance.getPaymentsDivisions();
    });

    /*
        Pagina Egresos
    */
    ipcMain.handle('get-all-expenses', async ( ) => {
        return dbInstance.getAllExpenses();
    });

    ipcMain.handle('get-expenses-by-year', async ( _ , year) => {
        return dbInstance.getExpensesByYear(year);
    });

    ipcMain.handle('get-year-expenses', async ( _ ) => {
        return dbInstance.getYearsOfExpenses();
    });
    
    ipcMain.handle('add-expense', async ( _ , expenseData) => {
        return dbInstance.addExpense(expenseData);
    });

    /*
        Pagina Estudiantes
    */
    ipcMain.handle('get-all-students', async ( ) => {
        return dbInstance.getAllStudents();
    });

    ipcMain.handle('get-students-by-active', async ( _ , active) => {
        return dbInstance.getStudentsByActive(active);
    });

    ipcMain.handle('get-students-active', async ( ) => {
        return dbInstance.getStudentsActive();
    });
    
    ipcMain.handle('add-student', async ( _ , studentsData) => {
        return dbInstance.addStudent(studentsData);
    });

    /*
        Pagina Precios
    */
    ipcMain.handle('update-price-concept', async ( _ , concept) => {
        return dbInstance.updatePriceConcept(concept);
    });

    /*
        Excel
    */
   ipcMain.handle('export-payment-excel', async ( _ , paymentData) => {
        return exportPaymentsToExcel(paymentData);
    });

    ipcMain.handle('export-payments-by-year', async ( _ , paymentData) => {
        return exportPaymentsByYearToExcel(paymentData);
    });

    ipcMain.handle('export-expenses-by-year', async ( _ , expensesData) => {
        return exportExpensesByYearToExcel(expensesData);
    });

    ipcMain.handle('export-students-by-active', async ( _ , studentData) => {
        return exportStudentsByActiveToExcel(studentData);
    });
}