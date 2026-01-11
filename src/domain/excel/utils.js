import ExcelJS from "exceljs";
import { dialog } from "electron";
import path from "path";
/*
  Helper Functions
*/
export function getAssetPath(filename) {
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

export function createWorksheet(workbook, year, funcColumn, name= "sheet") {
  const sheet = workbook.addWorksheet(name, {
    views: [{ showGridLines: false }],
  });

  sheet.columns = funcColumn(year);
  return sheet;
}

export async function saveWorkbook(workbook, title, defaultName) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: title,
    defaultPath: path.join(defaultName),
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (canceled || !filePath) return null;

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

export function createWorkbook() {
  return new ExcelJS.Workbook();
}

/*
    Styles
*/

export function applyBaseStyle(sheet) {
  sheet.eachRow({ includeEmpty: true }, row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.font = {
        name: "Aptos Narrow",
        size: 11,
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });
  });
}