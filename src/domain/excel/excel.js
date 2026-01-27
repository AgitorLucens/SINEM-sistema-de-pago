import { dialog } from "electron";
//import ExcelJS from "exceljs";
import fs from "fs";
import { execFile } from 'child_process'
import path from 'path'
import os from "os";
import { createWorkbook, createWorksheet, saveWorkbook, getAssetPath } from "./utils.js";
import { groupPaymentsByStudentAndYear, buildStudentRow, getStudentColumns,
         styleStudentSheet, addSheetTitle
 } from "./students.js";
import { getExpensesColumns, styleExpensesSheet} from "./expenses.js";
import { getPaymentsColumns, buildPaymentRow, stylePaymentSheet } from "./payments.js";
import { styleReceiptSheet } from "./receipt.js";


//refactor
import { app } from 'electron';

/*
  Export Receipt
*/
export async function exportReceiptToExcel(payment) {
  if (!payment) return { success: false };

  const workbook = createWorkbook();
  const sheet = workbook.addWorksheet("Factura", {
    views: [{ 
      showGridLines: false,
      zoomScale: 70,
    }],
  });

  styleReceiptSheet(workbook,sheet,payment);

  const filePath = await saveWorkbook(workbook, "Guardar Factura", 
                        `Factura.xlsx_${payment.year && payment.sequence ? `${payment.year}-${String(payment.sequence).padStart(5, '0')}` : '---'}`);
  if(!filePath) return { success: false };

  return { success: true, path: filePath }
}

/*
  Export Payments
*/
export async function exportPaymentsByYearToExcel(payments) {
  if (!payments) return { success: false };

  const {name,paymentsFiltered} = payments;
  const safePayments = Array.isArray(paymentsFiltered) ? paymentsFiltered : [paymentsFiltered];

  const workbook = createWorkbook();
  const sheet = createWorksheet(workbook, "",getPaymentsColumns,"Ingresos");

  // data
  safePayments.forEach(p => {
    sheet.addRow(buildPaymentRow(p));
  });

  // formatos
  sheet.getColumn("amount").numFmt = '"₡"#,##0.00';
  sheet.getColumn("amount").alignment = { horizontal: "right" };
  sheet.getColumn("date").alignment = { horizontal: "center" };
  sheet.getColumn("consecutive").alignment = { horizontal: "center" };
 
  stylePaymentSheet(sheet);
  
  const filePath = await saveWorkbook(workbook, "Guardar Pagos",`${name}.xlsx`);
  if (!filePath) return {success: false}

  return { success: true, path: filePath };
}
/*
  Export Expenses
*/
export async function exportExpensesByYearToExcel(expenses) {
  if (!expenses) return {success: false}
  
  const workbook = createWorkbook();
  const sheet = createWorksheet(workbook, "", getExpensesColumns, "Egresos");

  // datos
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

  /* =====================
     FILAS VACÍAS (hasta fila 28)
  ===================== */
  const MAX_ROWS = 28;
  while (sheet.rowCount < MAX_ROWS) {
    sheet.addRow({});
  }
  
  styleExpensesSheet(sheet);
  
  const filePath = await saveWorkbook(workbook, "Guardar Egresos",`Egresos.xlsx`);
  if (!filePath) return { success: false };

  return { success: true, path: filePath };
}

/*
    Export Students
*/
export async function exportStudentsByActiveToExcel(students,payments,years) {
  if (!students?.length || !payments?.length || !years?.length) return { success: false, error: "Estudiantes, Pagos o Años vacios." };

  const workbook = createWorkbook();
  years.forEach(year => {
    const paymentsByStudent =
      groupPaymentsByStudentAndYear(payments, year);

      const sheet = createWorksheet(workbook,year,getStudentColumns,`Matriculados ${year}`);

      students.forEach(student => {
        const studentPayments = paymentsByStudent[student.id] || [];
        const row = buildStudentRow(student, studentPayments);
        sheet.addRow(row);
      });
      styleStudentSheet(sheet);
  });

  const path = await saveWorkbook(
    workbook,
    "Guardar estudiantes",
    `Estudiantes_${years.join("_")}.xlsx`
  );
  if (!path) return { success: false };

  return { success: true, path: path };
}

/*
  Export Historic
*/
export async function exportHistoric(data){
  const {payments,years,students,expenses} = data;
  const workbook = createWorkbook();

  console.log(JSON.stringify(payments))

  //students
  if (years !== null && payments !== null && payments?.length === 0 && years?.length === 0 ){
    years.forEach(year => {
    const paymentsByStudent =
      groupPaymentsByStudentAndYear(payments, year);

      const sheet = createWorksheet(workbook,year,getStudentColumns,`Matriculados ${year}`);

      students.forEach(student => {
        const studentPayments = paymentsByStudent[student.id] || [];
        const row = buildStudentRow(student, studentPayments);
        sheet.addRow(row);
      });
      styleStudentSheet(sheet);
  });
  }
  // payments
  if (payments !== null && payments?.length > 0){
    const sheet = createWorksheet(workbook, "",getPaymentsColumns,"Ingresos");

    // data
    const safePayments = Array.isArray(payments) ? payments : [payments];
    safePayments.forEach(p => {
      sheet.addRow(buildPaymentRow(p));
    });

    // formatos
    sheet.getColumn("amount").numFmt = '"₡"#,##0.00';
    sheet.getColumn("amount").alignment = { horizontal: "right" };
    sheet.getColumn("date").alignment = { horizontal: "center" };
    sheet.getColumn("consecutive").alignment = { horizontal: "center" };
 
    stylePaymentSheet(sheet);
  }

  // expenses
  if (expenses !== null && expenses?.length > 0){
    const sheet = createWorksheet(workbook, "", getExpensesColumns, "Egresos");

    // datos
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
  }

  const path = await saveWorkbook(
    workbook,
    "Guardar Respaldo",
    `Respaldo.xlsx`
  );
  if (!path) return {success: false}

  return { success: true, path: path };
}

/*
  Export Report
*/
export async function exportReportToExcel(
  payments
) {
  if (!payments) return { success: false}
  const safePayments = Array.isArray(payments) ? payments : [payments];

  
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar Reporte",
    defaultPath: "Reporte_Ingresos.xlsx",
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (canceled || !filePath) return { success: false };

  const tempJsonPath = path.join(os.tmpdir(), 'pagos.json');
  fs.writeFileSync(tempJsonPath, JSON.stringify(safePayments));

  const goExe = getAssetPath('excel-generator.exe');

  return new Promise((resolve, reject) => {
    execFile(goExe, [tempJsonPath, filePath], (error, stdout, stderr) => {
    if (stdout) console.log("Salida STDOUT:\n", stdout)
    if (stderr) console.log("Salida STDERR:\n", stderr)
    
      if (error) {
    console.error("Error al ejecutar el .exe:", error)
    } else resolve({ success: true })
    
      
    })
  })
}