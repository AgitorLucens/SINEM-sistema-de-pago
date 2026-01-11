export function getPaymentsColumns() {
    return [
    { header: "# Factura", key: "consecutive", width: 10.25 },
    { header: "Fecha", key: "date", width: 10.25 },
    { header: "Nombre Estudiante", key: "student", width: 24 },
    { header: "Modo de Pago", key: "method", width: 12 },
    { header: "Curso", key: "division", width: 10.25 },
    { header: "Tipo de pago", key: "concept", width: 14 },
    { header: "Monto", key: "amount", width: 10.25 },
    { header: "# Comprobante", key: "receipt", width: 12.95 },
  ];
}

export function buildPaymentRow(payment){
    return {
      consecutive: `${payment.year}-${String(payment.sequence).padStart(5, '0')}`,
      date: new Intl.DateTimeFormat("es-CR").format(new Date(payment.date)),
      student: payment.student_name ?? "",
      concept: payment.concept_type,
      division: payment.division_name,
      method: payment.payment_method,
      amount: Number(payment.amount),
      receipt: payment.receipt,
    }
}

/*
    Styles
*/

export function stylePaymentSheet(sheet){
  addPaymentsTotal(sheet);
  applyPaymentBorders(sheet); 
  applyPaymentHeaderStyle(sheet);
}

function alignColumns(sheet){
    sheet.getColumn("amount").numFmt = '"₡"#,##0.00';
    sheet.getColumn("amount").alignment = { horizontal: "right" };
    sheet.getColumn("date").alignment = { horizontal: "center" };
    sheet.getColumn("consecutive").alignment = { horizontal: "center" };

    sheet.getRow(1).alignment = { horizontal: "center" };
}

function addPaymentsTotal(sheet){
    const totalRow = sheet.addRow({
        concept: "TOTAL",
        amount: {
            formula: `SUM(G2:G${sheet.rowCount})`,
        },
    });

    totalRow.font = { bold: true };
    totalRow.getCell("amount").numFmt = '"₡"#,##0.00';
}

function applyPaymentBorders(sheet) {
  const tableBorder = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  sheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell({ includeEmpty: false }, cell => {
      cell.border = tableBorder;
      cell.font = { name: "Aptos Narrow" };
    });
  });
}

function applyPaymentHeaderStyle(sheet) {
  sheet.getRow(1).eachCell(cell => {
    if (cell.value === "" || cell.value === null) return
    cell.font = {
      name: "Aptos Narrow",
      color: { argb: "FFFFFF" },
      bold: true,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF808080" },
    };
    cell.alignment = {horizontal: "left"};
  });
}
