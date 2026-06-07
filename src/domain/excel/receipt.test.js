import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./utils.js', () => ({
  getAssetPath: vi.fn((filename) => `assets/${filename}`),
}));

import { getAssetPath } from './utils.js';
import { styleReceiptSheet } from './receipt.js';

function createMockSheet() {
  const cells = {};
  const rows = {};

  return {
    columns: [],
    mergeCells: vi.fn(),
    addImage: vi.fn(),

    getCell: vi.fn((addr) => {
      if (!cells[addr]) {
        cells[addr] = {
          value: null,
          font: {},
          alignment: {},
          border: {},
          fill: {},
          numFmt: '',
        };
      }
      return cells[addr];
    }),

    getRow: vi.fn((num) => {
      if (!rows[num]) {
        rows[num] = { height: 0 };
      }
      return rows[num];
    }),

    _cells: cells,
    _rows: rows,
  };
}

function createMockWorkbook() {
  let id = 1;
  return {
    addImage: vi.fn(() => id++),
    addWorksheet: vi.fn(() => createMockSheet()),
    xlsx: { writeFile: vi.fn() },
    worksheets: [],
  };
}

const samplePayment = {
  year: 2025,
  sequence: 1,
  date: '2025-01-15',
  concept_type: 'Mensualidad',
  student_name: 'Juan Perez',
  payment_method: 'Efectivo',
  division_name: 'Piano',
  amount: 25000,
};

let sheet;
let workbook;

beforeEach(() => {
  vi.clearAllMocks();
  sheet = createMockSheet();
  workbook = createMockWorkbook();
});

describe('styleReceiptSheet', () => {
  it('sets column widths (5 columns)', () => {
    styleReceiptSheet(workbook, sheet, samplePayment);

    expect(sheet.columns).toHaveLength(5);
    expect(sheet.columns[0].width).toBeCloseTo(4.91 * 5.5, 2);
    expect(sheet.columns[1].width).toBeCloseTo(4.91 * 5.5, 2);
    expect(sheet.columns[2].width).toBe(18);
    expect(sheet.columns[3].width).toBe(22);
    expect(sheet.columns[4].width).toBe(6);
  });

  it('adds three images to workbook (avas, sinem, ministerio)', () => {
    styleReceiptSheet(workbook, sheet, samplePayment);

    expect(workbook.addImage).toHaveBeenCalledTimes(3);
    expect(workbook.addImage).toHaveBeenCalledWith({ filename: 'assets/avas-sinem.jpg', extension: 'jpg' });
    expect(workbook.addImage).toHaveBeenCalledWith({ filename: 'assets/sinem-mini.jpg', extension: 'jpg' });
    expect(workbook.addImage).toHaveBeenCalledWith({ filename: 'assets/ministerio.jpg', extension: 'jpg' });
  });

  it('adds three images to sheet with correct positions', () => {
    styleReceiptSheet(workbook, sheet, samplePayment);

    expect(sheet.addImage).toHaveBeenCalledTimes(3);

    expect(sheet.addImage).toHaveBeenCalledWith(1, {
      tl: { col: 0.5, row: 1.5 },
      br: { col: 1, row: 5 },
      ext: { width: 60, height: 100 },
    });

    expect(sheet.addImage).toHaveBeenCalledWith(2, {
      tl: { col: 1, row: 1.5 },
      br: { col: 2, row: 5 },
      ext: { width: 60, height: 120 },
    });

    expect(sheet.addImage).toHaveBeenCalledWith(3, {
      tl: { col: 0.5, row: 26.5 },
      br: { col: 2, row: 34.5 },
      editAs: 'absolute',
    });
  });

  it('calls getAssetPath with correct filenames', () => {
    styleReceiptSheet(workbook, sheet, samplePayment);

    expect(getAssetPath).toHaveBeenCalledWith('sinem-mini.jpg');
    expect(getAssetPath).toHaveBeenCalledWith('avas-sinem.jpg');
    expect(getAssetPath).toHaveBeenCalledWith('ministerio.jpg');
  });

  describe('header section', () => {
    it('merges cells for header lines A6:B6 through A9:B9', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet.mergeCells).toHaveBeenCalledWith('A6:B6');
      expect(sheet.mergeCells).toHaveBeenCalledWith('A7:B7');
      expect(sheet.mergeCells).toHaveBeenCalledWith('A8:B8');
      expect(sheet.mergeCells).toHaveBeenCalledWith('A9:B9');
    });

    it('sets header text values and styles', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      const a6 = sheet._cells['A6'];
      expect(a6.value).toBe('Comprobante ASEMPA');
      expect(a6.font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
      expect(a6.alignment).toEqual({ horizontal: 'center' });

      const a7 = sheet._cells['A7'];
      expect(a7.value).toBe('San José, Pavas, Costa Rica');
      expect(a7.font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });

      const a8 = sheet._cells['A8'];
      expect(a8.value).toBe('Cédula jurídica 3-002-554051');

      const a9 = sheet._cells['A9'];
      expect(a9.value).toBe('Teléfono 2296-9021 / 2291-9298');
    });

    it('sets email cell with hyperlink', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet.mergeCells).toHaveBeenCalledWith('A10:B10');
      const a10 = sheet._cells['A10'];
      expect(a10.value).toEqual({
        text: 'asempasinempavas@hotmail.com',
        hyperlink: 'mailto:asempasinempavas@hotmail.com',
      });
      expect(a10.font).toEqual({ name: 'Aptos Narrow', size: 20, bold: true });
      expect(a10.alignment).toEqual({ horizontal: 'center' });
    });

    it('merges empty row A11:B11', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet.mergeCells).toHaveBeenCalledWith('A11:B11');
    });
  });

  describe('data info section', () => {
    it('sets invoice number with zero-padded sequence', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      const b12 = sheet._cells['B12'];
      expect(b12.value).toBe('2025-00001');
    });

    it('sets date in Spanish locale format', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      const b14 = sheet._cells['B14'];
      expect(b14.value).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });

    it('sets concept type, student name, payment method, division', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B16'].value).toBe('Mensualidad');
      expect(sheet._cells['B18'].value).toBe('Juan Perez');
      expect(sheet._cells['B20'].value).toBe('Efectivo');
      expect(sheet._cells['B22'].value).toBe('Piano');
    });

    it('sets empty string for comprobante #', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B24'].value).toBe('');
    });

    it('styles label cells with bold Aptos Narrow size 22', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['A12'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
      expect(sheet._cells['A14'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
      expect(sheet._cells['A18'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
    });

    it('styles Factura # and Tipo de Pago value cells as bold size 22', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B12'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
      expect(sheet._cells['B16'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
    });

    it('styles Curso and Modo de Pago value cells as size 20 (not bold)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B22'].font).toEqual({ name: 'Aptos Narrow', size: 20 });
      expect(sheet._cells['B20'].font).toEqual({ name: 'Aptos Narrow', size: 20 });
    });

    it('styles Alumno value cell as size 16', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B18'].font).toEqual({ name: 'Aptos Narrow', size: 16 });
    });

    it('styles date value cell as size 22 (not bold)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B14'].font).toEqual({ name: 'Aptos Narrow', size: 22 });
    });

    it('aligns all value cells to the right', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B12'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B14'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B16'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B18'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B20'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B22'].alignment).toEqual({ horizontal: 'right' });
      expect(sheet._cells['B24'].alignment).toEqual({ horizontal: 'right' });
    });
  });

  describe('amount section', () => {
    it('sets label "Monto total:" in cell A26', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['A26'].value).toBe('Monto total:');
      expect(sheet._cells['A26'].font).toEqual({ name: 'Aptos Narrow', size: 22, bold: true });
    });

    it('sets amount value in cell B26', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B26'].value).toBe(25000);
    });

    it('applies currency format to amount cell', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B26'].numFmt).toBe('"₡"#,##0.00');
    });

    it('aligns amount to the right', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B26'].alignment).toEqual({ horizontal: 'right' });
    });

    it('sets amount font to size 22 not bold', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._cells['B26'].font).toEqual({ name: 'Aptos Narrow', size: 22 });
    });
  });

  describe('row heights', () => {
    it('sets row 1-5 heights to ~24.66pt (0.87cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      for (let i = 1; i <= 5; i++) {
        expect(sheet._rows[i].height).toBeCloseTo(0.87 * 28.3465, 1);
      }
    });

    it('sets row 6-9, 11-12, 14, 16, 19-22, 24-26 heights to ~28.63pt (1.01cm)', () => {
      const expected = 1.01 * 28.3465;
      styleReceiptSheet(workbook, sheet, samplePayment);

      const headerRows = [6, 7, 8, 9, 11, 12, 14, 16, 19, 20, 21, 22, 24, 25, 26];
      headerRows.forEach(r => {
        expect(sheet._rows[r].height).toBeCloseTo(expected, 1);
      });
    });

    it('sets row 10 height to ~26.36pt (0.93cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._rows[10].height).toBeCloseTo(0.93 * 28.3465, 1);
    });

    it('sets row 13 height to ~15.02pt (0.53cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._rows[13].height).toBeCloseTo(0.53 * 28.3465, 1);
    });

    it('sets row 17 height to ~20.98pt (0.74cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._rows[17].height).toBeCloseTo(0.74 * 28.3465, 1);
    });

    it('sets row 18 height to ~36.0pt (1.27cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._rows[18].height).toBeCloseTo(1.27 * 28.3465, 1);
    });

    it('sets row 23 height to ~20.98pt (0.74cm)', () => {
      styleReceiptSheet(workbook, sheet, samplePayment);

      expect(sheet._rows[23].height).toBeCloseTo(0.74 * 28.3465, 1);
    });
  });

  describe('edge cases', () => {
    it('handles null year and sequence with "null-null" invoice', () => {
      const partialPayment = {
        year: null,
        sequence: null,
        date: '2025-01-15',
        concept_type: '',
        student_name: '',
        payment_method: '',
        division_name: '',
        amount: 0,
      };

      expect(() => styleReceiptSheet(workbook, sheet, partialPayment)).not.toThrow();

      expect(sheet._cells['B12'].value).toBe('null-0null');
      expect(sheet._cells['B16'].value).toBe('');
      expect(sheet._cells['B18'].value).toBe('');
      expect(sheet._cells['B20'].value).toBe('');
      expect(sheet._cells['B22'].value).toBe('');
    });

    it('handles zero amount', () => {
      const zeroPayment = { ...samplePayment, amount: 0 };
      styleReceiptSheet(workbook, sheet, zeroPayment);
      expect(sheet._cells['B26'].value).toBe(0);
    });
  });
});
