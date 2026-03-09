export function groupPaymentsByStudentAndYear(payments = [], year) {
  const targetYear = Number(year);

  const result = payments
    .filter(p => Number(p.year) === targetYear)
    .reduce((acc, p) => {
      if (!acc[p.student_id]) acc[p.student_id] = [];
      acc[p.student_id].push(p);
      return acc;
    }, {});

  return result;
}

// se ubica la matricula segun el mes en el se hizo el pago y donde pertenece
function resolveMatricula(payments = []) {
  let first = "";
  let second = "";

  payments.forEach(p => {
    if (p.concept_type !== "Matricula") return;
    if (!p.semester) return;

    if (p.semester === 1) {
      first = Number(p.amount);
    } else if (p.semester === 2) {
      second = Number(p.amount);
    }
  });

  return {
    MATRICULA_1: first,
    MATRICULA_2: second,
  };
}

function resolveMonthlyPayments(payments = []) {
  const months = {
    ENERO: "",
    FEBRERO: "",
    MARZO: "",
    ABRIL: "",
    MAYO: "",
    JUNIO: "",
    JULIO: "",
    AGOSTO: "",
    SEPTIEMBRE: "",
    OCTUBRE: "",
    NOVIEMBRE: "",
    DICIEMBRE: "",
  };

  const monthMap = {
    1: "ENERO",
    2: "FEBRERO",
    3: "MARZO",
    4: "ABRIL",
    5: "MAYO",
    6: "JUNIO",
    7: "JULIO",
    8: "AGOSTO",
    9: "SEPTIEMBRE",
    10: "OCTUBRE",
    11: "NOVIEMBRE",
    12: "DICIEMBRE",
  };

  payments.forEach(p => {
    if (p.concept_type !== "Mensualidad") return;
    if (!p.month) return;

    const col = monthMap[p.month];
    months[col] = Number(p.amount);
  });

  return months;
}

export function buildStudentRow(student, payments) {
  const months = resolveMonthlyPayments(payments);
  const matricula = resolveMatricula(payments);
  return {
    nombre: student.name,
    correo: student.email,
    activo: student.active ? "Sí" : "No",
    telefono: student.phone,
    referencia: student.reference,

    matricula_1: matricula.MATRICULA_1,
    ...pickMonths(months, ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO"]),
    matricula_2: matricula.MATRICULA_2,
    ...pickMonths(months, ["JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"]),
  };
}


export function getStudentColumns(year) {
  return [
    { header: `NOMBRE MATRICULADO ${year}`, key: "nombre", width: 36 },
    { header: "CORREO", key: "correo", width: 28 },
    { header: "ACTIVO", key: "activo", width: 10 },
    { header: "TELÉFONO", key: "telefono", width: 15 },
    { header: "REFERENCIA", key: "referencia", width: 20 },

    { header: "MATRÍCULA", key: "matricula_1", width: 14 },
    { header: "ENERO", key: "ENERO" },
    { header: "FEBRERO", key: "FEBRERO" },
    { header: "MARZO", key: "MARZO" },
    { header: "ABRIL", key: "ABRIL" },
    { header: "MAYO", key: "MAYO" },
    { header: "JUNIO", key: "JUNIO" },

    { header: "MATRÍCULA", key: "matricula_2", width: 14 },
    { header: "JULIO", key: "JULIO" },
    { header: "AGOSTO", key: "AGOSTO" },
    { header: "SEPTIEMBRE", key: "SEPTIEMBRE" },
    { header: "OCTUBRE", key: "OCTUBRE" },
    { header: "NOVIEMBRE", key: "NOVIEMBRE" },
    { header: "DICIEMBRE", key: "DICIEMBRE" },
  ];
}

export function getStudentColumnsTemplate() {
  return [
    { header: `NOMBRE MATRICULADO`, key: "nombre", width: 36 },
    { header: "CORREO", key: "correo", width: 28 },
    { header: "ACTIVO", key: "activo", width: 10 },
    { header: "TELÉFONO", key: "telefono", width: 15 },
    { header: "REFERENCIA", key: "referencia", width: 20 },
    { header: "BECA", key: "scholarship", width: 10 },
    { header: "MONTO BECA", key: "scholarship_amount", width: 10 },
  ];
}

function pickMonths(all, keys) {
  return Object.fromEntries(keys.map(k => [k, all[k]]));
}

/*
      Style
*/

export function styleStudentSheet(sheet) {
  applyBaseStyle(sheet);
  styleHeader(sheet);
  applyTableBorders(sheet);
  alignColumns(sheet);
  //enhanceSheet(sheet);
  highlightMatriculaColumns(sheet);
  highlightActivoColumns(sheet);
  highlightCorreoColumns(sheet);
  addSheetTitle(sheet, "Asociacion de Padres del Sinem");
}

export function styleStudentSheetTemplate(sheet) {
  applyBaseStyle(sheet);
  styleHeader(sheet);
  applyTableBorders(sheet);
  alignColumnsTemplate(sheet);
  highlightActivoColumns(sheet);
  highlightCorreoColumns(sheet);
  addExample(sheet);
}

export function addSheetTitle(sheet, title) {
  sheet.insertRow(1, {});

  //const lastColumn = sheet.columnCount;
  //sheet.mergeCells(1, 1, 1, lastColumn);

  const cell = sheet.getCell("A1");
  cell.value = title;

  cell.font = {
    name: "Aptos Narrow",
    size: 16,
    bold: true,
    color: { argb: "000000" },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "46B1E1" },
  };

  sheet.getRow(1).height = 32;
}

function applyBaseStyle(sheet) {
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

function styleHeader(sheet) {
  const headerRow = sheet.getRow(1);

  headerRow.eachCell(cell => {
    cell.font = {
      name: "Aptos Narrow",
      size: 11,
      bold: false,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });
}

function applyTableBorders(sheet) {
  sheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell({ includeEmpty: false }, cell => {
      
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });
}

function alignColumns(sheet) {
  ["nombre", "correo", "referencia"].forEach(key => {
    sheet.getColumn(key).alignment = { horizontal: "left" };
  });

  [
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
    "matricula_1","matricula_2"
  ].forEach(key => {
    const col = sheet.getColumn(key);
    col.alignment = { horizontal: "right" };
    col.numFmt = '#,##0.00';
  });
}


function alignColumnsTemplate(sheet) {
  ["nombre", "correo", "referencia"].forEach(key => {
    sheet.getColumn(key).alignment = { horizontal: "left" };
  });
}

function highlightMatriculaColumns(sheet) {
  const matriculaKeys = ["matricula_1", "matricula_2"];

  matriculaKeys.forEach(key => {
    const column = sheet.getColumn(key);

    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber <= 1) return; // saltar título y headers

      if (cell.value !== null) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "8ED973" },
        };
      }
    });
  });
}

function highlightActivoColumns(sheet) {
  const activoKeys = ["activo"];

  activoKeys.forEach(key => {
    const column = sheet.getColumn(key);

    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber <= 2) return; // saltar título y headers

      if (cell.value !== "" && cell.value !== null) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F6C6AD" },
        };
        cell.font = {
          name: "Aptos Narrow",
          size: 11,
          bold: false,
          color: { argb: "467886" },
          underline: true,
        };
      }
    });
  });
}

function highlightCorreoColumns(sheet) {
  const emailColumn = sheet.getColumn("correo");

  emailColumn.eachCell((cell, rowNumber) => {
    if (rowNumber <= 2) return; // 1 = título, 2 = headers
    if (!cell.value) return;

    const email = cell.value;

    cell.value = {
      text: email,
      hyperlink: `mailto:${email}`,
    };

    cell.font = {
      ...cell.font,
      color: { argb: "FF0563C1" }, // azul típico de link
      underline: true,
    };
  });
}

/* 
  Import Excel
*/

function addExample(sheet){
  sheet.addRow({
    nombre: "Ejemplo",
    correo: "ejemplo@ejemplo.com",
    activo: "Si",
    telefono: "9999-9999",
    referencia: "Ejemplo",
    scholarship: "Si",
    scholarship_amount: "2000"
  })
}

export async function paseStudentFile(buffer,workbook){
    const realBuffer = Buffer.from(Uint8Array.from(buffer.buffer));

    await workbook.xlsx.load(realBuffer);

    const sheet = workbook.worksheets[0];
    
    const students = [];
    
    const headerMap = {};

    sheet.getRow(1).eachCell((cell, colNumber) => {
      headerMap[cell.value] = colNumber;
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const nombre = row.getCell(headerMap["NOMBRE MATRICULADO"])?.value;
      if (!nombre) return;

      const cellValue = row.getCell(headerMap["CORREO"])?.value;

      const correo =
        typeof cellValue === "string"
          ? cellValue
          : cellValue?.text ||
          cellValue?.result ||
          cellValue?.hyperlink ||
          "";
      
      students.push({
        nombre: nombre.toString().trim(),
        correo: correo,
        activo: row.getCell(headerMap["ACTIVO"])?.value?.toString() || "Si",
        telefono: row.getCell(headerMap["TELÉFONO"])?.value?.toString() || "",
        referencia: row.getCell(headerMap["REFERENCIA"])?.value?.toString() || "",
        scholarship: row.getCell(headerMap["BECA"])?.value?.toString() || "No",
        scholarship_amount: Number(
            row.getCell(headerMap["MONTO BECA"])?.value || 0
        )    
      });
      //console.log("studs ", JSON.stringify(students));
    });

    return students;
}