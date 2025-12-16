import {ipcMain} from 'electron';
import exportPaymentsToExcel from "../excel/excel.js"

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
    
    ipcMain.handle('add-expense', async ( _ , expenseData) => {
        return exportPaymentsToExcel(expenseData);
    });

    /*
        Pagina Estudiantes
    */
    ipcMain.handle('get-all-students', async ( ) => {
        return dbInstance.getAllStudents();
    });
    
    ipcMain.handle('add-student', async ( _ , studentsData) => {
        return dbInstance.addStudent(studentsData);
    });

    /*
        Excel
    */
   ipcMain.handle('export-payment-excel', async ( _ , paymentData) => {
        return exportPaymentsToExcel(paymentData);
    });
}