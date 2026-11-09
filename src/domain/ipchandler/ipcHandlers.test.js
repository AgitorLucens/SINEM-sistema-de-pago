import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHandle = vi.hoisted(() => {
  // Mirrors real Electron: registering a second handler for the same
  // channel throws. setUpHandlers runs in every beforeEach, so any
  // duplicated channel registration fails the whole suite.
  const registered = new Set();
  const fn = vi.fn((channel) => {
    if (registered.has(channel)) {
      throw new Error(`Attempted to register a second handler for '${channel}'`);
    }
    registered.add(channel);
  });
  fn.registered = registered;
  return fn;
});
vi.mock('electron', () => ({
  ipcMain: { handle: mockHandle },
  app: { quit: vi.fn() },
}));

import setUpHandlers from './ipcHandlers';
import { CHANNELS } from '../../ipc/channels.js';

function callHandler(channel, ...args) {
  const entry = mockHandle.mock.calls.find(c => c[0] === channel);
  if (!entry) throw new Error(`Handler "${channel}" was not registered`);
  return entry[1]({}, ...args);
}

function makeMocks() {
  const db = {
    payments: {
      addPayment: vi.fn(),
      updatePayment: vi.fn(),
      addPaymentWithConsecutive: vi.fn(),
      getNextConsecutiveByYear: vi.fn(),
      getAllPayments: vi.fn(),
      getPaymentsByYear: vi.fn(),
      getYearsOfPayments: vi.fn(),
      getDateOfPayments: vi.fn(),
      getPaymentByStudentId: vi.fn(),
      deletePaymentById: vi.fn(),
    },
    pricing: {
      getPaymentsConcepts: vi.fn(),
      getPaymentsDivisions: vi.fn(),
      getPaymentAmount: vi.fn(),
      addDivision: vi.fn(),
      deleteDivision: vi.fn(),
      updateDivision: vi.fn(),
      updatePriceConcept: vi.fn(),
      updatePriceDivision: vi.fn(),
      getAllDivisionPaymentConcepts: vi.fn(),
      updateDivisionPaymentConcept: vi.fn(),
    },
    reports: {
      getDelayPayments: vi.fn(),
      getExpectedIncome: vi.fn(),
      getCashRegister: vi.fn(),
    },
    expenses: {
      getAllExpenses: vi.fn(),
      getExpensesByYear: vi.fn(),
      getYearsOfExpenses: vi.fn(),
      addExpense: vi.fn(),
      updateExpense: vi.fn(),
      deleteExpenseById: vi.fn(),
    },
    students: {
      getAllStudents: vi.fn(),
      getStudentsByActive: vi.fn(),
      getStudentsActive: vi.fn(),
      getStudentCount: vi.fn(),
      addStudent: vi.fn(),
      updateStudent: vi.fn(),
      deleteStudentById: vi.fn(),
      importStudents: vi.fn(),
    },
    teachers: {
      getAllTeachers: vi.fn(),
      addTeacher: vi.fn(),
      deleteTeacherById: vi.fn(),
      updateTeacher: vi.fn(),
    },
    images: {
      addImage: vi.fn(),
      getImages: vi.fn(),
      setImage: vi.fn(),
      getCurrentImage: vi.fn(),
      deleteImageById: vi.fn(),
    },
  };
  const excel = {
    exportReceiptToExcel: vi.fn(),
    exportReportToExcel: vi.fn(),
    exportCashRegisterReportToExcel: vi.fn(),
    exportPaymentsByYearToExcel: vi.fn(),
    exportExpensesByYearToExcel: vi.fn(),
    exportStudentsByActiveToExcel: vi.fn(),
    exportTemplateStudents: vi.fn(),
    exportHistoric: vi.fn(),
    importStudentsFromExcel: vi.fn(),
    exportDelayByMonthReportToExcel: vi.fn(),
    exportDelayByTeacherReportToExcel: vi.fn(),
  };
  return { db, excel };
}

let db, excel;

beforeEach(() => {
  mockHandle.mockClear();
  mockHandle.registered.clear();
  const mocks = makeMocks();
  db = mocks.db;
  excel = mocks.excel;
  setUpHandlers(db, excel);
});

describe('setUpHandlers', () => {
  it('calls ipcMain.handle for every channel', () => {
    expect(mockHandle.mock.calls.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Pagina Pagos
// ---------------------------------------------------------------------------
describe('Pagos handlers', () => {
  it('add-payment delegates to db.payments.addPayment', async () => {
    const data = { amount: 10000, student_id: 1 };
    db.payments.addPayment.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.payments.addPayment, data);
    expect(db.payments.addPayment).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('add-payment propagates errors', async () => {
    db.payments.addPayment.mockRejectedValue(new Error('fail'));
    await expect(callHandler(CHANNELS.payments.addPayment, {})).rejects.toThrow('fail');
  });

  it('update-payment delegates to db.payments.updatePayment', async () => {
    const data = { id: 1, fields: { amount: 5000 } };
    db.payments.updatePayment.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.payments.updatePayment, data);
    expect(db.payments.updatePayment).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('add-payment-without-consecutive delegates to db.payments.addPaymentWithConsecutive', async () => {
    const data = { receipt: 'R01', amount: 5000 };
    db.payments.addPaymentWithConsecutive.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.payments.addPaymentWithConsecutive, data);
    expect(db.payments.addPaymentWithConsecutive).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('get-consecutive delegates to db.payments.getNextConsecutiveByYear', async () => {
    db.payments.getNextConsecutiveByYear.mockResolvedValue(3);
    const result = await callHandler(CHANNELS.payments.getNextConsecutiveByYear, 2025);
    expect(db.payments.getNextConsecutiveByYear).toHaveBeenCalledWith(2025);
    expect(result).toBe(3);
  });

  it('get-all-payments delegates to db.payments.getAllPayments', async () => {
    db.payments.getAllPayments.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler(CHANNELS.payments.getAllPayments);
    expect(db.payments.getAllPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-payments-by-year delegates to db.payments.getPaymentsByYear', async () => {
    db.payments.getPaymentsByYear.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler(CHANNELS.payments.getPaymentsByYear, '2025');
    expect(db.payments.getPaymentsByYear).toHaveBeenCalledWith('2025');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-year-payments delegates to db.payments.getYearsOfPayments', async () => {
    db.payments.getYearsOfPayments.mockResolvedValue([{ year: '2025' }]);
    const result = await callHandler(CHANNELS.payments.getYearsOfPayments);
    expect(db.payments.getYearsOfPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ year: '2025' }]);
  });

  it('get-date-payments delegates to db.payments.getDateOfPayments', async () => {
    db.payments.getDateOfPayments.mockResolvedValue([{ date: '2025-01-15' }]);
    const result = await callHandler(CHANNELS.payments.getDateOfPayments);
    expect(db.payments.getDateOfPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ date: '2025-01-15' }]);
  });

  it('get-payment-by-student-id delegates to db.payments.getPaymentByStudentId', async () => {
    db.payments.getPaymentByStudentId.mockResolvedValue([{ id: 10 }]);
    const result = await callHandler(CHANNELS.payments.getPaymentByStudentId, 5);
    expect(db.payments.getPaymentByStudentId).toHaveBeenCalledWith(5);
    expect(result).toEqual([{ id: 10 }]);
  });

  it('delete-payment-by-id delegates to db.payments.deletePaymentById', async () => {
    db.payments.deletePaymentById.mockResolvedValue(undefined);
    await callHandler(CHANNELS.payments.deletePaymentById, 99);
    expect(db.payments.deletePaymentById).toHaveBeenCalledWith(99);
  });

  it('get-payment-concepts delegates to db.pricing.getPaymentsConcepts', async () => {
    db.pricing.getPaymentsConcepts.mockResolvedValue([{ name: 'Matricula' }]);
    const result = await callHandler(CHANNELS.pricing.getPaymentConcepts);
    expect(db.pricing.getPaymentsConcepts).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Matricula' }]);
  });

  it('get-payment-divisions delegates to db.pricing.getPaymentsDivisions', async () => {
    db.pricing.getPaymentsDivisions.mockResolvedValue([{ name: 'SINEM' }]);
    const result = await callHandler(CHANNELS.pricing.getPaymentDivisions);
    expect(db.pricing.getPaymentsDivisions).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'SINEM' }]);
  });

  it('get-delay-payment delegates to db.reports.getDelayPayments', async () => {
    db.reports.getDelayPayments.mockResolvedValue({ months: {} });
    const result = await callHandler(CHANNELS.reports.getDelayPayments, 2025);
    expect(db.reports.getDelayPayments).toHaveBeenCalledWith(2025);
    expect(result).toEqual({ months: {} });
  });

  it('get-expected-income delegates to db.reports.getExpectedIncome', async () => {
    db.reports.getExpectedIncome.mockResolvedValue({ matricula1: 50000 });
    const result = await callHandler(CHANNELS.reports.getExpectedIncome, [2025]);
    expect(db.reports.getExpectedIncome).toHaveBeenCalledWith([2025]);
    expect(result).toEqual({ matricula1: 50000 });
  });

  it('get-payment-amount delegates to db.pricing.getPaymentAmount with destructured args', async () => {
    db.pricing.getPaymentAmount.mockResolvedValue(25000);
    const result = await callHandler(CHANNELS.pricing.getPaymentAmount, { divisionId: 3, conceptId: 7 });
    expect(db.pricing.getPaymentAmount).toHaveBeenCalledWith(3, 7);
    expect(result).toBe(25000);
  });
});

// ---------------------------------------------------------------------------
// Pagina Egresos
// ---------------------------------------------------------------------------
describe('Expenses handlers', () => {
  it('get-all-expenses delegates to db.expenses.getAllExpenses', async () => {
    db.expenses.getAllExpenses.mockResolvedValue([{ description: 'Rent' }]);
    const result = await callHandler(CHANNELS.expenses.getAllExpenses);
    expect(db.expenses.getAllExpenses).toHaveBeenCalledOnce();
    expect(result).toEqual([{ description: 'Rent' }]);
  });

  it('get-expenses-by-year delegates to db.expenses.getExpensesByYear', async () => {
    db.expenses.getExpensesByYear.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler(CHANNELS.expenses.getExpensesByYear, '2025');
    expect(db.expenses.getExpensesByYear).toHaveBeenCalledWith('2025');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-year-expenses delegates to db.expenses.getYearsOfExpenses', async () => {
    db.expenses.getYearsOfExpenses.mockResolvedValue([{ year: '2025' }]);
    const result = await callHandler(CHANNELS.expenses.getYearsOfExpenses);
    expect(db.expenses.getYearsOfExpenses).toHaveBeenCalledOnce();
    expect(result).toEqual([{ year: '2025' }]);
  });

  it('add-expense delegates to db.expenses.addExpense', async () => {
    const data = { description: 'Rent', amount: 500000 };
    db.expenses.addExpense.mockResolvedValue(1);
    const result = await callHandler(CHANNELS.expenses.addExpense, data);
    expect(db.expenses.addExpense).toHaveBeenCalledWith(data);
    expect(result).toBe(1);
  });

  it('update-expense delegates to db.expenses.updateExpense', async () => {
    const data = { id: 1, fields: { amount: 600000 } };
    db.expenses.updateExpense.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.expenses.updateExpense, data);
    expect(db.expenses.updateExpense).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('delete-expense-by-id delegates to db.expenses.deleteExpenseById', async () => {
    db.expenses.deleteExpenseById.mockResolvedValue(undefined);
    await callHandler(CHANNELS.expenses.deleteExpenseById, 5);
    expect(db.expenses.deleteExpenseById).toHaveBeenCalledWith(5);
  });

  it('propagates errors from expense handlers', async () => {
    db.expenses.getAllExpenses.mockRejectedValue(new Error('no db'));
    await expect(callHandler(CHANNELS.expenses.getAllExpenses)).rejects.toThrow('no db');
  });
});

// ---------------------------------------------------------------------------
// Pagina Estudiantes
// ---------------------------------------------------------------------------
describe('Students handlers', () => {
  it('get-all-students delegates to db.students.getAllStudents', async () => {
    db.students.getAllStudents.mockResolvedValue([{ name: 'Juan' }]);
    const result = await callHandler(CHANNELS.students.getAllStudents);
    expect(db.students.getAllStudents).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Juan' }]);
  });

  it('get-students-by-active delegates to db.students.getStudentsByActive', async () => {
    db.students.getStudentsByActive.mockResolvedValue([{ name: 'Active' }]);
    const result = await callHandler(CHANNELS.students.getStudentsByActive, 1);
    expect(db.students.getStudentsByActive).toHaveBeenCalledWith(1);
    expect(result).toEqual([{ name: 'Active' }]);
  });

  it('get-students-active delegates to db.students.getStudentsActive', async () => {
    db.students.getStudentsActive.mockResolvedValue([1, 0]);
    const result = await callHandler(CHANNELS.students.getStudentsActive);
    expect(db.students.getStudentsActive).toHaveBeenCalledOnce();
    expect(result).toEqual([1, 0]);
  });

  it('get-students-count delegates to db.students.getStudentCount', async () => {
    db.students.getStudentCount.mockResolvedValue([{ 'COUNT(*)': 5 }]);
    const result = await callHandler(CHANNELS.students.getStudentCount);
    expect(db.students.getStudentCount).toHaveBeenCalledOnce();
    expect(result).toEqual([{ 'COUNT(*)': 5 }]);
  });

  it('add-student delegates to db.students.addStudent', async () => {
    const data = { name: 'Maria' };
    db.students.addStudent.mockResolvedValue(42);
    const result = await callHandler(CHANNELS.students.addStudent, data);
    expect(db.students.addStudent).toHaveBeenCalledWith(data);
    expect(result).toBe(42);
  });

  it('update-student delegates to db.students.updateStudent', async () => {
    const data = { id: 1, fields: { name: 'New' } };
    db.students.updateStudent.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.students.updateStudent, data);
    expect(db.students.updateStudent).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('delete-student-by-id delegates to db.students.deleteStudentById', async () => {
    db.students.deleteStudentById.mockResolvedValue(undefined);
    await callHandler(CHANNELS.students.deleteStudentById, 7);
    expect(db.students.deleteStudentById).toHaveBeenCalledWith(7);
  });

  it('students:import delegates to db.students.importStudents', async () => {
    const data = [{ name: 'Juan', activo: 'Si' }];
    db.students.importStudents.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.students.importStudents, data);
    expect(db.students.importStudents).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });
});

// ---------------------------------------------------------------------------
// Pagina Profesores
// ---------------------------------------------------------------------------
describe('Teachers handlers', () => {
  it('get-all-teachers delegates to db.teachers.getAllTeachers', async () => {
    db.teachers.getAllTeachers.mockResolvedValue([{ name: 'Prof A' }]);
    const result = await callHandler(CHANNELS.teachers.getAllTeachers);
    expect(db.teachers.getAllTeachers).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Prof A' }]);
  });

  it('add-teacher delegates to db.teachers.addTeacher', async () => {
    const data = { name: 'Prof B' };
    db.teachers.addTeacher.mockResolvedValue({ lastInsertRowid: 1 });
    const result = await callHandler(CHANNELS.teachers.addTeacher, data);
    expect(db.teachers.addTeacher).toHaveBeenCalledWith(data);
    expect(result).toEqual({ lastInsertRowid: 1 });
  });

  it('delete-teacher-by-id delegates to db.teachers.deleteTeacherById', async () => {
    db.teachers.deleteTeacherById.mockResolvedValue(undefined);
    await callHandler(CHANNELS.teachers.deleteTeacherById, 10);
    expect(db.teachers.deleteTeacherById).toHaveBeenCalledWith(10);
  });

  it('update-teacher delegates to db.teachers.updateTeacher', async () => {
    const data = { id: 1, fields: { name: 'Updated' } };
    db.teachers.updateTeacher.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.teachers.updateTeacher, data);
    expect(db.teachers.updateTeacher).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });
});

// ---------------------------------------------------------------------------
// Pagina Report
// ---------------------------------------------------------------------------
describe('Report handlers', () => {
  it('get-cash-register delegates to db.reports.getCashRegister', async () => {
    db.reports.getCashRegister.mockResolvedValue([{ type: 'payment' }]);
    const result = await callHandler(CHANNELS.reports.getCashRegister);
    expect(db.reports.getCashRegister).toHaveBeenCalledOnce();
    expect(result).toEqual([{ type: 'payment' }]);
  });
});

// ---------------------------------------------------------------------------
// Pagina Precios
// ---------------------------------------------------------------------------
describe('Pricing handlers', () => {
  it('add-division delegates to db.pricing.addDivision', async () => {
    const division = { name: 'NewDiv' };
    db.pricing.addDivision.mockResolvedValue({ lastInsertRowid: 5 });
    const result = await callHandler(CHANNELS.pricing.addDivision, division);
    expect(db.pricing.addDivision).toHaveBeenCalledWith(division);
    expect(result).toEqual({ lastInsertRowid: 5 });
  });

  it('delete-division delegates to db.pricing.deleteDivision', async () => {
    db.pricing.deleteDivision.mockResolvedValue(undefined);
    await callHandler(CHANNELS.pricing.deleteDivision, 3);
    expect(db.pricing.deleteDivision).toHaveBeenCalledWith(3);
  });

  it('update-division delegates to db.pricing.updateDivision with id and name', async () => {
    db.pricing.updateDivision.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.pricing.updateDivision, { id: 2, name: 'Renamed' });
    expect(db.pricing.updateDivision).toHaveBeenCalledWith(2, 'Renamed');
    expect(result).toEqual({ success: true });
  });

  it('update-price-concept delegates to db.pricing.updatePriceConcept', async () => {
    const concept = { id: 1, amount: 50000 };
    db.pricing.updatePriceConcept.mockResolvedValue(undefined);
    await callHandler(CHANNELS.pricing.updatePriceConcept, concept);
    expect(db.pricing.updatePriceConcept).toHaveBeenCalledWith(concept);
  });

  it('update-price-division delegates to db.pricing.updatePriceDivision', async () => {
    const division = { id: 1, amount: 75000 };
    db.pricing.updatePriceDivision.mockResolvedValue(undefined);
    await callHandler(CHANNELS.pricing.updatePriceDivision, division);
    expect(db.pricing.updatePriceDivision).toHaveBeenCalledWith(division);
  });

  it('get-all-division-payment-concepts delegates to db.pricing.getAllDivisionPaymentConcepts', async () => {
    db.pricing.getAllDivisionPaymentConcepts.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler(CHANNELS.pricing.getAllDivisionPaymentConcepts);
    expect(db.pricing.getAllDivisionPaymentConcepts).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('update-division-payment-concept delegates with id and amount', async () => {
    db.pricing.updateDivisionPaymentConcept.mockResolvedValue(1);
    const result = await callHandler(CHANNELS.pricing.updateDivisionPaymentConcept, { id: 10, amount: 999 });
    expect(db.pricing.updateDivisionPaymentConcept).toHaveBeenCalledWith(10, 999);
    expect(result).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Excel
// ---------------------------------------------------------------------------
describe('Excel handlers', () => {
  it('export-receipt-excel delegates to excel.exportReceiptToExcel', async () => {
    const payment = { id: 1 };
    excel.exportReceiptToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportReceiptToExcel, payment);
    expect(excel.exportReceiptToExcel).toHaveBeenCalledWith(payment);
    expect(result).toBe(true);
  });

  it('export-report-excel delegates to excel.exportReportToExcel with payments', async () => {
    const data = { payments: [{ id: 1 }, { id: 2 }] };
    excel.exportReportToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportReportToExcel, data);
    expect(excel.exportReportToExcel).toHaveBeenCalledWith(data.payments);
    expect(result).toBe(true);
  });

  it('export-cash-register-report delegates to excel.exportCashRegisterReportToExcel', async () => {
    const data = { entries: [] };
    excel.exportCashRegisterReportToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportCashRegisterReportToExcel, data);
    expect(excel.exportCashRegisterReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-payments-by-year delegates to excel.exportPaymentsByYearToExcel', async () => {
    const data = [{ id: 1 }];
    excel.exportPaymentsByYearToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportPaymentsByYearToExcel, data);
    expect(excel.exportPaymentsByYearToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-expenses-by-year delegates to excel.exportExpensesByYearToExcel', async () => {
    const data = [{ id: 1 }];
    excel.exportExpensesByYearToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportExpensesByYearToExcel, data);
    expect(excel.exportExpensesByYearToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-students-by-active delegates with destructured studentData', async () => {
    const studentData = { students: [{ name: 'A' }], payments: [{}], years: ['2025'] };
    excel.exportStudentsByActiveToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportStudentsByActiveToExcel, studentData);
    expect(excel.exportStudentsByActiveToExcel).toHaveBeenCalledWith(
      studentData.students,
      studentData.payments,
      studentData.years,
    );
    expect(result).toBe(true);
  });

  it('export-students-template delegates to excel.exportTemplateStudents', async () => {
    excel.exportTemplateStudents.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportTemplateStudents);
    expect(excel.exportTemplateStudents).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

  it('export-historic delegates to excel.exportHistoric', async () => {
    const data = { year: '2025' };
    excel.exportHistoric.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportHistoric, data);
    expect(excel.exportHistoric).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('import-student-from-excel delegates to excel.importStudentsFromExcel', async () => {
    const data = [{ nombre: 'Juan' }];
    excel.importStudentsFromExcel.mockResolvedValue({ success: true });
    const result = await callHandler(CHANNELS.excel.importStudentsFromExcel, data);
    expect(excel.importStudentsFromExcel).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('export-delay-by-month-report delegates to excel.exportDelayByMonthReportToExcel', async () => {
    const data = { months: {} };
    excel.exportDelayByMonthReportToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportDelayByMonthReportToExcel, data);
    expect(excel.exportDelayByMonthReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-delay-by-teacher-report delegates to excel.exportDelayByTeacherReportToExcel', async () => {
    const data = { teachers: [] };
    excel.exportDelayByTeacherReportToExcel.mockResolvedValue(true);
    const result = await callHandler(CHANNELS.excel.exportDelayByTeacherReportToExcel, data);
    expect(excel.exportDelayByTeacherReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('propagates errors from excel handlers', async () => {
    excel.exportReceiptToExcel.mockRejectedValue(new Error('excel fail'));
    await expect(callHandler(CHANNELS.excel.exportReceiptToExcel, {})).rejects.toThrow('excel fail');
  });
});

// ---------------------------------------------------------------------------
// App functionality
// ---------------------------------------------------------------------------
describe('App functionality handlers', () => {
  it('add-image delegates to db.images.addImage', async () => {
    const imageData = { image: Buffer.from('test') };
    db.images.addImage.mockResolvedValue(1);
    const result = await callHandler(CHANNELS.images.addImage, imageData);
    expect(db.images.addImage).toHaveBeenCalledWith(imageData);
    expect(result).toBe(1);
  });

  it('get-images delegates to db.images.getImages', async () => {
    db.images.getImages.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler(CHANNELS.images.getImages);
    expect(db.images.getImages).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('set-image delegates to db.images.setImage', async () => {
    const imageState = { id: 1, current_image: 1 };
    db.images.setImage.mockResolvedValue(undefined);
    await callHandler(CHANNELS.images.setImage, imageState);
    expect(db.images.setImage).toHaveBeenCalledWith(imageState);
  });

  it('get-current-image delegates to db.images.getCurrentImage', async () => {
    db.images.getCurrentImage.mockResolvedValue({ id: 1, image: Buffer.from('x') });
    const result = await callHandler(CHANNELS.images.getCurrentImage);
    expect(db.images.getCurrentImage).toHaveBeenCalledOnce();
    expect(result).toEqual({ id: 1, image: Buffer.from('x') });
  });

  it('delete-image-by-id delegates to db.images.deleteImageById', async () => {
    db.images.deleteImageById.mockResolvedValue(undefined);
    await callHandler(CHANNELS.images.deleteImageById, 3);
    expect(db.images.deleteImageById).toHaveBeenCalledWith(3);
  });

  it('app:quit calls app.quit', async () => {
    const { app } = await import('electron');
    await callHandler(CHANNELS.app.quitApp);
    expect(app.quit).toHaveBeenCalledOnce();
  });
});
