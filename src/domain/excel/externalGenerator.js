import { dialog } from "electron";
import fs from "fs";
import { execFile } from 'child_process';
import path from 'path';
import os from "os";
import { getAssetPath } from "./utils.js";

/*
    Report generation delegated to the external excel-generator.exe
    (Go binary shipped as an asset). It receives the payments as a JSON
    temp file and writes the .xlsx at the user-chosen path.

    Isolated here so AppExcel stays a pure ExcelJS facade — this module
    is the only place in the Excel layer that spawns processes.
*/
export async function exportReportViaExternalGenerator(payments) {
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
                reject(error)
            } else resolve({ success: true })
        })
    });
}
