import { dialog } from "electron";
import fs from "fs";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import path from "path";

export async function exportPaymentsToExcel(payments) {
  if (!payments) return { success: false };

    const safePayments = Array.isArray(payments)
      ? payments
      : [payments];

    const data = safePayments.map(p => ({
      Fecha: p.date,
      Estudiante: p.student_name ?? "",
      Concepto: p.concept_type,
      División: p.division_name,
      Método: p.payment_method,
      Monto: Number(p.amount),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

    //Pedir ruta al usuario
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Guardar pagos",
      defaultPath: path.join("pagos.xlsx"),
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    //Generar buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    //Guardar archivo
    fs.writeFileSync(filePath, buffer);

    return { success: true, path: filePath };
}

export async function exportPaymentsByYearToExcel(payments) {
  if (!payments) return { success: false };

    const safePayments = Array.isArray(payments)
      ? payments
      : [payments];

    const data = safePayments.map(p => ({
      "# Consecutivo": p.id,
      Fecha: p.date,
      Estudiante: p.student_name ?? "",
      Concepto: p.concept_type,
      División: p.division_name,
      Método: p.payment_method,
      Monto: Number(p.amount),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ingresos");

    // 🔹 Pedir ruta al usuario
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Guardar pagos",
      defaultPath: path.join("pagos.xlsx"),
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
    