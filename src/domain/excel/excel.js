import { createWorkbook, createWorksheet, saveWorkbook } from "./utils.js";
import { addPaymentsSheet, addExpensesSheet, addStudentsSheets } from "./sheets.js";
import { getStudentColumnsTemplate, styleStudentSheetTemplate, parseStudentFile } from "./students.js";
import { styleReceiptSheet } from "./receipt.js";
import {
    exportDelayByMonthReport,
    exportDelayByTeacherReport,
    exportCashRegisterReportToExcel as exportCashRegisterReport,
} from "./reports.js";
import { exportReportViaExternalGenerator } from "./externalGenerator.js";

class AppExcel {
    /*
        Export Receipt
    */
    async exportReceiptToExcel(payment) {
        if (!payment) return { success: false };

        const workbook = createWorkbook();
        const sheet = workbook.addWorksheet("Factura", {
            views: [{
                showGridLines: false,
                zoomScale: 70,
            }],
        });

        styleReceiptSheet(workbook, sheet, payment);

        const filePath = await saveWorkbook(workbook, "Guardar Factura",
            `Factura.xlsx_${payment.year && payment.sequence ? `${payment.year}-${String(payment.sequence).padStart(5, '0')}` : '---'}`);
        if (!filePath) return { success: false };

        return { success: true, path: filePath }
    }

    /*
        Export Payments
    */
    async exportPaymentsByYearToExcel(payments) {
        if (!payments) return { success: false };

        const { name, paymentsFiltered } = payments;

        const workbook = createWorkbook();
        addPaymentsSheet(workbook, paymentsFiltered);

        const filePath = await saveWorkbook(workbook, "Guardar Pagos", `${name}.xlsx`);
        if (!filePath) return { success: false }

        return { success: true, path: filePath };
    }

    /*
        Export Expenses
    */
    async exportExpensesByYearToExcel(expenses) {
        if (!expenses) return { success: false }

        const workbook = createWorkbook();
        addExpensesSheet(workbook, expenses);

        const filePath = await saveWorkbook(workbook, "Guardar Egresos", `Egresos.xlsx`);
        if (!filePath) return { success: false };

        return { success: true, path: filePath };
    }

    /*
        Export Students
    */
    async exportStudentsByActiveToExcel(students, payments, years) {
        if (!students?.length || !payments?.length || !years?.length) return { success: false, error: "Estudiantes, Pagos o Años vacios." };

        const workbook = createWorkbook();
        addStudentsSheets(workbook, students, payments, years);

        const path = await saveWorkbook(
            workbook,
            "Guardar estudiantes",
            `Estudiantes_${years.join("_")}.xlsx`
        );
        if (!path) return { success: false };

        return { success: true, path: path };
    }

    /*
        Export Template Students
    */
    async exportTemplateStudents() {
        const workbook = createWorkbook();
        const sheet = createWorksheet(workbook, 2025, getStudentColumnsTemplate, `Estudiantes`);
        styleStudentSheetTemplate(sheet);
        const path = await saveWorkbook(
            workbook,
            "Guardar estudiantes",
            `Estudiantes_Plantilla.xlsx`
        );
        if (!path) return { success: false };

        return { success: true, path: path };
    }

    /*
        Import Students
    */
    async importStudentsFromExcel(studentsData) {
        if (!studentsData) throw new Error("Falta archivo Excel.");

        const file = studentsData;
        const workbook = createWorkbook();
        const students = await parseStudentFile(file, workbook);

        return { success: true, students: students };
    }

    /*
        Export Historic
    */
    async exportHistoric(data) {
        const { payments, years, students, expenses } = data;
        const workbook = createWorkbook();

        // students (one sheet per year)
        if (years !== null && payments !== null && payments?.length > 0 && years?.length > 0) {
            addStudentsSheets(workbook, students, payments, years);
        }

        // payments
        if (payments !== null && payments?.length > 0) {
            addPaymentsSheet(workbook, payments);
        }

        // expenses
        if (expenses !== null && expenses?.length > 0) {
            addExpensesSheet(workbook, expenses);
        }

        const path = await saveWorkbook(
            workbook,
            "Guardar Respaldo",
            `Respaldo.xlsx`
        );
        if (!path) return { success: false }

        return { success: true, path: path };
    }

    /*
        Export Report — delegated to the external Go generator
        (see externalGenerator.js).
    */
    async exportReportToExcel(payments) {
        if (!payments) return { success: false }
        return exportReportViaExternalGenerator(payments);
    }

    async exportDelayByMonthReportToExcel(data) {
        const res = await exportDelayByMonthReport(data);
        return res;
    }

    async exportDelayByTeacherReportToExcel(data) {
        const res = await exportDelayByTeacherReport(data);
        return res;
    }

    async exportCashRegisterReportToExcel(data) {
        const res = await exportCashRegisterReport(data);
        return res;
    }

}

export default AppExcel;
