import { dialog } from "electron";
import fs from "fs";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import path from "path";
import { getAssetPath, createWorkbook, createWorksheet, saveWorkbook } from "./utils.js";
import { groupPaymentsByStudentAndYear, buildStudentRow, getStudentColumns,
         styleStudentSheet, addSheetTitle
 } from "./students.js";
import { getExpensesColumns, styleExpensesSheet} from "./expenses.js";
import { getPaymentsColumns, buildPaymentRow, stylePaymentSheet } from "./payments.js";

const cmToPoints = (cm) => cm * 28.3465;
const cmToColumnWidth = (cm) => cm * 5.5;

export async function exportPaymentsToExcel(payment) {
  if (!payment) return { success: false };

  const date = new Intl.DateTimeFormat("es-CR").format(new Date(payment.date));
  let assetPathSinem;
  let assetPathAvas;
  let assetPathMinisterio;
  assetPathSinem = getAssetPath("sinem-mini.jpg");
  assetPathAvas = getAssetPath("avas-sinem.jpg");
  assetPathMinisterio = getAssetPath("ministerio.jpg");

  const workbook = new ExcelJS.Workbook();
  let sheet = workbook.addWorksheet("Factura", {
    views: [{ 
      showGridLines: false,
      zoomScale: 70,
    }],
  });

  /* =========================
     CONFIGURACIÓN DE COLUMNAS
  ========================= */
  sheet.columns = [
    { width: cmToColumnWidth(4.91) },  // A
    { width: cmToColumnWidth(4.91) },  // B
    { width: 18 },  // C
    { width: 22 },  // D
    { width: 6 },   // E
  ];

  /* =========================
     IMÁGENES (LOGOS)
  ========================= */
  const logoLeft = workbook.addImage({
    filename: path.join(assetPathAvas),
    extension: "jpg",
  });

  const logoRight = workbook.addImage({
    filename: path.join(assetPathSinem),
    extension: "jpg",
  });

  const logoBottom = workbook.addImage({
    filename: path.join(assetPathMinisterio),
    extension: "jpg",
  });

  sheet.addImage(logoLeft, {
    tl: { col: "0.5" , row: "1.5" }, // Top-left corner (0-based, supports decimals)
    br: { col:  1, row: "5" },  // Bottom-right corner
    ext: { width: 60, height: 100 },
  });

  sheet.addImage(logoRight, {
    tl: { col: 1 , row: 1.5 }, // Top-left corner (0-based, supports decimals)
    br: { col: 2, row: 5 },  // Bottom-right corner
    ext: { width: 60, height: 120 },
  });

  sheet.addImage(logoBottom, {
    tl: { col: 0.5, row: 26.5 }, // Top-left corner (0-based, supports decimals)
    br: { col: 2, row: 34.5 },  // Bottom-right corner
    editAs: 'absolute',
  });

  /* =========================
     ENCABEZADO
  ========================= */
  sheet.mergeCells("A6:B6");
  sheet.getCell("A6").value = "Comprobante ASEMPA";
  sheet.getCell("A6").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("A6").alignment = { horizontal: "center" };

  sheet.mergeCells("A7:B7");
  sheet.getCell("A7").value = "San José, Pavas, Costa Rica";
  sheet.getCell("A7").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("A7").alignment = { horizontal: "center" };

  sheet.mergeCells("A8:B8");
  sheet.getCell("A8").value = "Cédula jurídica 3-002-554051";
  sheet.getCell("A8").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("A8").alignment = { horizontal: "center" };

  sheet.mergeCells("A9:B9");
  sheet.getCell("A9").value = "Teléfono 2296-9021 / 2291-9298";
  sheet.getCell("A9").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("A9").alignment = { horizontal: "center" };

  sheet.getCell("A10").value = "asempasinempavas@hotmail.com";
  sheet.getCell("A10").alignment = { horizontal: "center" };
  sheet.getCell("A10").font = { name: "Aptos Narrow", size: 20, bold: true  };
  sheet.mergeCells("A10:B10");
  sheet.mergeCells("A11:B11");

  /* =========================
     FACTURA #
  ========================= */
  sheet.getCell("A12").value = "Factura #:";
  sheet.getCell("A12").font = { name: "Aptos Narrow", size: 22, bold: true  };

  sheet.mergeCells("A13:B13");
  sheet.getCell("B12").value = `${payment.year}-${String(payment.sequence).padStart(5, '0')}`;
  sheet.getCell("B12").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B12").alignment = { horizontal: "right" };

  /* =========================
     DATOS
  ========================= */
  sheet.getCell("A14").value = "Fecha:";
  sheet.getCell("A14").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B14").value = date;
  sheet.getCell("B14").font = { name: "Aptos Narrow", size: 22};
  sheet.getCell("B14").alignment = { horizontal: "right" };

  sheet.getCell("A16").value = "Tipo de Pago";
  sheet.getCell("A16").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B16").value = payment.concept_type;
  sheet.getCell("B16").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B16").alignment = { horizontal: "right" };

  sheet.getCell("A18").value = "Alumno:";
  sheet.getCell("A18").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B18").value = payment.student_name;
  sheet.getCell("B18").font = { name: "Aptos Narrow", size: 16};
  sheet.getCell("B18").alignment = { horizontal: "right" };

  sheet.getCell("A20").value = "Modo de Pago";
  sheet.getCell("A20").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B20").value = payment.payment_method;
  sheet.getCell("B20").font = { name: "Aptos Narrow", size: 20};
  sheet.getCell("B20").alignment = { horizontal: "right" };

  sheet.getCell("A22").value = "Curso:";
  sheet.getCell("A22").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B22").value = payment.division_name;
  sheet.getCell("B22").font = { name: "Aptos Narrow", size: 20};
  sheet.getCell("B22").alignment = { horizontal: "right" };

  sheet.getCell("A24").value = "Comprobante #:";
  sheet.getCell("A24").font = { name: "Aptos Narrow", size: 22, bold: true  };
  sheet.getCell("B24").value = "";
  sheet.getCell("B24").font = { name: "Aptos Narrow", size: 22};
  sheet.getCell("B24").alignment = { horizontal: "right" };
  /* =========================
     MONTO
  ========================= */
  sheet.getCell("A26").value = "Monto total:";
  sheet.getCell("A26").font = { name: "Aptos Narrow", size: 22, bold: true };
  sheet.getCell("B26").value = payment.amount;
  sheet.getCell("B26").font = { name: "Aptos Narrow", size: 22};
  sheet.getCell("B26").numFmt = '"₡"#,##0.00';
  sheet.getCell("B26").alignment = { horizontal: "right" };

  sheet = invoiceCellHeigth(sheet);
  /* =========================
     GUARDAR
  ========================= */
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar factura",
    defaultPath: `Factura-${payment.year}-${String(payment.sequence).padStart(5, '0')}.xlsx`,
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  await workbook.xlsx.writeFile(filePath);
  
  return { success: true, path: filePath };
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

  //students
  if (years !== null && payments !== null && years?.length === 0 && payments?.length === 0){
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
  if (payments !== null && payments?.length === 0){
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
  if (expenses !== null && payments?.length === 0){
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

export async function exportReportToExcel(
  selectedCourses,
  selectedMethods,
  matrixData,
  columnTotals,
  totalGeneral,
  selectedDate
) {
  /* =========================
     WORKBOOK
  ========================= */
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reporte", {
    views: [{ showGridLines: false }],
  });

  /* =========================
     HOJA AUXILIAR (LISTAS)
  ========================= */
  const lists = workbook.addWorksheet("lists");
  lists.state = "veryHidden";

  const dateOptions = ["- todo -", selectedDate].filter(Boolean);
  const courseNames = selectedCourses.map(c => c.name);
  const methodNames = selectedMethods.map(m => m.label ?? m.name);

  dateOptions.forEach((v, i) => lists.getCell(`A${i + 1}`).value = v);
  courseNames.forEach((v, i) => lists.getCell(`B${i + 1}`).value = v);
  methodNames.forEach((v, i) => lists.getCell(`C${i + 1}`).value = v);

  /* =========================
     ESTILOS
  ========================= */
  const headerStyle = {
    font: { name: "Aptos Narrow", bold: true },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const cellBorder = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  /* =========================
     CABECERA SUPERIOR
  ========================= */
  sheet.getCell("A1").value = "Fecha";
  sheet.getCell("A1").font = { name: "Aptos Narrow", bold: true };

  sheet.getCell("B1").dataValidation = {
    type: "list",
    allowBlank: false,
    formulae: [`lists!$A$1:$A$${dateOptions.length}`],
  };

  /* =========================
     TITULOS
  ========================= */
  sheet.getCell("A3").value = "Suma - Monto";
  sheet.getCell("A3").font = { name: "Aptos Narrow", bold: true };

  sheet.getCell("B3").value = "Curso";
  sheet.getCell("B3").font = { name: "Aptos Narrow"};
  sheet.getCell("B3").dataValidation = {
    type: "list",
    allowBlank: false,
    formulae: [`lists!$B$1:$B$${courseNames.length}`],
  };

  /* =========================
     HEADER DE TABLA
  ========================= */
  sheet.getCell("A4").value = "Modo de Pago";
  sheet.getCell("A4").style = headerStyle;

  selectedCourses.forEach((course, i) => {
    const col = 2 + i;
    const cell = sheet.getCell(4, col);
    cell.value = course.name;
    cell.style = headerStyle;
  });

  const totalCol = 2 + selectedCourses.length;
  sheet.getCell(4, totalCol).value = "Total Resultado";
  sheet.getCell(4, totalCol).style = headerStyle;

  /* =========================
     FILAS DE DATOS
  ========================= */
  selectedMethods.forEach((method, rowIndex) => {
    const row = 5 + rowIndex;

    sheet.getCell(row, 1).value = method.label ?? method.name;
    sheet.getCell(row, 1).border = cellBorder;

    sheet.getCell(row, 1).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`lists!$C$1:$C$${methodNames.length}`],
    };

    let rowTotal = 0;

    selectedCourses.forEach((course, colIndex) => {
      const col = 2 + colIndex;
      const value = matrixData[method.value]?.[course.id] || 0;
      rowTotal += value;

      const cell = sheet.getCell(row, col);
      cell.value = value;
      cell.numFmt = '"₡"#,##0.00';
      cell.border = cellBorder;
    });

    const totalCell = sheet.getCell(row, totalCol);
    totalCell.value = rowTotal;
    totalCell.numFmt = '"₡"#,##0.00';
    totalCell.font = { name: "Aptos Narrow", bold: true };
    totalCell.border = cellBorder;
  });

  /* =========================
     FILA TOTAL GENERAL
  ========================= */
  const totalRow = 5 + selectedMethods.length;

  sheet.getCell(totalRow, 1).value = "Total Resultado";
  sheet.getCell(totalRow, 1).font = { name: "Aptos Narrow", bold: true };
  sheet.getCell(totalRow, 1).border = cellBorder;

  selectedCourses.forEach((course, i) => {
    const col = 2 + i;
    const cell = sheet.getCell(totalRow, col);
    cell.value = columnTotals[course.id] || 0;
    cell.numFmt = '"₡"#,##0.00';
    cell.font = { name: "Aptos Narrow", bold: true };
    cell.border = cellBorder;
  });

  sheet.getCell(totalRow, totalCol).value = totalGeneral;
  sheet.getCell(totalRow, totalCol).numFmt = '"₡"#,##0.00';
  sheet.getCell(totalRow, totalCol).font = { name: "Aptos Narrow", bold: true };
  sheet.getCell(totalRow, totalCol).border = cellBorder;

  /* =========================
     AJUSTES DE COLUMNAS
  ========================= */
  sheet.columns.forEach(col => {
    col.width = 18;
  });

  /* =========================
     GUARDAR ARCHIVO
  ========================= */
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar reporte",
    defaultPath: "Reporte_Pagos.xlsx",
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (canceled || !filePath) return { success: false };

  await workbook.xlsx.writeFile(filePath);

  return { success: true, path: filePath };
}

function invoiceCellHeigth(sheet) {
  const rowHeightLogo = cmToPoints(0.87);
  const rowHeightHeader = cmToPoints(1.01);

  /*
    Logo rows
  */
  sheet.getRow(1).height = rowHeightLogo;
  sheet.getRow(2).height = rowHeightLogo;
  sheet.getRow(3).height = rowHeightLogo;
  sheet.getRow(4).height = rowHeightLogo;
  sheet.getRow(5).height = rowHeightLogo;

  /*
    Header rows
  */
  sheet.getRow(6).height = rowHeightHeader;
  sheet.getRow(7).height = rowHeightHeader;
  sheet.getRow(8).height = rowHeightHeader;
  sheet.getRow(9).height = rowHeightHeader;
  //correo sinem
  sheet.getRow(10).height = cmToPoints(0.93);

  sheet.getRow(11).height = rowHeightHeader;
  // factura #
  sheet.getRow(12).height = rowHeightHeader;
  // vacio
  sheet.getRow(13).height = cmToPoints(0.53);
  // fecha
  sheet.getRow(14).height = rowHeightHeader;
  // vacio
  sheet.getRow(15).height = rowHeightHeader;
  // tipo de pago
  sheet.getRow(16).height = rowHeightHeader;
  // vacio
  sheet.getRow(17).height = cmToPoints(0.74);
  // alumno
  sheet.getRow(18).height = cmToPoints(1.27);
  // vacio
  sheet.getRow(19).height = rowHeightHeader;
  // modo de pago
  sheet.getRow(20).height = rowHeightHeader;
  // vacio
  sheet.getRow(21).height = rowHeightHeader;
  // curso
  sheet.getRow(22).height = rowHeightHeader;
  // vacio
  sheet.getRow(23).height = cmToPoints(0.74);
  //  comprobante #
  sheet.getRow(24).height = rowHeightHeader;
  // vacio
  sheet.getRow(25).height = rowHeightHeader;
  // monto
  sheet.getRow(26).height = rowHeightHeader;
  return sheet;
}

