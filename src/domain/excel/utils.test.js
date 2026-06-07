import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getPath: vi.fn(() => '/mock-user-data'),
  },
  dialog: {
    showSaveDialog: vi.fn(),
  },
}));

import { app, dialog } from 'electron';
import path from 'path';
import ExcelJS from 'exceljs';
import {
  getAssetPath,
  createWorksheet,
  saveWorkbook,
  createWorkbook,
  applyBaseStyle,
} from './utils.js';

describe('getAssetPath', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns dev path when app is not packaged', () => {
    app.isPackaged = false;
    const result = getAssetPath('logo.png');
    expect(result).toBe(path.join(process.cwd(), 'src', 'ui', 'assets', 'logo.png'));
  });

  it('returns production path when app is packaged', () => {
    const orig = process.resourcesPath;
    process.resourcesPath = 'C:\\resources';
    app.isPackaged = true;
    const result = getAssetPath('excel-generator.exe');
    expect(result).toBe(path.join('C:\\resources', '/assets/', 'excel-generator.exe'));
    process.resourcesPath = orig;
  });
});

describe('createWorkbook', () => {
  it('returns a new ExcelJS Workbook instance', () => {
    const wb = createWorkbook();
    expect(wb).toBeInstanceOf(ExcelJS.Workbook);
  });

  it('returns a new instance each call', () => {
    const a = createWorkbook();
    const b = createWorkbook();
    expect(a).not.toBe(b);
  });
});

describe('createWorksheet', () => {
  let mockWorkbook;
  let mockFuncColumn;

  beforeEach(() => {
    mockFuncColumn = vi.fn((year) => [
      { header: 'Year', key: 'year' },
      { header: 'Value', key: 'value' },
    ]);

    mockWorkbook = {
      addWorksheet: vi.fn((name, opts) => ({ name, opts, columns: null })),
    };
  });

  it('calls funcColumn with the given year', () => {
    createWorksheet(mockWorkbook, 2025, mockFuncColumn);
    expect(mockFuncColumn).toHaveBeenCalledWith(2025);
  });

  it('adds a worksheet with grid lines hidden and provided name', () => {
    const sheet = createWorksheet(mockWorkbook, 2025, mockFuncColumn, 'MySheet');
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('MySheet', {
      views: [{ showGridLines: false }],
    });
    expect(sheet.name).toBe('MySheet');
  });

  it('uses default name "sheet" when no name given', () => {
    const sheet = createWorksheet(mockWorkbook, 2025, mockFuncColumn);
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('sheet', {
      views: [{ showGridLines: false }],
    });
  });

  it('assigns columns returned by funcColumn to the sheet', () => {
    const expectedCols = [
      { header: 'Year', key: 'year' },
      { header: 'Value', key: 'value' },
    ];
    const sheet = createWorksheet(mockWorkbook, 2025, mockFuncColumn);
    expect(sheet.columns).toEqual(expectedCols);
  });

  it('returns the created sheet', () => {
    const sheet = createWorksheet(mockWorkbook, 2025, mockFuncColumn);
    expect(sheet).toBeDefined();
    expect(sheet.columns).toHaveLength(2);
  });

  it('works with numeric year 0', () => {
    const sheet = createWorksheet(mockWorkbook, 0, mockFuncColumn);
    expect(mockFuncColumn).toHaveBeenCalledWith(0);
    expect(sheet.columns).toHaveLength(2);
  });

  it('works with string year', () => {
    const sheet = createWorksheet(mockWorkbook, '2025', mockFuncColumn);
    expect(mockFuncColumn).toHaveBeenCalledWith('2025');
  });

  it('handles funcColumn returning empty columns array', () => {
    const emptyFn = vi.fn(() => []);
    const sheet = createWorksheet(mockWorkbook, 2025, emptyFn);
    expect(sheet.columns).toEqual([]);
  });
});

describe('saveWorkbook', () => {
  let mockWorkbook;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkbook = {
      xlsx: { writeFile: vi.fn() },
    };
  });

  it('returns filePath when dialog succeeds', async () => {
    dialog.showSaveDialog.mockResolvedValue({
      canceled: false,
      filePath: 'C:\\output\\report.xlsx',
    });

    const result = await saveWorkbook(mockWorkbook, 'Save Report', 'report.xlsx');

    expect(dialog.showSaveDialog).toHaveBeenCalledWith({
      title: 'Save Report',
      defaultPath: path.join('report.xlsx'),
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    expect(mockWorkbook.xlsx.writeFile).toHaveBeenCalledWith('C:\\output\\report.xlsx');
    expect(result).toBe('C:\\output\\report.xlsx');
  });

  it('returns null when dialog is canceled', async () => {
    dialog.showSaveDialog.mockResolvedValue({ canceled: true, filePath: undefined });

    const result = await saveWorkbook(mockWorkbook, 'Title', 'file.xlsx');

    expect(dialog.showSaveDialog).toHaveBeenCalled();
    expect(mockWorkbook.xlsx.writeFile).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null when filePath is falsy even if not canceled', async () => {
    dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '' });

    const result = await saveWorkbook(mockWorkbook, 'Title', 'file.xlsx');

    expect(mockWorkbook.xlsx.writeFile).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null when filePath is null', async () => {
    dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: null });

    const result = await saveWorkbook(mockWorkbook, 'Title', 'file.xlsx');
    expect(result).toBeNull();
  });

  it('propagates error when writeFile fails', async () => {
    dialog.showSaveDialog.mockResolvedValue({
      canceled: false,
      filePath: 'C:\\out.xlsx',
    });
    const writeErr = new Error('Disk full');
    mockWorkbook.xlsx.writeFile.mockRejectedValue(writeErr);

    await expect(saveWorkbook(mockWorkbook, 'Title', 'file.xlsx')).rejects.toThrow('Disk full');
  });
});

describe('applyBaseStyle', () => {
  function createMockCell() {
    return {
      font: null,
      alignment: null,
    };
  }

  function createMockRow(cellCount = 3) {
    const cells = Array.from({ length: cellCount }, () => createMockCell());
    return {
      eachCell: (opts, fn) => {
        if (typeof opts === 'function') {
          fn = opts;
        }
        cells.forEach((cell) => fn(cell, { includeEmpty: true }));
      },
      cellCount,
    };
  }

  function createMockSheet(rowCount = 2, cellsPerRow = 3) {
    const rows = Array.from({ length: rowCount }, () => createMockRow(cellsPerRow));
    return {
      eachRow: (opts, fn) => {
        if (typeof opts === 'function') {
          fn = opts;
        }
        rows.forEach((row) => fn(row, { includeEmpty: true }));
      },
      rowCount,
    };
  }

  it('applies Aptos Narrow font and center alignment to every cell', () => {
    const sheet = createMockSheet(2, 3);
    applyBaseStyle(sheet);

    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        expect(cell.font).toEqual({
          name: 'Aptos Narrow',
          size: 11,
        });
        expect(cell.alignment).toEqual({
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        });
      });
    });
  });

  it('handles a sheet with a single row', () => {
    const sheet = createMockSheet(1, 2);
    applyBaseStyle(sheet);

    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        expect(cell.font.name).toBe('Aptos Narrow');
        expect(cell.alignment.horizontal).toBe('center');
      });
    });
  });

  it('handles a sheet with a single cell', () => {
    const sheet = createMockSheet(1, 1);
    applyBaseStyle(sheet);

    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        expect(cell.font.name).toBe('Aptos Narrow');
        expect(cell.alignment.vertical).toBe('middle');
      });
    });
  });

  it('handles a sheet with no rows', () => {
    const sheet = createMockSheet(0, 0);
    expect(() => applyBaseStyle(sheet)).not.toThrow();
  });

  it('handles a sheet with rows that have no cells', () => {
    const row = createMockRow(0);
    const sheet = {
      eachRow: (opts, fn) => {
        fn(row, { includeEmpty: true });
      },
    };
    expect(() => applyBaseStyle(sheet)).not.toThrow();
  });

  it('overwrites existing font and alignment on cells', () => {
    const cell = { font: { name: 'Arial', size: 10 }, alignment: { vertical: 'top' } };
    const row = {
      eachCell: (_opts, fn) => fn(cell),
    };
    const sheet = {
      eachRow: (_opts, fn) => fn(row),
    };

    applyBaseStyle(sheet);

    expect(cell.font).toEqual({ name: 'Aptos Narrow', size: 11 });
    expect(cell.alignment).toEqual({
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    });
  });
});
