import { createWorkbook, createWorksheet, saveWorkbook } from "./utils.js";

function getCashRegisterColumns() {
    return [
        { header: "FECHA", key: "date", width: 12 },
        { header: "TIPO MOV", key: "type", width: 15 },
        { header: "N° DE DOC", key: "doc", width: 15 },
        { header: "PROVEEDOR / CLIENTE", key: "subject", width: 35 },
        { header: "DETALLE", key: "detail", width: 35 },
        { header: "RUBRO", key: "rubro", width: 12 },
        { header: "MATRÍCULAS", key: "matricula", width: 15 },
        { header: "MENSUALIDADES", key: "mensualidad", width: 15 },
        { header: "PAGO PROFESORES", key: "pagoProf", width: 15 },
        { header: "PAGO ADMINISTRATIVO", key: "pagoAdmn", width: 18 },
        { header: "OTROS PAGOS", key: "otros", width: 15 },
        { header: "SALDO", key: "saldo", width: 15 },
    ];
}

export async function exportCashRegisterReportToExcel(data) {
    if (!data) return { success: false, error: "No hay datos para exportar." };

    const { transactions, initialBalance } = data;
    const workbook = createWorkbook();
    const sheet = workbook.addWorksheet("Reporte de Caja", {
        views: [{ showGridLines: false, zoomScale: 100 }],
    });

    // 1. Title Rows
    sheet.mergeCells("A1:L1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "ASOCIACION ESCUELA DE MUSICA DE PAVAS ASEMPA.";
    titleCell.font = { name: "Aptos Narrow", size: 10, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };

    sheet.mergeCells("A2:L2");
    const accountCell = sheet.getCell("A2");
    accountCell.value = "CUENTA: #";
    accountCell.font = { name: "Aptos Narrow", size: 10, bold: true };
    accountCell.alignment = { vertical: "middle", horizontal: "left" };

    // 2. Headers (Row 5)
    const columns = getCashRegisterColumns();
    const headerRow = sheet.getRow(5);
    
    // Set column headers manually to control styling better
    columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col.header;
        sheet.getColumn(index + 1).width = col.width;
        sheet.getColumn(index + 1).key = col.key;
    });

    // Style Headers
    headerRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 8, bold: true };
        cell.alignment = { vertical: "bottom", horizontal: "center", wrapText: true };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        
        // Default Blue Background
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "94DCF8" }, // Light Blue
        };
    });

    
    // Peach color for Expenses headers
    ["pagoProf", "pagoAdmn", "otros"].forEach(key => {
        const colIndex = columns.findIndex(c => c.key === key) + 1;
        if (colIndex > 0) {
            headerRow.getCell(colIndex).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F7C7AC" }, // Peach / Orange
            };
        }
    });

    ["matricula", "mensualidad"].forEach(key => {
        const colIndex = columns.findIndex(c => c.key === key) + 1;
        if (colIndex > 0) {
            headerRow.getCell(colIndex).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "66CCFF" }, // Peach / Orange
            };
        }
    });

    // 3. Initial Balance Row (Row 6)
    const initialRow = sheet.addRow({
        detail: "SALDO ANTERIOR",
        saldo: initialBalance
    });

    // Style Initial Balance Row
    initialRow.font = { name: "Arial", size: 9, bold: true };
    
    initialRow.getCell("detail").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "44B3E1" }, // Blue background for "SALDO ANTERIOR"
    };
    initialRow.getCell("saldo").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "44B3E1" }, // Blue background for Amount
    };
    initialRow.getCell("saldo").numFmt = '"₡"#,##0.00';
    initialRow.height = 20;
    
    initialRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "44B3E1" }, // Blue
        };
    });

    // Apply borders to Initial Row (columns 1-12)
    for(let i=1; i<=12; i++) {
        initialRow.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    }

    // 4. Data Rows
    let currentBalance = initialBalance;

    transactions.forEach((r) => {
        let matricula = null;
        let mensualidad = null;
        let pagoProf = null;
        let pagoAdmn = null;
        let otros = null;
        let rubro = r.rubro; 

        if (r.rubro === "Ingreso") {
            if (r.concept === "Matricula") matricula = r.amount;
            else if (r.concept === "Mensualidad") mensualidad = r.amount;
            else otros = r.amount; // Should usually be empty for income unless specified
            currentBalance += r.amount;
        } else {
            if (r.status === "PagoProfesor") pagoProf = r.amount;
            else if (r.status === "PagoAdministrativo") pagoAdmn = r.amount;
            else otros = r.amount;
            currentBalance -= r.amount;
        }

        const rowValues = {
            date: r.date ? new Date(r.date) : null,
            type: r.tipo,
            doc: r.year ? `${r.year}-${String(r.sequence).padStart(5, "0")}` : "",
            subject: r.subject,
            detail: r.detail,
            rubro: rubro,
            matricula: matricula,
            mensualidad: mensualidad,
            pagoProf: pagoProf,
            pagoAdmn: pagoAdmn,
            otros: otros,
            saldo: currentBalance
        };

        const row = sheet.addRow(rowValues);
        
        // Row Styles
        row.font = { name: "Aptos Narrow", size: 10 };
        row.alignment = { vertical: "middle", horizontal: "left" };
        
        // Center specific columns
        ["date", "doc", "rubro"].forEach(key => {
            row.getCell(key).alignment = { vertical: "middle", horizontal: "center" };
        });

        // Currency format
        ["matricula", "mensualidad", "pagoProf", "pagoAdmn", "otros", "saldo"].forEach(key => {
            const cell = row.getCell(key);
            cell.numFmt = '"₡"#,##0.00';
            cell.alignment = { vertical: "middle", horizontal: "right" };
        });
        
        // Date format
        row.getCell("date").numFmt = 'dd/mm/yyyy';

        // Borders
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });
    
    const filePath = await saveWorkbook(workbook, "Guardar Reporte Caja", `Reporte_Caja_${new Date().toISOString().split('T')[0]}.xlsx`);

    if (!filePath) return { success: false };

    return { success: true, path: filePath };
}

export async function exportDelayByMonthReport(data) {
    if (!data) return { success: false, error: "No hay datos para exportar." };

    const { reportData, stats } = data;
    const workbook = createWorkbook();
    const sheet = workbook.addWorksheet("Morosidad por Mes", {
        views: [{ showGridLines: false, zoomScale: 100 }],
    });

    // 1. Headers (Row 3)
    const headerRow = sheet.getRow(3);
    headerRow.values = [
        "Total Estudiantes",
        stats.activeStudents,
        "Pagos",
        "% Pagos",
        "%Morosidad"
    ];

    // Style Headers
    headerRow.eachCell((cell, colNumber) => {
        cell.font = { name: "Aptos Narrow", size: 11, color: { argb: "FFFFFF" } }; // White Text
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "153D64" }, // blue
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Special alignment for "Total Estudiantes"
    headerRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };

    // Column Widths
    sheet.getColumn(1).width = 25; // Concept
    sheet.getColumn(2).width = 20; // Expected
    sheet.getColumn(3).width = 20; // Paid
    sheet.getColumn(4).width = 15; // % Paid
    sheet.getColumn(5).width = 15; // % Delinquency

    // 2. Data Rows
    reportData.forEach((item) => {
        const row = sheet.addRow([
            item.concept,
            item.total,
            item.paid === '-' ? 0 : item.paid,
            parseFloat(item.pPaid) / 100, // Convert "98.6%" string to 0.986 number
            parseFloat(item.pDelin) / 100  // Convert "1.38%" string to 0.0138 number
        ]);

        // Style Data Row
        row.font = { name: "Aptos Narrow", size: 11};
        row.alignment = { vertical: "middle", horizontal: "center" };

        // Concept Column (A)
        const conceptCell = row.getCell(1);
        conceptCell.alignment = { vertical: "middle", horizontal: "left" };
        conceptCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "153D64" }, // blue
        };
        conceptCell.font = { name: "Aptos Narrow", size: 11, color: { argb: "FFFFFF" }, bold: true }; // White Text

        // Currency Format (B, C)
        row.getCell(2).numFmt = '"₡"#,##0';
        row.getCell(3).numFmt = '"₡"#,##0';

        // Percentage Format (D, E)
        row.getCell(4).numFmt = '0.0%';
        row.getCell(5).numFmt = '0.0%';

        // Borders
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });

    const filePath = await saveWorkbook(workbook, "Guardar Reporte Morosidad", `Reporte_Morosidad_${new Date().toISOString().split('T')[0]}.xlsx`);

    if (!filePath) return { success: false };

    return { success: true, path: filePath };
}

export async function exportDelayByTeacherReport(data) {
    if (!data) return { success: false, error: "No hay datos para exportar." };

    const { teachers, students, payments, selectedMonth } = data;
    
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = monthNames[parseInt(selectedMonth) - 1];

    const workbook = createWorkbook();
    const sheet = workbook.addWorksheet("Morosidad por Profesor", {
        views: [{ showGridLines: false, zoomScale: 100 }],
    });

    // Column Widths
    sheet.getColumn(1).width = 35; // Profesores
    sheet.getColumn(2).width = 20; // MATRICULADO 2026
    sheet.getColumn(3).width = 20; // Pagaron [Month]
    sheet.getColumn(4).width = 20; // No Pagaron [Month]
    sheet.getColumn(5).width = 15; // % Pagaron

    // 1. Header Row (Row 3)
    const headerRow = sheet.getRow(3);
    headerRow.values = [
        "Profesores",
        "MATRICULADO 2026",
        `Pagaron ${monthName}`,
        `No Pagaron ${monthName}`,
        "% Pagaron"
    ];

    // Style Headers
    headerRow.eachCell((cell) => {
        cell.font = { name: "Aptos Narrow", size: 10, bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9E1F2" }, // Light blue
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Build data structure: group students by teacher
    const divisionToTeacher = {};
    teachers.forEach(t => {
        if (t.division_id) {
            divisionToTeacher[t.division_id] = t.name;
        }
    });

    // Group students by teacher based on their payments
    const teacherData = {};
    payments.forEach(p => {
        const teacherName = divisionToTeacher[p.division_id];
        if (teacherName && p.student_id) {
            if (!teacherData[teacherName]) {
                teacherData[teacherName] = {
                    students: new Map(), // student_id -> student data
                };
            }
            
            if (!teacherData[teacherName].students.has(p.student_id)) {
                const student = students.find(s => s.id === p.student_id);
                teacherData[teacherName].students.set(p.student_id, {
                    name: student ? student.name : 'Desconocido',
                    paidInMonth: false,
                });
            }
            
            // Check if this payment is for the selected month
            if (p.month === parseInt(selectedMonth) && p.concept_type === "Mensualidad") {
                teacherData[teacherName].students.get(p.student_id).paidInMonth = true;
            }
        }
    });

    // 2. Data Rows
    let totalMatriculados = 0;
    let totalPagaron = 0;
    let totalNoPagaron = 0;

    Object.keys(teacherData).sort().forEach(teacherName => {
        const data = teacherData[teacherName];
        const studentsArray = Array.from(data.students.values());
        const matriculados = studentsArray.length;
        const pagaron = studentsArray.filter(s => s.paidInMonth).length;
        const noPagaron = matriculados - pagaron;
        
        totalMatriculados += matriculados;
        totalPagaron += pagaron;
        totalNoPagaron += noPagaron;

        const percentage = matriculados > 0 ? pagaron / matriculados : 0;

        // Teacher summary row
        const teacherRow = sheet.addRow([
            teacherName,
            matriculados,
            pagaron,
            noPagaron,
            percentage
        ]);

        teacherRow.font = { name: "Aptos Narrow", size: 10, bold: true };
        teacherRow.alignment = { vertical: "middle", horizontal: "left" };
        teacherRow.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E7E6E6" }, // Light gray
        };

        // Center numeric columns
        [2, 3, 4, 5].forEach(colNum => {
            teacherRow.getCell(colNum).alignment = { vertical: "middle", horizontal: "center" };
        });

        // Percentage format
        teacherRow.getCell(5).numFmt = '0%';
        teacherRow.getCell(5).alignment = { vertical: "middle", horizontal: "center" };

        teacherRow.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });

    // 3. Total general row
    const totalPercentage = totalMatriculados > 0 ? totalPagaron / totalMatriculados : 0;
    const totalRow = sheet.addRow([
        "Total general",
        totalMatriculados,
        totalPagaron,
        totalNoPagaron,
        totalPercentage
    ]);

    totalRow.font = { name: "Aptos Narrow", size: 10, bold: true };
    totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E1F2" }, // Light blue
    };
    
    // Center numeric columns
    [2, 3, 4].forEach(colNum => {
        totalRow.getCell(colNum).alignment = { vertical: "middle", horizontal: "center" };
    });

    // Percentage format
    totalRow.getCell(5).numFmt = '0%';
    totalRow.getCell(5).alignment = { vertical: "middle", horizontal: "center" };

    totalRow.eachCell((cell) => {
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // 4. Add AutoFilter to the teacher column
    sheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: totalRow.number, column: 5 }
    };

    const filePath = await saveWorkbook(
        workbook,
        "Guardar Reporte Morosidad por Profesor",
        `Reporte_Morosidad_Profesor_${monthName}_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    if (!filePath) return { success: false };

    return { success: true, path: filePath };
}
