import { getAssetPath } from "./utils.js";
const cmToPoints = (cm) => cm * 28.3465;
const cmToColumnWidth = (cm) => cm * 5.5;

export function styleReceiptSheet(workbook,sheet,payment){
    getReceiptColumns(sheet);
    addImages(workbook,sheet);
    getHeader(sheet);
    getDataInfo(sheet,payment);
    getAmount(sheet,payment);
    ReceiptCellHeigth(sheet);
}

function getReceiptColumns(sheet){
    sheet.columns = [
    { width: cmToColumnWidth(4.91) },
    { width: cmToColumnWidth(4.91) },
    { width: 18 },
    { width: 22 },
    { width: 6 },
  ];
}

function addImages(workbook,sheet){
  const assets = {
    sinem: getAssetPath("sinem-mini.jpg"),
    avas: getAssetPath("avas-sinem.jpg"),
    ministerio: getAssetPath("ministerio.jpg"),
  };

  const logos = {
    left: workbook.addImage({ filename: assets.avas, extension: "jpg" }),
    right: workbook.addImage({ filename: assets.sinem, extension: "jpg" }),
    bottom: workbook.addImage({ filename: assets.ministerio, extension: "jpg" }),
  };

  sheet.addImage(logos.left, {
    tl: { col: 0.5, row: 1.5 },
    br: { col: 1, row: 5 },
    ext: { width: 60, height: 100 },
  });

  sheet.addImage(logos.right, {
    tl: { col: 1, row: 1.5 },
    br: { col: 2, row: 5 },
    ext: { width: 60, height: 120 },
  });

  sheet.addImage(logos.bottom, {
    tl: { col: 0.5, row: 26.5 },
    br: { col: 2, row: 34.5 },
    editAs: "absolute",
  });
}

function getHeader(sheet){
    const headerLines = [
    ["A6:B6", "Comprobante ASEMPA"],
    ["A7:B7", "San José, Pavas, Costa Rica"],
    ["A8:B8", "Cédula jurídica 3-002-554051"],
    ["A9:B9", "Teléfono 2296-9021 / 2291-9298"],
  ];

  headerLines.forEach(([range, text]) => {
    sheet.mergeCells(range);
    const cell = sheet.getCell(range.split(":")[0]);
    cell.value = text;
    cell.font = { name: "Aptos Narrow", size: 22, bold: true };
    cell.alignment = { horizontal: "center" };
  });
  const email = "asempasinempavas@hotmail.com";
  sheet.mergeCells("A10:B10");
  sheet.getCell("A10").value = {
    text: email,
    hyperlink: `mailto:${email}`,
  };
  sheet.getCell("A10").font = { name: "Aptos Narrow", size: 20, bold: true };
  sheet.getCell("A10").alignment = { horizontal: "center" };

  sheet.mergeCells("A11:B11");
}

function getDataInfo(sheet,payment){
    const date = new Intl.DateTimeFormat("es-CR")
        .format(new Date(payment.date));

    const invoiceNumber = `${payment.year}-${String(payment.sequence).padStart(5, "0")}`;

    const rows = [
        ["A12", "Factura #:", "B12", invoiceNumber],
        ["A14", "Fecha:", "B14", date],
        ["A16", "Tipo de Pago", "B16", payment.concept_type],
        ["A18", "Alumno:", "B18", payment.student_name],
        ["A20", "Modo de Pago", "B20", payment.payment_method],
        ["A22", "Curso:", "B22", payment.division_name],
        ["A24", "Comprobante #:", "B24", ""],
    ];

    rows.forEach(([labelCell, label, valueCell, value]) => {
        sheet.getCell(labelCell).value = label;
        sheet.getCell(labelCell).font = { name: "Aptos Narrow", size: 22, bold: true };

        sheet.getCell(valueCell).value = value;
        if (label === "Curso:" || label === "Modo de Pago"){
          sheet.getCell(valueCell).font = { name: "Aptos Narrow", size: 20 };
        } else if (label === "Alumno:"){
          sheet.getCell(valueCell).font = { name: "Aptos Narrow", size: 16 };
        } else{
          if (label === "Factura #:" || label === "Tipo de Pago" ){
            sheet.getCell(valueCell).font = { name: "Aptos Narrow", size: 22, bold: true };
          } else{
            sheet.getCell(valueCell).font = { name: "Aptos Narrow", size: 22};
          }
        }
        sheet.getCell(valueCell).alignment = { horizontal: "right" };
    });
}

function getAmount(sheet,payment){
    sheet.getCell("A26").value = "Monto total:";
    sheet.getCell("A26").font = { name: "Aptos Narrow", size: 22, bold: true };

    sheet.getCell("B26").value = payment.amount;
    sheet.getCell("B26").font = { name: "Aptos Narrow", size: 22 };
    sheet.getCell("B26").numFmt = '"₡"#,##0.00';
    sheet.getCell("B26").alignment = { horizontal: "right" };
}

function ReceiptCellHeigth(sheet) {
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