import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for Excel import/export.
*/
export function registerExcelHandlers(ipcMain, excel) {
    handle(ipcMain, CHANNELS.excel.exportReceiptToExcel, (_, payment) => excel.exportReceiptToExcel(payment));

    handle(ipcMain, CHANNELS.excel.exportReportToExcel, (_, data) => {
        const { payments } = data;
        return excel.exportReportToExcel(payments);
    });

    handle(ipcMain, CHANNELS.excel.exportCashRegisterReportToExcel, (_, data) => excel.exportCashRegisterReportToExcel(data));

    handle(ipcMain, CHANNELS.excel.exportPaymentsByYearToExcel, (_, paymentData) => excel.exportPaymentsByYearToExcel(paymentData));

    handle(ipcMain, CHANNELS.excel.exportExpensesByYearToExcel, (_, expensesData) => excel.exportExpensesByYearToExcel(expensesData));

    handle(ipcMain, CHANNELS.excel.exportStudentsByActiveToExcel, (_, studentData) => {
        const { students: rows, payments, years } = studentData;
        return excel.exportStudentsByActiveToExcel(rows, payments, years);
    });

    handle(ipcMain, CHANNELS.excel.exportTemplateStudents, () => excel.exportTemplateStudents());

    handle(ipcMain, CHANNELS.excel.exportHistoric, (_, data) => excel.exportHistoric(data));

    handle(ipcMain, CHANNELS.excel.importStudentsFromExcel, (_, studentsData) => excel.importStudentsFromExcel(studentsData));

    handle(ipcMain, CHANNELS.excel.exportDelayByMonthReportToExcel, (_, data) => excel.exportDelayByMonthReportToExcel(data));

    handle(ipcMain, CHANNELS.excel.exportDelayByTeacherReportToExcel, (_, data) => excel.exportDelayByTeacherReportToExcel(data));
}
