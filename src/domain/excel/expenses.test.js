import { describe, it, expect, vi } from 'vitest';
import { getExpensesColumns, styleExpensesSheet } from './expenses.js';

function createMockSheet(rows = [{}, {}]) {
  const mockCells = [];

  function createCell() {
    const cell = {
      value: null,
      font: {},
      border: {},
      fill: {},
      alignment: {},
    };
    mockCells.push(cell);
    return cell;
  }

  function createMockRow(rowNumber) {
    const cells = Array.from({ length: 6 }, () => createCell());
    return {
      eachCell: vi.fn((optsOrCb, maybeCb) => {
        const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
        if (cb) cells.forEach(cell => cb(cell, cell._colNumber || 1));
      }),
    };
  }

  const mockRows = rows.map((_, i) => createMockRow(i + 1));

  const columnStore = {};
  const trackedCells = {};

  const mockSheet = {
    getColumn: vi.fn((key) => {
      if (!columnStore[key]) {
        columnStore[key] = {
          numFmt: '',
          alignment: {},
          eachCell: vi.fn((optsOrCb, maybeCb) => {
            const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
            if (!trackedCells[key]) trackedCells[key] = [];
            trackedCells[key].forEach((cell, idx) => {
              if (cb) cb(cell, idx + 1);
            });
          }),
        };
      }
      return columnStore[key];
    }),

    getRow: vi.fn((rowNumber) => {
      const idx = rowNumber - 1;
      if (!mockRows[idx]) {
        mockRows[idx] = createMockRow(rowNumber);
      }
      return mockRows[idx];
    }),

    eachRow: vi.fn((optsOrCb, maybeCb) => {
      const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
      if (cb) mockRows.forEach((row, idx) => cb(row, idx + 1));
    }),

    addRow: vi.fn(),

    _columnStore: columnStore,
    _mockCells: mockCells,
    _mockRows: mockRows,
    _trackedCells: trackedCells,
  };

  return mockSheet;
}

describe('getExpensesColumns', () => {
  it('returns 4 column definitions', () => {
    const cols = getExpensesColumns();
    expect(cols).toHaveLength(4);
  });

  it('has date, detail, reference, and amount keys', () => {
    const cols = getExpensesColumns();
    const keys = cols.map(c => c.key);
    expect(keys).toEqual(['date', 'detail', 'reference', 'amount']);
  });

  it('has Spanish headers Fecha, Detalle, Referencia, Monto', () => {
    const cols = getExpensesColumns();
    const headers = cols.map(c => c.header);
    expect(headers).toEqual(['Fecha', 'Detalle', 'Referencia', 'Monto']);
  });

  it('each column has header, key, and width properties', () => {
    const cols = getExpensesColumns();
    cols.forEach(col => {
      expect(col).toHaveProperty('header');
      expect(col).toHaveProperty('key');
      expect(col).toHaveProperty('width');
    });
  });

  it('amount column has narrow width', () => {
    const cols = getExpensesColumns();
    const amountCol = cols.find(c => c.key === 'amount');
    expect(amountCol.width).toBe(10.25);
  });

  it('detail column is the widest', () => {
    const cols = getExpensesColumns();
    const detailCol = cols.find(c => c.key === 'detail');
    expect(detailCol.width).toBe(30);
  });
});

describe('styleExpensesSheet', () => {
  it('sets currency format on the amount column', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    const amountCol = sheet._columnStore['amount'];
    expect(amountCol.numFmt).toBe('"₡"#,##0.00');
  });

  it('calls getColumn with "amount"', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    expect(sheet.getColumn).toHaveBeenCalledWith('amount');
  });

  it('calls eachRow to apply borders and font', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    expect(sheet.eachRow).toHaveBeenCalled();
  });

  it('applies thin borders to cells via eachRow', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    const eachRowCb = sheet.eachRow.mock.calls[0][1];
    const mockRow = {
      eachCell: vi.fn((optsOrCb, maybeCb) => {
        const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
        const cell = { border: {}, font: {} };
        if (cb) cb(cell, 1);
        expect(cell.border).toEqual({
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        });
        expect(cell.font.name).toBe('Aptos Narrow');
        expect(cell.font.size).toBe(11);
      }),
    };
    eachRowCb(mockRow, 1);
  });

  it('styles header row with white bold text', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    expect(sheet.getRow).toHaveBeenCalledWith(1);
    const headerRow = sheet._mockRows[0];
    expect(headerRow.eachCell).toHaveBeenCalled();
    const lastCall = headerRow.eachCell.mock.calls.length - 1;
    const headerEachCellCb = headerRow.eachCell.mock.calls[lastCall][0];
    const cell = { font: {}, fill: {}, alignment: {} };
    headerEachCellCb(cell);
    expect(cell.font).toEqual({
      name: 'Aptos Narrow',
      color: { argb: 'FFFFFF' },
      bold: true,
    });
  });

  it('applies dark blue fill to header cells', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    const headerRow = sheet._mockRows[0];
    const lastCall = headerRow.eachCell.mock.calls.length - 1;
    const headerEachCellCb = headerRow.eachCell.mock.calls[lastCall][0];
    const cell = { font: {}, fill: {}, alignment: {} };
    headerEachCellCb(cell);
    expect(cell.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    });
  });

  it('applies left+middle alignment to header cells', () => {
    const sheet = createMockSheet();
    styleExpensesSheet(sheet);
    const headerRow = sheet._mockRows[0];
    const lastCall = headerRow.eachCell.mock.calls.length - 1;
    const headerEachCellCb = headerRow.eachCell.mock.calls[lastCall][0];
    const cell = { font: {}, fill: {}, alignment: {} };
    headerEachCellCb(cell);
    expect(cell.alignment).toEqual({
      horizontal: 'left',
      vertical: 'middle',
    });
  });
});
