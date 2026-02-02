import {app,ipcMain} from 'electron';
import {exportReceiptToExcel,exportPaymentsByYearToExcel,exportExpensesByYearToExcel,
        exportStudentsByActiveToExcel, exportReportToExcel, exportHistoric,
        importStudentsFromExcel } from "../excel/excel.js"

export default function setUpHandlers(dbInstance) {
    /*
        Pagina Pagos
    */
    ipcMain.handle('add-payment', async ( _ , paymentData) => {
        return dbInstance.addPayment(paymentData);
    });

    ipcMain.handle('update-payment', async ( _ , paymentData) => {
        return dbInstance.updatePayment(paymentData);
    });

    ipcMain.handle('add-payment-without-consecutive', async ( _ , paymentData) => {
        return dbInstance.addPaymentWithConsecutive(paymentData);
    });

    ipcMain.handle('get-consecutive', async ( _ , year) => {
        return dbInstance.getNextConsecutiveByYear(year);
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

    ipcMain.handle('get-consecutive-payments', async () => {
        return dbInstance.getYearsOfPayments();
    });

    ipcMain.handle('get-date-payments', async () => {
        return dbInstance.getDateOfPayments();
    });

    ipcMain.handle('get-payment-by-student-id', async ( _ , id) => {
        return dbInstance.getPaymentByStudentId(id);
    });

    ipcMain.handle('delete-payment-by-id', async ( _ , id) => {
        return dbInstance.deletePaymentById(id);
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

    ipcMain.handle('update-expense', async ( _ , expenseData) => {
        return dbInstance.updateExpense(expenseData);
    });

    ipcMain.handle('delete-expense-by-id', async ( _ , id) => {
        return dbInstance.deleteExpenseById(id);
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

    ipcMain.handle('update-student', async ( _ , studentsData) => {
        return dbInstance.updateStudent(studentsData);
    });

    ipcMain.handle('delete-student-by-id', async ( _ , id) => {
        return dbInstance.deleteStudentById(id);
    }); 

    /*
        Pagina Profesores
    */
    ipcMain.handle('get-all-teachers', async ( ) => {
        return dbInstance.getAllTeachers();
    });
    ipcMain.handle('add-teacher', async ( _ , teacherData) => {
        return dbInstance.addTeacher(teacherData);
    });

    ipcMain.handle('delete-teacher-by-id', async ( _ , id) => {
        return dbInstance.deleteTeacherById(id);
    });

    ipcMain.handle('update-teacher', async ( _ , teacherData) => {
        return dbInstance.updateTeacher(teacherData);
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
    ipcMain.handle('export-receipt-excel', async ( _ , payment) => {
        return exportReceiptToExcel(payment);
    });

    ipcMain.handle('export-report-excel', async ( _ , data) => {
        const {
                payments
              } = data;
        return exportReportToExcel(
                                    payments
        );
    });

    ipcMain.handle('export-payments-by-year', async ( _ , paymentData) => {
        return exportPaymentsByYearToExcel(paymentData);
    });

    ipcMain.handle('export-expenses-by-year', async ( _ , expensesData) => {
        return exportExpensesByYearToExcel(expensesData);
    });

    ipcMain.handle('export-students-by-active', async ( _ , studentData) => {
        const { students, payments, years} = studentData;
        return exportStudentsByActiveToExcel(students,payments,years);
    });

    ipcMain.handle('export-historic', async ( _ , data) => {
        return exportHistoric(data);
    });


    ipcMain.handle('import-student-from-excel', async ( ) => {
        return importStudentsFromExcel();
    });

    ipcMain.handle('import-student', async ( _ , studentsData) => {
        return dbInstance.importStudents(studentsData);
    });

    
    /*
        App functionality
    */
    ipcMain.handle('add-image', async ( _ , imageData) => {
        return dbInstance.addImage(imageData);
    });

    ipcMain.handle('get-images', async ( ) => {
        return dbInstance.getImages();
    });

    ipcMain.handle('set-image', async ( _ , imageState) => {
        return dbInstance.setImage(imageState);
    });

    ipcMain.handle('get-current-image', async ( ) => {
        return dbInstance.getCurrentImage();
    });

    ipcMain.handle('delete-image-by-id', async ( _ , id) => {
        return dbInstance.deleteImageById(id);
    });

    ipcMain.handle('app:quit', async ( ) => {
        return app.quit();
    });
}