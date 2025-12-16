import { dialog } from "electron";
import fs from "fs";
import * as XLSX from "xlsx";
import path from "path";

const exportPaymentsToExcel = async (payments) => {
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
};

export default exportPaymentsToExcel;