import { describe, it, expect, vi } from 'vitest';
import {
  groupPaymentsByStudentAndYear,
  buildStudentRow,
  getStudentColumns,
  getStudentColumnsTemplate,
  styleStudentSheet,
  styleStudentSheetTemplate,
  addSheetTitle,
  paseStudentFile,
} from './students.js';

/* ───── mock sheet factory ───── */

function createMockSheet(rowCount = 3) {
  const columnStore = {};
  const trackedCells = {};
  const allCells = [];

  function createCell(initialValue = null) {
    const cell = {
      value: initialValue,
      font: {},
      border: {},
      fill: {},
      alignment: {},
    };
    allCells.push(cell);
    return cell;
  }

  function createMockRow(rowNumber) {
    const cells = Array.from({ length: 20 }, () => createCell());
    return {
      eachCell: vi.fn((optsOrCb, maybeCb) => {
        const cb = typeof optsOrCb === 'function' ? optsOrCb : maybeCb;
        if (cb) cells.forEach((cell, i) => cb(cell, i + 1));
      }),
      height: undefined,
    };
  }

  const mockRows = Array.from({ length: rowCount }, (_, i) => createMockRow(i + 1));

  const sheet = {
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
    insertRow: vi.fn(),

    getCell: vi.fn((ref) => {
      const cell = createCell();
      return cell;
    }),

    columnCount: 20,

    _columnStore: columnStore,
    _allCells: allCells,
    _mockRows: mockRows,
    _trackedCells: trackedCells,
  };

  return sheet;
}

/* ────────────────────────────────
   Existing tests
   ──────────────────────────────── */

describe('groupPaymentsByStudentAndYear', () => {
  it('groups payments by student_id for a given year', () => {
    const payments = [
      { student_id: 1, year: 2024, amount: 5000 },
      { student_id: 1, year: 2024, amount: 10000 },
      { student_id: 2, year: 2024, amount: 5000 },
      { student_id: 1, year: 2023, amount: 3000 },
    ];
    const result = groupPaymentsByStudentAndYear(payments, 2024);
    expect(Object.keys(result)).toEqual(['1', '2']);
    expect(result[1]).toHaveLength(2);
    expect(result[2]).toHaveLength(1);
  });

  it('returns empty object for no matching year', () => {
    const payments = [{ student_id: 1, year: 2023, amount: 5000 }];
    const result = groupPaymentsByStudentAndYear(payments, 2024);
    expect(result).toEqual({});
  });

  it('returns empty object for empty payments', () => {
    const result = groupPaymentsByStudentAndYear([], 2024);
    expect(result).toEqual({});
  });
});

describe('buildStudentRow', () => {
  const student = { name: 'Maria', email: 'maria@test.com', active: 1, phone: '8888-1234', reference: 'R1' };

  it('maps student fields to Spanish column names', () => {
    const row = buildStudentRow(student, []);
    expect(row.nombre).toBe('Maria');
    expect(row.correo).toBe('maria@test.com');
    expect(row.activo).toBe('Sí');
    expect(row.telefono).toBe('8888-1234');
    expect(row.referencia).toBe('R1');
  });

  it('shows "No" for inactive student', () => {
    const row = buildStudentRow({ ...student, active: 0 }, []);
    expect(row.activo).toBe('No');
  });

  it('resolves matricula by semester', () => {
    const payments = [
      { concept_type: 'Matricula', semester: 1, amount: 10000 },
      { concept_type: 'Matricula', semester: 2, amount: 15000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.matricula_1).toBe(10000);
    expect(row.matricula_2).toBe(15000);
  });

  it('resolves monthly payments by month number', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: 1, amount: 5000 },
      { concept_type: 'Mensualidad', month: 6, amount: 6000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.ENERO).toBe(5000);
    expect(row.JUNIO).toBe(6000);
  });

  it('leaves empty string for months with no payments', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: 1, amount: 5000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.ENERO).toBe(5000);
    expect(row.FEBRERO).toBe('');
    expect(row.DICIEMBRE).toBe('');
  });

  it('ignores non-Matricula concepts for matricula columns', () => {
    const payments = [
      { concept_type: 'Mensualidad', semester: 1, amount: 5000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.matricula_1).toBe('');
  });

  it('resolves semester 2 matricula correctly', () => {
    const payments = [
      { concept_type: 'Matricula', semester: 2, amount: 20000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.matricula_1).toBe('');
    expect(row.matricula_2).toBe(20000);
  });

  it('ignores Matricula payments with no semester', () => {
    const payments = [
      { concept_type: 'Matricula', semester: null, amount: 9999 },
      { concept_type: 'Matricula', amount: 8888 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.matricula_1).toBe('');
    expect(row.matricula_2).toBe('');
  });

  it('resolves monthly payment for month 12 (Diciembre)', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: 12, amount: 7500 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.DICIEMBRE).toBe(7500);
  });

  it('last monthly payment for same month wins', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: 3, amount: 5000 },
      { concept_type: 'Mensualidad', month: 3, amount: 8000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.MARZO).toBe(8000);
  });

  it('ignores Mensualidad payments with no month', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: null, amount: 1000 },
      { concept_type: 'Mensualidad', amount: 2000 },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.ENERO).toBe('');
    expect(row.DICIEMBRE).toBe('');
  });

  it('converts matricula amount to number', () => {
    const payments = [
      { concept_type: 'Matricula', semester: 1, amount: '15000' },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.matricula_1).toBe(15000);
  });

  it('converts monthly payment amount to number', () => {
    const payments = [
      { concept_type: 'Mensualidad', month: 5, amount: '5500' },
    ];
    const row = buildStudentRow(student, payments);
    expect(row.MAYO).toBe(5500);
  });
});

describe('getStudentColumns', () => {
  it('returns columns with year in header', () => {
    const cols = getStudentColumns(2024);
    expect(cols[0].header).toContain('2024');
    expect(cols[0].key).toBe('nombre');
  });

  it('includes all month columns', () => {
    const cols = getStudentColumns(2024);
    const keys = cols.map(c => c.key);
    expect(keys).toContain('ENERO');
    expect(keys).toContain('DICIEMBRE');
    expect(keys).toContain('matricula_1');
    expect(keys).toContain('matricula_2');
  });
});

/* ────────────────────────────────
   NEW TESTS
   ──────────────────────────────── */

describe('getStudentColumnsTemplate', () => {
  it('returns 7 column definitions', () => {
    const cols = getStudentColumnsTemplate();
    expect(cols).toHaveLength(7);
  });

  it('has correct keys for template columns', () => {
    const cols = getStudentColumnsTemplate();
    const keys = cols.map(c => c.key);
    expect(keys).toEqual([
      'nombre', 'correo', 'activo', 'telefono',
      'referencia', 'scholarship', 'scholarship_amount',
    ]);
  });

  it('has correct Spanish headers', () => {
    const cols = getStudentColumnsTemplate();
    const headers = cols.map(c => c.header);
    expect(headers).toContain('BECA');
    expect(headers).toContain('MONTO BECA');
    expect(headers).toContain('NOMBRE MATRICULADO');
    expect(headers).toContain('CORREO');
    expect(headers).toContain('ACTIVO');
    expect(headers).toContain('TELÉFONO');
    expect(headers).toContain('REFERENCIA');
  });

  it('nombre column has width 36', () => {
    const cols = getStudentColumnsTemplate();
    expect(cols[0].width).toBe(36);
  });

  it('scholarship columns exist with width 10', () => {
    const cols = getStudentColumnsTemplate();
    const scholarshipCol = cols.find(c => c.key === 'scholarship');
    const amountCol = cols.find(c => c.key === 'scholarship_amount');
    expect(scholarshipCol.width).toBe(10);
    expect(amountCol.width).toBe(10);
  });
});

describe('styleStudentSheet', () => {
  it('calls eachRow for base styling', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.eachRow).toHaveBeenCalled();
  });

  it('calls getRow for header styling', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.getRow).toHaveBeenCalledWith(1);
  });

  it('calls getColumn for nombre, correo, referencia alignment', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.getColumn).toHaveBeenCalledWith('nombre');
    expect(sheet.getColumn).toHaveBeenCalledWith('correo');
    expect(sheet.getColumn).toHaveBeenCalledWith('referencia');
  });

  it('sets left alignment on nombre column', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    const nombreCol = sheet._columnStore['nombre'];
    expect(nombreCol.alignment.horizontal).toBe('left');
  });

  it('sets right alignment and number format on monthly columns', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    const eneroCol = sheet._columnStore['ENERO'];
    expect(eneroCol.alignment.horizontal).toBe('right');
    expect(eneroCol.numFmt).toBe('#,##0.00');
  });

  it('sets right alignment on matricula columns', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    const mat1 = sheet._columnStore['matricula_1'];
    const mat2 = sheet._columnStore['matricula_2'];
    expect(mat1.alignment.horizontal).toBe('right');
    expect(mat2.alignment.horizontal).toBe('right');
  });

  it('calls getColumn for activo highlighting', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.getColumn).toHaveBeenCalledWith('activo');
  });

  it('calls getColumn for correo highlighting', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.getColumn).toHaveBeenCalledWith('correo');
  });

  it('calls insertRow for sheet title', () => {
    const sheet = createMockSheet();
    styleStudentSheet(sheet);
    expect(sheet.insertRow).toHaveBeenCalled();
  });
});

describe('styleStudentSheetTemplate', () => {
  it('calls eachRow for base styling', () => {
    const sheet = createMockSheet();
    styleStudentSheetTemplate(sheet);
    expect(sheet.eachRow).toHaveBeenCalled();
  });

  it('calls getRow for header styling', () => {
    const sheet = createMockSheet();
    styleStudentSheetTemplate(sheet);
    expect(sheet.getRow).toHaveBeenCalledWith(1);
  });

  it('calls getColumn for nombre, correo, referencia alignment', () => {
    const sheet = createMockSheet();
    styleStudentSheetTemplate(sheet);
    expect(sheet.getColumn).toHaveBeenCalledWith('nombre');
    expect(sheet.getColumn).toHaveBeenCalledWith('correo');
    expect(sheet.getColumn).toHaveBeenCalledWith('referencia');
  });

  it('does not set numFmt on monthly columns (template has no months)', () => {
    const sheet = createMockSheet();
    styleStudentSheetTemplate(sheet);
    expect(sheet.getColumn).not.toHaveBeenCalledWith('ENERO');
    expect(sheet.getColumn).not.toHaveBeenCalledWith('DICIEMBRE');
  });

  it('adds an example row', () => {
    const sheet = createMockSheet();
    styleStudentSheetTemplate(sheet);
    expect(sheet.addRow).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Ejemplo',
        correo: 'ejemplo@ejemplo.com',
        activo: 'Si',
        scholarship: 'Si',
        scholarship_amount: '2000',
      })
    );
  });
});

describe('addSheetTitle', () => {
  it('calls insertRow at position 1', () => {
    const sheet = createMockSheet();
    addSheetTitle(sheet, 'Test Title');
    expect(sheet.insertRow).toHaveBeenCalledWith(1, {});
  });

  it('sets cell A1 value to the title', () => {
    const sheet = createMockSheet();
    const cellA1 = { value: null, font: {}, alignment: {}, fill: {} };
    sheet.getCell.mockImplementation((ref) => {
      if (ref === 'A1') return cellA1;
      return { value: null, font: {}, alignment: {}, fill: {} };
    });
    addSheetTitle(sheet, 'Mi Título');
    expect(cellA1.value).toBe('Mi Título');
  });

  it('applies bold 16pt font to title cell', () => {
    const sheet = createMockSheet();
    const cellA1 = { value: null, font: {}, alignment: {}, fill: {} };
    sheet.getCell.mockImplementation((ref) => {
      if (ref === 'A1') return cellA1;
      return { value: null, font: {}, alignment: {}, fill: {} };
    });
    addSheetTitle(sheet, 'Test');
    expect(cellA1.font).toEqual({
      name: 'Aptos Narrow',
      size: 16,
      bold: true,
      color: { argb: '000000' },
    });
  });

  it('applies center+middle alignment to title cell', () => {
    const sheet = createMockSheet();
    const cellA1 = { value: null, font: {}, alignment: {}, fill: {} };
    sheet.getCell.mockImplementation((ref) => {
      if (ref === 'A1') return cellA1;
      return { value: null, font: {}, alignment: {}, fill: {} };
    });
    addSheetTitle(sheet, 'Test');
    expect(cellA1.alignment).toEqual({
      horizontal: 'center',
      vertical: 'middle',
    });
  });

  it('applies blue fill to title cell', () => {
    const sheet = createMockSheet();
    const cellA1 = { value: null, font: {}, alignment: {}, fill: {} };
    sheet.getCell.mockImplementation((ref) => {
      if (ref === 'A1') return cellA1;
      return { value: null, font: {}, alignment: {}, fill: {} };
    });
    addSheetTitle(sheet, 'Test');
    expect(cellA1.fill).toEqual({
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '46B1E1' },
    });
  });

  it('sets row 1 height to 32', () => {
    const sheet = createMockSheet();
    addSheetTitle(sheet, 'Test');
    const row1 = sheet._mockRows[0];
    expect(row1.height).toBe(32);
  });
});

describe('paseStudentFile', () => {
  it('parses students from workbook with correct fields', async () => {
    const headerMap = {
      'NOMBRE MATRICULADO': 1,
      'CORREO': 2,
      'ACTIVO': 3,
      'TELÉFONO': 4,
      'REFERENCIA': 5,
      'BECA': 6,
      'MONTO BECA': 7,
    };

    const dataRow = {
      eachCell: vi.fn((cb) => {
        cb({ value: 'NOMBRE MATRICULADO' }, 1);
        cb({ value: 'CORREO' }, 2);
        cb({ value: 'ACTIVO' }, 3);
        cb({ value: 'TELÉFONO' }, 4);
        cb({ value: 'REFERENCIA' }, 5);
        cb({ value: 'BECA' }, 6);
        cb({ value: 'MONTO BECA' }, 7);
      }),
      getCell: vi.fn((colNumber) => {
        const values = {
          1: { value: 'Ana Torres' },
          2: { value: 'ana@test.com' },
          3: { value: 'Si' },
          4: { value: '7777-8888' },
          5: { value: 'REF-ANA' },
          6: { value: 'Si' },
          7: { value: 3000 },
        };
        return values[colNumber] || { value: null };
      }),
    };

    const headerRow = {
      eachCell: vi.fn((cb) => {
        Object.entries(headerMap).forEach(([name, col]) => {
          cb({ value: name }, col);
        });
      }),
      getCell: vi.fn(),
    };

    const mockSheet = {
      getRow: vi.fn((rowNumber) => {
        if (rowNumber === 1) return headerRow;
        return dataRow;
      }),
      eachRow: vi.fn((cb) => {
        cb(headerRow, 1);
        cb(dataRow, 2);
      }),
    };

    const workbook = {
      xlsx: {
        load: vi.fn(async () => {}),
      },
      worksheets: [mockSheet],
    };

    const uint8 = new Uint8Array([1, 2, 3]);
    const buffer = { buffer: uint8.buffer };
    const result = await paseStudentFile(buffer, workbook);

    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Ana Torres');
    expect(result[0].correo).toBe('ana@test.com');
    expect(result[0].activo).toBe('Si');
    expect(result[0].telefono).toBe('7777-8888');
    expect(result[0].referencia).toBe('REF-ANA');
    expect(result[0].scholarship).toBe('Si');
    expect(result[0].scholarship_amount).toBe(3000);
  });

  it('skips rows where nombre is empty', async () => {
    const headerMap = {
      'NOMBRE MATRICULADO': 1,
      'CORREO': 2,
      'ACTIVO': 3,
      'TELÉFONO': 4,
      'REFERENCIA': 5,
      'BECA': 6,
      'MONTO BECA': 7,
    };

    const emptyRow = {
      eachCell: vi.fn(),
      getCell: vi.fn((colNumber) => {
        if (colNumber === 1) return { value: null };
        return { value: null };
      }),
    };

    const headerRow = {
      eachCell: vi.fn((cb) => {
        Object.entries(headerMap).forEach(([name, col]) => {
          cb({ value: name }, col);
        });
      }),
      getCell: vi.fn(),
    };

    const mockSheet = {
      getRow: vi.fn((rowNumber) => {
        if (rowNumber === 1) return headerRow;
        return emptyRow;
      }),
      eachRow: vi.fn((cb) => {
        cb(headerRow, 1);
        cb(emptyRow, 2);
      }),
    };

    const workbook = {
      xlsx: { load: vi.fn(async () => {}) },
      worksheets: [mockSheet],
    };

    const uint8 = new Uint8Array([1, 2, 3]);
    const buffer = { buffer: uint8.buffer };
    const result = await paseStudentFile(buffer, workbook);
    expect(result).toHaveLength(0);
  });

  it('handles hyperlink email cells by extracting text', async () => {
    const headerMap = {
      'NOMBRE MATRICULADO': 1,
      'CORREO': 2,
      'ACTIVO': 3,
      'TELÉFONO': 4,
      'REFERENCIA': 5,
      'BECA': 6,
      'MONTO BECA': 7,
    };

    const dataRow = {
      eachCell: vi.fn(),
      getCell: vi.fn((colNumber) => {
        if (colNumber === 1) return { value: 'Luis' };
        if (colNumber === 2) return { value: { text: 'luis@mail.com', hyperlink: 'mailto:luis@mail.com' } };
        if (colNumber === 3) return { value: 'Si' };
        if (colNumber === 4) return { value: '5555-1234' };
        if (colNumber === 5) return { value: 'REF-L' };
        if (colNumber === 6) return { value: 'No' };
        if (colNumber === 7) return { value: 0 };
        return { value: null };
      }),
    };

    const headerRow = {
      eachCell: vi.fn((cb) => {
        Object.entries(headerMap).forEach(([name, col]) => {
          cb({ value: name }, col);
        });
      }),
      getCell: vi.fn(),
    };

    const mockSheet = {
      getRow: vi.fn((rowNumber) => {
        if (rowNumber === 1) return headerRow;
        return dataRow;
      }),
      eachRow: vi.fn((cb) => {
        cb(headerRow, 1);
        cb(dataRow, 2);
      }),
    };

    const workbook = {
      xlsx: { load: vi.fn(async () => {}) },
      worksheets: [mockSheet],
    };

    const uint8 = new Uint8Array([1, 2, 3]);
    const buffer = { buffer: uint8.buffer };
    const result = await paseStudentFile(buffer, workbook);
    expect(result[0].correo).toBe('luis@mail.com');
  });

  it('defaults activo to "Si" when missing', async () => {
    const headerMap = {
      'NOMBRE MATRICULADO': 1,
      'CORREO': 2,
      'ACTIVO': 3,
      'TELÉFONO': 4,
      'REFERENCIA': 5,
      'BECA': 6,
      'MONTO BECA': 7,
    };

    const dataRow = {
      eachCell: vi.fn(),
      getCell: vi.fn((colNumber) => {
        if (colNumber === 1) return { value: 'Pedro' };
        if (colNumber === 2) return { value: 'pedro@test.com' };
        if (colNumber === 3) return { value: null };
        if (colNumber === 4) return { value: null };
        if (colNumber === 5) return { value: null };
        if (colNumber === 6) return { value: null };
        if (colNumber === 7) return { value: null };
        return { value: null };
      }),
    };

    const headerRow = {
      eachCell: vi.fn((cb) => {
        Object.entries(headerMap).forEach(([name, col]) => {
          cb({ value: name }, col);
        });
      }),
      getCell: vi.fn(),
    };

    const mockSheet = {
      getRow: vi.fn((rowNumber) => {
        if (rowNumber === 1) return headerRow;
        return dataRow;
      }),
      eachRow: vi.fn((cb) => {
        cb(headerRow, 1);
        cb(dataRow, 2);
      }),
    };

    const workbook = {
      xlsx: { load: vi.fn(async () => {}) },
      worksheets: [mockSheet],
    };

    const uint8 = new Uint8Array([1, 2, 3]);
    const buffer = { buffer: uint8.buffer };
    const result = await paseStudentFile(buffer, workbook);
    expect(result[0].activo).toBe('Si');
    expect(result[0].scholarship).toBe('No');
    expect(result[0].scholarship_amount).toBe(0);
  });
});
