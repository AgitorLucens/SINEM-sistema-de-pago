export function getExpensesColumns() {
  return [
    { header: "Fecha", key: "date", width: 10.25 },
    { header: "Detalle", key: "detail", width: 30 },
    { header: "Referencia", key: "reference", width: 28 },
    { header: "Monto", key: "amount", width: 10.25 },
  ];
}

export function styleExpensesSheet(sheet) {
  const tableBorder = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  /* Column formats */
  sheet.getColumn("amount").numFmt = '"₡"#,##0.00';

  /* Bordes + fuente */
  sheet.eachRow({ includeEmpty: true }, row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.border = tableBorder;
      cell.font = {
        name: "Aptos Narrow",
        size: 11,
      };
    });
  });
  //header
  sheet.getRow(1).eachCell(cell => {
    cell.font = {
      name: "Aptos Narrow",
      color: { argb: "FFFFFF" },
      bold: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    cell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };
  });
}