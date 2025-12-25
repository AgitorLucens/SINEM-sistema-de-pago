import { dialog } from "electron";
import fs from "fs";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import path from "path";
import { app } from "electron";

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

export async function exportPaymentsByYearToExcel(payments) {
  if (!payments) return { success: false };

    const safePayments = Array.isArray(payments) ? payments : [payments];

  /* =========================
     WORKBOOK & SHEET
  ========================= */
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Ingresos", {
      views: [{ 
        showGridLines: false,
      }],
    }
  );

  const tableBorder = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
  };

  /* =========================
     COLUMNAS
  ========================= */
  sheet.columns = [
    { header: "# Factura", key: "consecutive", width: 10.25 },
    { header: "Fecha", key: "date", width: 10.25 },
    { header: "Nombre Estudiante", key: "student", width: 24 },
    { header: "Modo de Pago", key: "method", width: 12 },
    { header: "Curso", key: "division", width: 10.25 },
    { header: "Tipo de pago", key: "concept", width: 14 },
    { header: "Monto", key: "amount", width: 10.25 },
    { header: "# Comprobante", key: "-", width: 12.95 },
  ];

  /* =========================
     DATA
  ========================= */
  safePayments.forEach(p => {
    sheet.addRow({
      consecutive: `${p.year}-${String(p.sequence).padStart(5, '0')}`,
      date: new Intl.DateTimeFormat("es-CR").format(new Date(p.date)),
      student: p.student_name ?? "",
      concept: p.concept_type,
      division: p.division_name,
      method: p.payment_method,
      amount: Number(p.amount),
      "-": "-",
    });
  });

  /* =========================
     FORMATOS
  ========================= */
  sheet.getColumn("amount").numFmt = '"₡"#,##0.00';
  sheet.getColumn("amount").alignment = { horizontal: "right" };
  sheet.getColumn("date").alignment = { horizontal: "center" };
  sheet.getColumn("consecutive").alignment = { horizontal: "center" };

  /* =========================
     FILA DE TOTALES (OPCIONAL)
  ========================= */
  const totalRow = sheet.addRow({
    concept: "TOTAL",
    amount: {
      formula: `SUM(G2:G${sheet.rowCount})`,
    },
  });

  totalRow.font = { bold: true };
  totalRow.getCell("amount").numFmt = '"₡"#,##0.00';

  sheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell({ includeEmpty: false }, cell => {
      cell.border = tableBorder;
      cell.font = { name: "Aptos Narrow" };
    });
  });

  sheet.getRow(1).alignment = { horizontal: "center" };

    /* =========================
     ESTILO HEADER
  ========================= */

  sheet.getCell("A1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("A1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("B1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };                           
  sheet.getCell("B1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("C1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("C1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("D1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("D1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("E1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("E1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("F1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("F1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("G1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("G1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };
  sheet.getCell("H1").font = { name: "Aptos Narrow",
                               color: { argb: "FFFFFF" },
                               bold: true };
  sheet.getCell("H1").fill = { type: "pattern",
                               pattern: "solid",
                               fgColor: { argb: "FF808080" } };

  /* =========================
     GUARDAR ARCHIVO
  ========================= */
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar pagos",
    defaultPath: "Pagos.xlsx",
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  await workbook.xlsx.writeFile(filePath);

  return { success: true, path: filePath };
}

export async function exportExpensesByYearToExcel(expenses) {
  if (!expenses) return { success: false };

    const safeExpenses = Array.isArray(expenses)
      ? expenses
      : [expenses];

    const data = safeExpenses.map(p => ({
      Fecha: p.date,
      Detalle: p.description,
      Referencia: p.reference,
      Monto: Number(p.amount),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Egresos");

    // 🔹 Pedir ruta al usuario
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Guardar gastos",
      defaultPath: path.join("egresos.xlsx"),
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    // 🔹 Generar buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // 🔹 Guardar archivo
    fs.writeFileSync(filePath, buffer);

    return { success: true, path: filePath };
}

export async function exportStudentsByActiveToExcel(students) {
  if (!students) return { success: false };

    const safeStudents = Array.isArray(students)
      ? students
      : [students];

    const data = safeStudents.map(p => ({
      "Nombre Matriculado": p.name,
      Correo: p.email,
      Activo: p.active,
      Telefono: p.phone,
      Referencia: p.reference,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matriculados");

    // 🔹 Pedir ruta al usuario
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Guardar Estudiantes",
      defaultPath: path.join("estudiantes.xlsx"),
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    // 🔹 Generar buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // 🔹 Guardar archivo
    fs.writeFileSync(filePath, buffer);

    return { success: true, path: filePath };
}


function getAssetPath(filename) {
  let assetPath;
   if (app.isPackaged) {
    // PRODUCCIÓN (extraResources)
    assetPath = path.join(
      process.resourcesPath,
      "/assets/",
      filename
    );
  } else {
    // DESARROLLO
    assetPath = path.join(
      process.cwd(),
      "src",
      "ui",
      "assets",
      filename
    );
  }
  return assetPath;
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