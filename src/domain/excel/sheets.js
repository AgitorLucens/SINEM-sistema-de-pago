import { createWorksheet } from "./utils.js";
import { getStudentColumns, groupPaymentsByStudentAndYear, buildStudentRow, styleStudentSheet } from "./students.js";
import { getExpensesColumns, styleExpensesSheet } from "./expenses.js";
import { getPaymentsColumns, buildPaymentRow, stylePaymentSheet } from "./payments.js";

/*
    Shared sheet builders. Every export (single-year and the historic
    backup) goes through these, so the layout of a given entity's sheet
    is defined exactly once.
*/

export function addPaymentsSheet(workbook, payments) {
    const safePayments = Array.isArray(payments) ? payments : [payments];
    const sheet = createWorksheet(workbook, "", getPaymentsColumns, "Ingresos");

    safePayments.forEach(p => {
        sheet.addRow(buildPaymentRow(p));
    });

    sheet.getColumn("amount").numFmt = '"₡"#,##0.00';
    sheet.getColumn("amount").alignment = { horizontal: "right" };
    sheet.getColumn("date").alignment = { horizontal: "center" };
    sheet.getColumn("consecutive").alignment = { horizontal: "center" };

    stylePaymentSheet(sheet);
    return sheet;
}

export function addExpensesSheet(workbook, expenses) {
    const sheet = createWorksheet(workbook, "", getExpensesColumns, "Egresos");

    expenses.forEach(e => {
        sheet.addRow({
            date: e.date
                ? new Intl.DateTimeFormat("es-CR").format(new Date(e.date))
                : "",
            detail: e.description ?? "",
            reference: e.reference ?? "",
            amount: e.amount ? Number(e.amount) : "",
        });
    });

    const MAX_ROWS = 28;
    while (sheet.rowCount < MAX_ROWS) {
        sheet.addRow({});
    }

    styleExpensesSheet(sheet);
    return sheet;
}

export function addStudentsSheets(workbook, students, payments, years) {
    years.forEach(year => {
        const paymentsByStudent = groupPaymentsByStudentAndYear(payments, year);

        const sheet = createWorksheet(workbook, year, getStudentColumns, `Matriculados ${year}`);

        students.forEach(student => {
            const studentPayments = paymentsByStudent[student.id] || [];
            const row = buildStudentRow(student, studentPayments);
            sheet.addRow(row);
        });
        styleStudentSheet(sheet);
    });
}
