import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportCashRegisterReportToExcel,
  exportDelayByMonthReport,
  exportDelayByTeacherReport,
} from './reports.js';

vi.mock('./utils.js', () => ({
  createWorkbook: vi.fn(),
  saveWorkbook: vi.fn(),
}));

import { createWorkbook, saveWorkbook } from './utils.js';

function createMockCell() {
  return {
    value: null,
    font: null,
    fill: null,
    alignment: null,
    border: null,
    numFmt: null,
  };
}

function createMockRow(number) {
  const cells = {};
  const row = {
    number,
    font: null,
    alignment: null,
    fill: null,
    height: null,
    _values: null,

    get values() { return row._values; },
    set values(arr) {
      row._values = arr;
      if (Array.isArray(arr)) {
        arr.forEach((val, idx) => {
          const key = String(idx + 1);
          if (!cells[key]) cells[key] = createMockCell();
          cells[key].value = val;
        });
      }
    },

    getCell: vi.fn((col) => {
      const key = String(col);
      if (!cells[key]) cells[key] = createMockCell();
      return cells[key];
    }),

    eachCell: vi.fn((optsOrCb, maybeCb) => {
      const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
      if (typeof cb === 'function') {
        Object.keys(cells)
          .sort((a, b) => {
            const na = parseInt(a, 10);
            const nb = parseInt(b, 10);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
            return a.localeCompare(b);
          })
          .forEach((key) => cb(cells[key]));
      }
    }),

    _cells: cells,
  };
  return row;
}

function createMockSheet() {
  const cellsByRef = {};
  let rowCounter = 1;
  const rows = {};
  const columns = {};

  return {
    mergeCells: vi.fn(),
    autoFilter: null,

    getCell: vi.fn((ref) => {
      if (!cellsByRef[ref]) cellsByRef[ref] = createMockCell();
      return cellsByRef[ref];
    }),

    getRow: vi.fn((num) => {
      if (!rows[num]) rows[num] = createMockRow(num);
      return rows[num];
    }),

    getColumn: vi.fn((num) => {
      if (!columns[num]) columns[num] = {
        width: null,
        key: null,
        numFmt: null,
        alignment: null,
        eachCell: vi.fn(),
      };
      return columns[num];
    }),

    addRow: vi.fn((data) => {
      const rowNum = rowCounter++;
      const row = createMockRow(rowNum);
      rows[rowNum] = row;
      return row;
    }),

    _cells: cellsByRef,
    _rows: rows,
    _columns: columns,
  };
}

let mockSheet;
let mockWorkbook;

beforeEach(() => {
  vi.clearAllMocks();
  mockSheet = createMockSheet();
  mockWorkbook = { addWorksheet: vi.fn(() => mockSheet) };
  createWorkbook.mockReturnValue(mockWorkbook);
  saveWorkbook.mockResolvedValue('/fake/report.xlsx');
});

// ─── exportCashRegisterReportToExcel ───────────────────────────

describe('exportCashRegisterReportToExcel', () => {
  it('returns error when data is null', async () => {
    const result = await exportCashRegisterReportToExcel(null);
    expect(result).toEqual({ success: false, error: 'No hay datos para exportar.' });
    expect(createWorkbook).not.toHaveBeenCalled();
  });

  it('returns success false when saveWorkbook returns null', async () => {
    saveWorkbook.mockResolvedValue(null);
    const result = await exportCashRegisterReportToExcel({
      transactions: [],
      initialBalance: 0,
    });
    expect(result).toEqual({ success: false });
  });

  it('returns success true with path when save succeeds', async () => {
    saveWorkbook.mockResolvedValue('/out/caja.xlsx');
    const result = await exportCashRegisterReportToExcel({
      transactions: [],
      initialBalance: 0,
    });
    expect(result).toEqual({ success: true, path: '/out/caja.xlsx' });
  });

  it('creates workbook and sheet with correct name and options', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    expect(createWorkbook).toHaveBeenCalledTimes(1);
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Reporte de Caja', {
      views: [{ showGridLines: false, zoomScale: 100 }],
    });
  });

  it('sets title cell A1 with association name and bold font', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    const cellA1 = mockSheet._cells['A1'];
    expect(cellA1.value).toBe('ASOCIACION ESCUELA DE MUSICA DE PAVAS ASEMPA.');
    expect(cellA1.font).toEqual({ name: 'Aptos Narrow', size: 10, bold: true });
    expect(cellA1.alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
  });

  it('sets account cell A2 with account number and bold font', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    const cellA2 = mockSheet._cells['A2'];
    expect(cellA2.value).toBe('CUENTA: #');
    expect(cellA2.font).toEqual({ name: 'Aptos Narrow', size: 10, bold: true });
    expect(cellA2.alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
  });

  it('merges cells A1:L1 and A2:L2', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    expect(mockSheet.mergeCells).toHaveBeenCalledWith('A1:L1');
    expect(mockSheet.mergeCells).toHaveBeenCalledWith('A2:L2');
  });

  it('sets up header row at row 5 with correct column count and styles', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    expect(mockSheet.getRow).toHaveBeenCalledWith(5);
    const headerRow = mockSheet._rows[5];
    expect(headerRow).toBeTruthy();
    expect(Object.keys(headerRow._cells)).toHaveLength(12);
  });

  it('sets column headers, widths, and keys', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    for (let i = 1; i <= 12; i++) {
      expect(mockSheet._columns[i]).toBeTruthy();
      expect(mockSheet._columns[i].width).toBeGreaterThan(0);
      expect(mockSheet._columns[i].key).toBeTruthy();
    }
  });

  it('applies light blue fill to all header cells by default', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    const headerRow = mockSheet._rows[5];
    for (let i = 1; i <= 12; i++) {
      const cell = headerRow._cells[String(i)];
      expect(cell.font).toEqual({ name: 'Arial', size: 8, bold: true });
      expect(cell.alignment).toEqual({ vertical: 'bottom', horizontal: 'center', wrapText: true });
      expect(cell.border).toEqual({
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      });
    }
    expect(headerRow._cells['1'].fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '94DCF8' },
    });
  });

  it('applies peach fill to expense column headers pagoProf (col 9), pagoAdmn (col 10), otros (col 11)', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    const headerRow = mockSheet._rows[5];
    [9, 10, 11].forEach((col) => {
      expect(headerRow._cells[String(col)].fill).toEqual({
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F7C7AC' },
      });
    });
  });

  it('applies blue fill to matricula (col 7) and mensualidad (col 8) headers', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 0 });
    const headerRow = mockSheet._rows[5];
    [7, 8].forEach((col) => {
      expect(headerRow._cells[String(col)].fill).toEqual({
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '66CCFF' },
      });
    });
  });

  it('adds initial balance row with SALDO ANTERIOR and blue styling', async () => {
    await exportCashRegisterReportToExcel({
      transactions: [],
      initialBalance: 5000,
    });
    expect(mockSheet.addRow).toHaveBeenNthCalledWith(1, {
      detail: 'SALDO ANTERIOR',
      saldo: 5000,
    });

    const initialRow = mockSheet.addRow.mock.results[0].value;
    expect(initialRow.font).toEqual({ name: 'Arial', size: 9, bold: true });
    expect(initialRow.height).toBe(20);

    const detailCell = initialRow._cells['detail'];
    const saldoCell = initialRow._cells['saldo'];
    expect(detailCell.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '44B3E1' },
    });
    expect(saldoCell.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '44B3E1' },
    });
    expect(saldoCell.numFmt).toBe('"₡"#,##0.00');

    for (let i = 1; i <= 12; i++) {
      expect(initialRow._cells[String(i)].border).toEqual({
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      });
    }
  });

  it('processes income transactions and updates running balance', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 10000, tipo: 'Efectivo', date: '2025-03-01', year: 2025, sequence: 1, subject: 'Juan', detail: 'Pago matricula' },
      { rubro: 'Ingreso', concept: 'Mensualidad', amount: 15000, tipo: 'Transferencia', date: '2025-03-05', year: 2025, sequence: 2, subject: 'Maria', detail: 'Pago mensual' },
    ];

    await exportCashRegisterReportToExcel({
      transactions,
      initialBalance: 5000,
    });

    expect(mockSheet.addRow).toHaveBeenNthCalledWith(2, expect.objectContaining({
      matricula: 10000,
      mensualidad: null,
      otros: null,
      saldo: 15000,
      rubro: 'Ingreso',
      type: 'Efectivo',
    }));

    expect(mockSheet.addRow).toHaveBeenNthCalledWith(3, expect.objectContaining({
      mensualidad: 15000,
      matricula: null,
      otros: null,
      saldo: 30000,
      rubro: 'Ingreso',
      type: 'Transferencia',
    }));
  });

  it('processes expense transactions and decreases running balance', async () => {
    const transactions = [
      { rubro: 'Gasto', status: 'PagoProfesor', amount: 8000, tipo: 'Egreso', date: '2025-03-10', year: 2025, sequence: 3, subject: 'Prof A', detail: 'Pago marzo' },
      { rubro: 'Gasto', status: 'PagoAdministrativo', amount: 5000, tipo: 'Egreso', date: '2025-03-15', year: 2025, sequence: 4, subject: 'Admin', detail: 'Salario' },
    ];

    await exportCashRegisterReportToExcel({
      transactions,
      initialBalance: 20000,
    });

    expect(mockSheet.addRow).toHaveBeenNthCalledWith(2, expect.objectContaining({
      pagoProf: 8000,
      pagoAdmn: null,
      otros: null,
      saldo: 12000,
    }));

    expect(mockSheet.addRow).toHaveBeenNthCalledWith(3, expect.objectContaining({
      pagoAdmn: 5000,
      pagoProf: null,
      otros: null,
      saldo: 7000,
    }));
  });

  it('maps unknown expense status to otros column', async () => {
    const transactions = [
      { rubro: 'Gasto', status: 'OtroGasto', amount: 3000, tipo: 'Egreso', date: '2025-03-10', subject: 'X', detail: 'X' },
    ];

    await exportCashRegisterReportToExcel({
      transactions,
      initialBalance: 10000,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(expect.objectContaining({
      otros: 3000,
      pagoProf: null,
      pagoAdmn: null,
      saldo: 7000,
    }));
  });

  it('maps unknown income concept to otros column', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Donacion', amount: 5000, tipo: 'Efectivo', date: '2025-03-10', subject: 'X', detail: 'X' },
    ];

    await exportCashRegisterReportToExcel({
      transactions,
      initialBalance: 0,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(expect.objectContaining({
      otros: 5000,
      matricula: null,
      mensualidad: null,
      saldo: 5000,
    }));
  });

  it('applies currency format to monetary cells and date format to date cell', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 10000, tipo: 'Efectivo', date: '2025-03-01', year: 2025, sequence: 1, subject: 'Juan', detail: 'Pago' },
    ];

    await exportCashRegisterReportToExcel({ transactions, initialBalance: 0 });

    const dataRow = mockSheet.addRow.mock.results[1].value;
    ['matricula', 'mensualidad', 'pagoProf', 'pagoAdmn', 'otros', 'saldo'].forEach((key) => {
      expect(dataRow._cells[key].numFmt).toBe('"₡"#,##0.00');
      expect(dataRow._cells[key].alignment).toEqual({ vertical: 'middle', horizontal: 'right' });
    });
    expect(dataRow._cells['date'].numFmt).toBe('dd/mm/yyyy');
  });

  it('applies thin borders to all data cells via eachCell', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 10000, tipo: 'Efectivo', date: '2025-03-01', subject: 'Juan', detail: 'Pago' },
    ];

    await exportCashRegisterReportToExcel({ transactions, initialBalance: 0 });

    const dataRow = mockSheet.addRow.mock.results[1].value;
    expect(dataRow.eachCell).toHaveBeenCalled();
  });

  it('formats document number as year-padded sequence', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 1000, tipo: 'X', date: '2025-03-01', year: 2025, sequence: 42, subject: 'X', detail: 'X' },
    ];

    await exportCashRegisterReportToExcel({ transactions, initialBalance: 0 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(expect.objectContaining({
      doc: '2025-00042',
    }));
  });

  it('handles missing date by setting null', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 1000, tipo: 'X', subject: 'X', detail: 'X' },
    ];

    await exportCashRegisterReportToExcel({ transactions, initialBalance: 0 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(expect.objectContaining({
      date: null,
    }));
  });

  it('handles missing year or sequence with empty doc string', async () => {
    const transactions = [
      { rubro: 'Ingreso', concept: 'Matricula', amount: 1000, tipo: 'X', date: '2025-03-01', subject: 'X', detail: 'X' },
    ];

    await exportCashRegisterReportToExcel({ transactions, initialBalance: 0 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(expect.objectContaining({
      doc: '',
    }));
  });

  it('works with empty transactions array (only initial balance row)', async () => {
    await exportCashRegisterReportToExcel({ transactions: [], initialBalance: 1000 });

    expect(mockSheet.addRow).toHaveBeenCalledTimes(1);
    expect(mockSheet.addRow).toHaveBeenCalledWith({
      detail: 'SALDO ANTERIOR',
      saldo: 1000,
    });
  });
});

// ─── exportDelayByMonthReport ──────────────────────────────────

describe('exportDelayByMonthReport', () => {
  it('returns error when data is null', async () => {
    const result = await exportDelayByMonthReport(null);
    expect(result).toEqual({ success: false, error: 'No hay datos para exportar.' });
    expect(createWorkbook).not.toHaveBeenCalled();
  });

  it('returns success false when saveWorkbook returns null', async () => {
    saveWorkbook.mockResolvedValue(null);
    const result = await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 0 },
    });
    expect(result).toEqual({ success: false });
  });

  it('returns success true with path on valid data', async () => {
    saveWorkbook.mockResolvedValue('/out/morosidad.xlsx');
    const result = await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 0 },
    });
    expect(result).toEqual({ success: true, path: '/out/morosidad.xlsx' });
  });

  it('creates workbook and sheet with correct name and options', async () => {
    await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 0 },
    });
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Morosidad por Mes', {
      views: [{ showGridLines: false, zoomScale: 100 }],
    });
  });

  it('sets header row with stats values', async () => {
    const stats = { activeStudents: 150 };
    await exportDelayByMonthReport({
      reportData: [],
      stats,
    });

    const headerRow = mockSheet._rows[3];
    expect(headerRow.values).toEqual([
      'Total Estudiantes',
      150,
      'Pagos',
      '% Pagos',
      '%Morosidad',
    ]);
  });

  it('styles header cells with dark blue fill, white text, and borders', async () => {
    await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 50 },
    });

    const headerRow = mockSheet._rows[3];
    Object.keys(headerRow._cells).forEach((key) => {
      const cell = headerRow._cells[key];
      expect(cell.font).toEqual({ name: 'Aptos Narrow', size: 11, color: { argb: 'FFFFFF' } });
      expect(cell.fill).toEqual({
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '153D64' },
      });
      expect(cell.border).toEqual({
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      });
    });
    // Total Estudiantes cell (1) has left alignment; the rest center
    expect(headerRow._cells['1'].alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
    expect(headerRow._cells['2'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
    expect(headerRow._cells['3'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
  });

  it('aligns Total Estudiantes cell to left', async () => {
    await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 50 },
    });

    const headerRow = mockSheet._rows[3];
    expect(headerRow._cells['1'].alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
  });

  it('sets column widths', async () => {
    await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 0 },
    });

    expect(mockSheet._columns[1].width).toBe(25);
    expect(mockSheet._columns[2].width).toBe(20);
    expect(mockSheet._columns[3].width).toBe(20);
    expect(mockSheet._columns[4].width).toBe(15);
    expect(mockSheet._columns[5].width).toBe(15);
  });

  it('adds data rows with converted percentage values', async () => {
    const reportData = [
      { concept: 'Matrícula 2026', total: 50000, paid: 45000, pPaid: '90.0', pDelin: '10.0' },
    ];

    await exportDelayByMonthReport({
      reportData,
      stats: { activeStudents: 100 },
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith([
      'Matrícula 2026',
      50000,
      45000,
      0.9,
      0.1,
    ]);
  });

  it('handles "-" paid values as 0', async () => {
    const reportData = [
      { concept: 'Matrícula', total: 50000, paid: '-', pPaid: '0', pDelin: '100' },
    ];

    await exportDelayByMonthReport({
      reportData,
      stats: { activeStudents: 100 },
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith([
      'Matrícula',
      50000,
      0,
      0,
      1,
    ]);
  });

  it('styles data rows with correct fonts, alignment, and formats', async () => {
    const reportData = [
      { concept: 'Matrícula', total: 100000, paid: 80000, pPaid: '80.0', pDelin: '20.0' },
    ];

    await exportDelayByMonthReport({ reportData, stats: { activeStudents: 50 } });

    const dataRow = mockSheet.addRow.mock.results[0].value;
    expect(dataRow.font).toEqual({ name: 'Aptos Narrow', size: 11 });
    expect(dataRow.alignment).toEqual({ vertical: 'middle', horizontal: 'center' });

    const conceptCell = dataRow._cells['1'];
    expect(conceptCell.alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
    expect(conceptCell.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '153D64' },
    });
    expect(conceptCell.font).toEqual({ name: 'Aptos Narrow', size: 11, color: { argb: 'FFFFFF' }, bold: true });

    expect(dataRow._cells['2'].numFmt).toBe('"₡"#,##0');
    expect(dataRow._cells['3'].numFmt).toBe('"₡"#,##0');
    expect(dataRow._cells['4'].numFmt).toBe('0.0%');
    expect(dataRow._cells['5'].numFmt).toBe('0.0%');

    expect(dataRow.eachCell).toHaveBeenCalled();
  });

  it('works with empty reportData array', async () => {
    await exportDelayByMonthReport({
      reportData: [],
      stats: { activeStudents: 0 },
    });

    expect(mockSheet.addRow).not.toHaveBeenCalled();
    expect(saveWorkbook).toHaveBeenCalled();
  });

  it('processes multiple data rows', async () => {
    const reportData = [
      { concept: 'A', total: 100, paid: 90, pPaid: '90.0', pDelin: '10.0' },
      { concept: 'B', total: 200, paid: 180, pPaid: '90.0', pDelin: '10.0' },
    ];

    await exportDelayByMonthReport({ reportData, stats: { activeStudents: 50 } });

    expect(mockSheet.addRow).toHaveBeenCalledTimes(2);
  });
});

// ─── exportDelayByTeacherReport ────────────────────────────────

describe('exportDelayByTeacherReport', () => {
  it('returns error when data is null', async () => {
    const result = await exportDelayByTeacherReport(null);
    expect(result).toEqual({ success: false, error: 'No hay datos para exportar.' });
    expect(createWorkbook).not.toHaveBeenCalled();
  });

  it('returns success false when saveWorkbook returns null', async () => {
    saveWorkbook.mockResolvedValue(null);
    const result = await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 3,
    });
    expect(result).toEqual({ success: false });
  });

  it('returns success with path on valid data', async () => {
    saveWorkbook.mockResolvedValue('/out/teacher.xlsx');
    const result = await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 3,
    });
    expect(result).toEqual({ success: true, path: '/out/teacher.xlsx' });
  });

  it('creates workbook and sheet with correct name and view options', async () => {
    await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 1,
    });
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Morosidad por Profesor', {
      views: [{ showGridLines: false, zoomScale: 100 }],
    });
  });

  it('sets column widths', async () => {
    await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 1,
    });

    expect(mockSheet._columns[1].width).toBe(35);
    expect(mockSheet._columns[2].width).toBe(20);
    expect(mockSheet._columns[3].width).toBe(20);
    expect(mockSheet._columns[4].width).toBe(20);
    expect(mockSheet._columns[5].width).toBe(15);
  });

  it('sets header row with correct month name in column headers', async () => {
    await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 5,
    });

    const headerRow = mockSheet._rows[3];
    expect(headerRow.values).toEqual([
      'Profesores',
      'MATRICULADO 2026',
      'Pagaron Mayo',
      'No Pagaron Mayo',
      '% Pagaron',
    ]);
  });

  it('styles header row', async () => {
    await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 3,
    });

    const headerRow = mockSheet._rows[3];
    Object.keys(headerRow._cells).forEach((key) => {
      const cell = headerRow._cells[key];
      expect(cell.font).toEqual({ name: 'Aptos Narrow', size: 10, bold: true });
      expect(cell.alignment).toEqual({ vertical: 'middle', horizontal: 'center', wrapText: true });
      expect(cell.fill).toEqual({
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' },
      });
      expect(cell.border).toEqual({
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      });
    });
  });

  it('calculates per-teacher statistics correctly', async () => {
    const teachers = [
      { id: 1, name: 'Ana', division_id: 101 },
      { id: 2, name: 'Carlos', division_id: 102 },
    ];
    const students = [
      { id: 1, name: 'Juan' },
      { id: 2, name: 'Maria' },
      { id: 3, name: 'Pedro' },
    ];
    const payments = [
      { division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' },
      { division_id: 101, student_id: 2, month: 3, concept_type: 'Mensualidad' },
      { division_id: 101, student_id: 3, month: 2, concept_type: 'Mensualidad' },
      { division_id: 102, student_id: 1, month: 3, concept_type: 'Mensualidad' },
      { division_id: 102, student_id: 2, month: 3, concept_type: 'Matricula' },
    ];

    await exportDelayByTeacherReport({
      teachers,
      students,
      payments,
      selectedMonth: 3,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Ana', 3, 2, 1, 2 / 3]);
    expect(mockSheet.addRow).toHaveBeenCalledWith(['Carlos', 2, 1, 1, 0.5]);
  });

  it('adds total general row with correct totals', async () => {
    const teachers = [
      { id: 1, name: 'Ana', division_id: 101 },
    ];
    const students = [
      { id: 1, name: 'Juan' },
      { id: 2, name: 'Maria' },
    ];
    const payments = [
      { division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' },
      { division_id: 101, student_id: 2, month: 2, concept_type: 'Mensualidad' },
    ];

    await exportDelayByTeacherReport({
      teachers,
      students,
      payments,
      selectedMonth: 3,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 2, 1, 1, 0.5]);
  });

  it('styles total general row with light blue fill and bold font', async () => {
    const teachers = [{ id: 1, name: 'A', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [{ division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' }];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    const lastRow = mockSheet.addRow.mock.results[1].value;
    expect(lastRow.font).toEqual({ name: 'Aptos Narrow', size: 10, bold: true });
    expect(lastRow.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' },
    });

    expect(lastRow._cells['2'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
    expect(lastRow._cells['3'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
    expect(lastRow._cells['4'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
    expect(lastRow._cells['5'].numFmt).toBe('0%');
    expect(lastRow._cells['5'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
  });

  it('styles teacher rows with bold font and gray background on first cell', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [{ division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' }];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    const teacherRow = mockSheet.addRow.mock.results[0].value;
    expect(teacherRow.font).toEqual({ name: 'Aptos Narrow', size: 10, bold: true });
    expect(teacherRow.alignment).toEqual({ vertical: 'middle', horizontal: 'left' });
    expect(teacherRow._cells['1'].fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E7E6E6' },
    });

    [2, 3, 4].forEach((col) => {
      expect(teacherRow._cells[String(col)].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });
    });
    expect(teacherRow._cells['5'].numFmt).toBe('0%');
    expect(teacherRow._cells['5'].alignment).toEqual({ vertical: 'middle', horizontal: 'center' });

    expect(teacherRow.eachCell).toHaveBeenCalled();
  });

  it('sets autoFilter from row 3 to total row', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [{ division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' }];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.autoFilter).toBeTruthy();
    expect(mockSheet.autoFilter.from).toEqual({ row: 3, column: 1 });
    expect(mockSheet.autoFilter.to.column).toBe(5);
    expect(typeof mockSheet.autoFilter.to.row).toBe('number');
  });

  it('handles teacher without division_id (skipped from grouping)', async () => {
    const teachers = [
      { id: 1, name: 'Ana', division_id: 101 },
      { id: 2, name: 'SinDivision' },
    ];
    const students = [{ id: 1, name: 'X' }];
    const payments = [
      { division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' },
    ];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Ana', 1, 1, 0, 1]);
  });

  it('handles payment without student_id (skipped, so no teacher rows)', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [
      { division_id: 101, month: 3, concept_type: 'Mensualidad' },
    ];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.addRow).toHaveBeenCalledTimes(1);
    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 0, 0, 0, 0]);
  });

  it('handles student not found in students array (sets Desconocido)', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 2, name: 'Maria' }];
    const payments = [
      { division_id: 101, student_id: 999, month: 3, concept_type: 'Mensualidad' },
    ];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Ana', 1, 1, 0, 1]);
  });

  it('excludes payments not matching selected month or concept_type', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [
      { division_id: 101, student_id: 1, month: 2, concept_type: 'Mensualidad' },
      { division_id: 101, student_id: 1, month: 3, concept_type: 'Matricula' },
    ];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Ana', 1, 0, 1, 0]);
  });

  it('handles unknown division_id (no matching teacher)', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [
      { division_id: 999, student_id: 1, month: 3, concept_type: 'Mensualidad' },
    ];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: 3 });

    expect(mockSheet.addRow).toHaveBeenCalledTimes(1);
    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 0, 0, 0, 0]);
  });

  it('works with empty payments array', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];

    await exportDelayByTeacherReport({
      teachers,
      students,
      payments: [],
      selectedMonth: 3,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 0, 0, 0, 0]);
  });

  it('works with empty teachers array', async () => {
    await exportDelayByTeacherReport({
      teachers: [],
      students: [],
      payments: [],
      selectedMonth: 3,
    });

    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 0, 0, 0, 0]);
  });

  it('handles selectedMonth as numeric string', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];
    const students = [{ id: 1, name: 'X' }];
    const payments = [{ division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' }];

    await exportDelayByTeacherReport({ teachers, students, payments, selectedMonth: '03' });

    const headerRow = mockSheet._rows[3];
    expect(headerRow.values).toEqual([
      'Profesores',
      'MATRICULADO 2026',
      'Pagaron Marzo',
      'No Pagaron Marzo',
      '% Pagaron',
    ]);
    expect(mockSheet.addRow).toHaveBeenCalledWith(['Ana', 1, 1, 0, 1]);
  });

  it('handles zero matriculados for a teacher (percentage 0, no teacher rows created)', async () => {
    const teachers = [{ id: 1, name: 'Ana', division_id: 101 }];

    await exportDelayByTeacherReport({
      teachers,
      students: [],
      payments: [],
      selectedMonth: 3,
    });

    expect(mockSheet.addRow).toHaveBeenCalledTimes(1);
    expect(mockSheet.addRow).toHaveBeenCalledWith(['Total general', 0, 0, 0, 0]);
  });

  it('sorts teachers alphabetically', async () => {
    const teachers = [
      { id: 1, name: 'Zoraida', division_id: 101 },
      { id: 2, name: 'Ana', division_id: 102 },
      { id: 3, name: 'Beatriz', division_id: 103 },
    ];
    const payments = [
      { division_id: 101, student_id: 1, month: 3, concept_type: 'Mensualidad' },
      { division_id: 102, student_id: 1, month: 3, concept_type: 'Mensualidad' },
      { division_id: 103, student_id: 1, month: 3, concept_type: 'Mensualidad' },
    ];
    const students = [{ id: 1, name: 'X' }];

    await exportDelayByTeacherReport({
      teachers,
      students,
      payments,
      selectedMonth: 3,
    });

    const calls = mockSheet.addRow.mock.calls;
    const teacherNames = calls
      .filter(([rowData]) => rowData[0] !== 'Total general')
      .map(([rowData]) => rowData[0]);
    expect(teacherNames).toEqual(['Ana', 'Beatriz', 'Zoraida']);
  });
});
