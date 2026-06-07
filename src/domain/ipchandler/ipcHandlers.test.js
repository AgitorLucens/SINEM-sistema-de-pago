import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHandle = vi.hoisted(() => vi.fn());
vi.mock('electron', () => ({
  ipcMain: { handle: mockHandle },
  app: { quit: vi.fn() },
}));

import setUpHandlers from './ipcHandlers';

function callHandler(channel, ...args) {
  const entry = mockHandle.mock.calls.find(c => c[0] === channel);
  if (!entry) throw new Error(`Handler "${channel}" was not registered`);
  return entry[1]({}, ...args);
}

function makeMocks() {
  const db = {
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
    getPaymentsConcepts: vi.fn(),
    getPaymentsDivisions: vi.fn(),
    getDelayPayments: vi.fn(),
    getExpectedIncome: vi.fn(),
    getPaymentAmount: vi.fn(),
    getAllExpenses: vi.fn(),
    getExpensesByYear: vi.fn(),
    getYearsOfExpenses: vi.fn(),
    addExpense: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpenseById: vi.fn(),
    getAllStudents: vi.fn(),
    getStudentsByActive: vi.fn(),
    getStudentsActive: vi.fn(),
    getStudentCount: vi.fn(),
    addStudent: vi.fn(),
    updateStudent: vi.fn(),
    deleteStudentById: vi.fn(),
    getAllTeachers: vi.fn(),
    addTeacher: vi.fn(),
    deleteTeacherById: vi.fn(),
    updateTeacher: vi.fn(),
    getCashRegister: vi.fn(),
    addDivision: vi.fn(),
    deleteDivision: vi.fn(),
    updateDivision: vi.fn(),
    updatePriceConcept: vi.fn(),
    updatePriceDivision: vi.fn(),
    getAllDivisionPaymentConcepts: vi.fn(),
    updateDivisionPaymentConcept: vi.fn(),
    addImage: vi.fn(),
    getImages: vi.fn(),
    setImage: vi.fn(),
    getCurrentImage: vi.fn(),
    deleteImageById: vi.fn(),
    importStudents: vi.fn(),
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
  it('add-payment delegates to db.addPayment', async () => {
    const data = { amount: 10000, student_id: 1 };
    db.addPayment.mockResolvedValue({ success: true });
    const result = await callHandler('add-payment', data);
    expect(db.addPayment).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('add-payment propagates errors', async () => {
    db.addPayment.mockRejectedValue(new Error('fail'));
    await expect(callHandler('add-payment', {})).rejects.toThrow('fail');
  });

  it('update-payment delegates to db.updatePayment', async () => {
    const data = { id: 1, fields: { amount: 5000 } };
    db.updatePayment.mockResolvedValue({ success: true });
    const result = await callHandler('update-payment', data);
    expect(db.updatePayment).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('add-payment-without-consecutive delegates to db.addPaymentWithConsecutive', async () => {
    const data = { receipt: 'R01', amount: 5000 };
    db.addPaymentWithConsecutive.mockResolvedValue({ success: true });
    const result = await callHandler('add-payment-without-consecutive', data);
    expect(db.addPaymentWithConsecutive).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('get-consecutive delegates to db.getNextConsecutiveByYear', async () => {
    db.getNextConsecutiveByYear.mockResolvedValue(3);
    const result = await callHandler('get-consecutive', 2025);
    expect(db.getNextConsecutiveByYear).toHaveBeenCalledWith(2025);
    expect(result).toBe(3);
  });

  it('get-all-payments delegates to db.getAllPayments', async () => {
    db.getAllPayments.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler('get-all-payments');
    expect(db.getAllPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-payments-by-year delegates to db.getPaymentsByYear', async () => {
    db.getPaymentsByYear.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler('get-payments-by-year', '2025');
    expect(db.getPaymentsByYear).toHaveBeenCalledWith('2025');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-year-payments delegates to db.getYearsOfPayments', async () => {
    db.getYearsOfPayments.mockResolvedValue([{ year: '2025' }]);
    const result = await callHandler('get-year-payments');
    expect(db.getYearsOfPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ year: '2025' }]);
  });

  it('get-consecutive-payments delegates to db.getYearsOfPayments', async () => {
    db.getYearsOfPayments.mockResolvedValue([{ year: '2024' }]);
    const result = await callHandler('get-consecutive-payments');
    expect(db.getYearsOfPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ year: '2024' }]);
  });

  it('get-date-payments delegates to db.getDateOfPayments', async () => {
    db.getDateOfPayments.mockResolvedValue([{ date: '2025-01-15' }]);
    const result = await callHandler('get-date-payments');
    expect(db.getDateOfPayments).toHaveBeenCalledOnce();
    expect(result).toEqual([{ date: '2025-01-15' }]);
  });

  it('get-payment-by-student-id delegates to db.getPaymentByStudentId', async () => {
    db.getPaymentByStudentId.mockResolvedValue([{ id: 10 }]);
    const result = await callHandler('get-payment-by-student-id', 5);
    expect(db.getPaymentByStudentId).toHaveBeenCalledWith(5);
    expect(result).toEqual([{ id: 10 }]);
  });

  it('delete-payment-by-id delegates to db.deletePaymentById', async () => {
    db.deletePaymentById.mockResolvedValue(undefined);
    await callHandler('delete-payment-by-id', 99);
    expect(db.deletePaymentById).toHaveBeenCalledWith(99);
  });

  it('get-payment-concepts delegates to db.getPaymentsConcepts', async () => {
    db.getPaymentsConcepts.mockResolvedValue([{ name: 'Matricula' }]);
    const result = await callHandler('get-payment-concepts');
    expect(db.getPaymentsConcepts).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Matricula' }]);
  });

  it('get-payment-divisions delegates to db.getPaymentsDivisions', async () => {
    db.getPaymentsDivisions.mockResolvedValue([{ name: 'SINEM' }]);
    const result = await callHandler('get-payment-divisions');
    expect(db.getPaymentsDivisions).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'SINEM' }]);
  });

  it('get-delay-payment delegates to db.getDelayPayments', async () => {
    db.getDelayPayments.mockResolvedValue({ months: {} });
    const result = await callHandler('get-delay-payment', 2025);
    expect(db.getDelayPayments).toHaveBeenCalledWith(2025);
    expect(result).toEqual({ months: {} });
  });

  it('get-expected-income delegates to db.getExpectedIncome', async () => {
    db.getExpectedIncome.mockResolvedValue({ matricula1: 50000 });
    const result = await callHandler('get-expected-income', [2025]);
    expect(db.getExpectedIncome).toHaveBeenCalledWith([2025]);
    expect(result).toEqual({ matricula1: 50000 });
  });

  it('get-payment-amount delegates to db.getPaymentAmount with destructured args', async () => {
    db.getPaymentAmount.mockResolvedValue(25000);
    const result = await callHandler('get-payment-amount', { divisionId: 3, conceptId: 7 });
    expect(db.getPaymentAmount).toHaveBeenCalledWith(3, 7);
    expect(result).toBe(25000);
  });
});

// ---------------------------------------------------------------------------
// Pagina Egresos
// ---------------------------------------------------------------------------
describe('Expenses handlers', () => {
  it('get-all-expenses delegates to db.getAllExpenses', async () => {
    db.getAllExpenses.mockResolvedValue([{ description: 'Rent' }]);
    const result = await callHandler('get-all-expenses');
    expect(db.getAllExpenses).toHaveBeenCalledOnce();
    expect(result).toEqual([{ description: 'Rent' }]);
  });

  it('get-expenses-by-year delegates to db.getExpensesByYear', async () => {
    db.getExpensesByYear.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler('get-expenses-by-year', '2025');
    expect(db.getExpensesByYear).toHaveBeenCalledWith('2025');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('get-year-expenses delegates to db.getYearsOfExpenses', async () => {
    db.getYearsOfExpenses.mockResolvedValue([{ year: '2025' }]);
    const result = await callHandler('get-year-expenses');
    expect(db.getYearsOfExpenses).toHaveBeenCalledOnce();
    expect(result).toEqual([{ year: '2025' }]);
  });

  it('add-expense delegates to db.addExpense', async () => {
    const data = { description: 'Rent', amount: 500000 };
    db.addExpense.mockResolvedValue(1);
    const result = await callHandler('add-expense', data);
    expect(db.addExpense).toHaveBeenCalledWith(data);
    expect(result).toBe(1);
  });

  it('update-expense delegates to db.updateExpense', async () => {
    const data = { id: 1, fields: { amount: 600000 } };
    db.updateExpense.mockResolvedValue({ success: true });
    const result = await callHandler('update-expense', data);
    expect(db.updateExpense).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('delete-expense-by-id delegates to db.deleteExpenseById', async () => {
    db.deleteExpenseById.mockResolvedValue(undefined);
    await callHandler('delete-expense-by-id', 5);
    expect(db.deleteExpenseById).toHaveBeenCalledWith(5);
  });

  it('propagates errors from expense handlers', async () => {
    db.getAllExpenses.mockRejectedValue(new Error('no db'));
    await expect(callHandler('get-all-expenses')).rejects.toThrow('no db');
  });
});

// ---------------------------------------------------------------------------
// Pagina Estudiantes
// ---------------------------------------------------------------------------
describe('Students handlers', () => {
  it('get-all-students delegates to db.getAllStudents', async () => {
    db.getAllStudents.mockResolvedValue([{ name: 'Juan' }]);
    const result = await callHandler('get-all-students');
    expect(db.getAllStudents).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Juan' }]);
  });

  it('get-students-by-active delegates to db.getStudentsByActive', async () => {
    db.getStudentsByActive.mockResolvedValue([{ name: 'Active' }]);
    const result = await callHandler('get-students-by-active', 1);
    expect(db.getStudentsByActive).toHaveBeenCalledWith(1);
    expect(result).toEqual([{ name: 'Active' }]);
  });

  it('get-students-active delegates to db.getStudentsActive', async () => {
    db.getStudentsActive.mockResolvedValue([1, 0]);
    const result = await callHandler('get-students-active');
    expect(db.getStudentsActive).toHaveBeenCalledOnce();
    expect(result).toEqual([1, 0]);
  });

  it('get-students-count delegates to db.getStudentCount', async () => {
    db.getStudentCount.mockResolvedValue([{ 'COUNT(*)': 5 }]);
    const result = await callHandler('get-students-count');
    expect(db.getStudentCount).toHaveBeenCalledOnce();
    expect(result).toEqual([{ 'COUNT(*)': 5 }]);
  });

  it('add-student delegates to db.addStudent', async () => {
    const data = { name: 'Maria' };
    db.addStudent.mockResolvedValue(42);
    const result = await callHandler('add-student', data);
    expect(db.addStudent).toHaveBeenCalledWith(data);
    expect(result).toBe(42);
  });

  it('update-student delegates to db.updateStudent', async () => {
    const data = { id: 1, fields: { name: 'New' } };
    db.updateStudent.mockResolvedValue({ success: true });
    const result = await callHandler('update-student', data);
    expect(db.updateStudent).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('delete-student-by-id delegates to db.deleteStudentById', async () => {
    db.deleteStudentById.mockResolvedValue(undefined);
    await callHandler('delete-student-by-id', 7);
    expect(db.deleteStudentById).toHaveBeenCalledWith(7);
  });

  it('import-student delegates to db.importStudents', async () => {
    const data = [{ name: 'Juan', activo: 'Si' }];
    db.importStudents.mockResolvedValue({ success: true });
    const result = await callHandler('import-student', data);
    expect(db.importStudents).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });
});

// ---------------------------------------------------------------------------
// Pagina Profesores
// ---------------------------------------------------------------------------
describe('Teachers handlers', () => {
  it('get-all-teachers delegates to db.getAllTeachers', async () => {
    db.getAllTeachers.mockResolvedValue([{ name: 'Prof A' }]);
    const result = await callHandler('get-all-teachers');
    expect(db.getAllTeachers).toHaveBeenCalledOnce();
    expect(result).toEqual([{ name: 'Prof A' }]);
  });

  it('add-teacher delegates to db.addTeacher', async () => {
    const data = { name: 'Prof B' };
    db.addTeacher.mockResolvedValue({ lastInsertRowid: 1 });
    const result = await callHandler('add-teacher', data);
    expect(db.addTeacher).toHaveBeenCalledWith(data);
    expect(result).toEqual({ lastInsertRowid: 1 });
  });

  it('delete-teacher-by-id delegates to db.deleteTeacherById', async () => {
    db.deleteTeacherById.mockResolvedValue(undefined);
    await callHandler('delete-teacher-by-id', 10);
    expect(db.deleteTeacherById).toHaveBeenCalledWith(10);
  });

  it('update-teacher delegates to db.updateTeacher', async () => {
    const data = { id: 1, fields: { name: 'Updated' } };
    db.updateTeacher.mockResolvedValue({ success: true });
    const result = await callHandler('update-teacher', data);
    expect(db.updateTeacher).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });
});

// ---------------------------------------------------------------------------
// Pagina Report
// ---------------------------------------------------------------------------
describe('Report handlers', () => {
  it('get-cash-register delegates to db.getCashRegister', async () => {
    db.getCashRegister.mockResolvedValue([{ type: 'payment' }]);
    const result = await callHandler('get-cash-register');
    expect(db.getCashRegister).toHaveBeenCalledOnce();
    expect(result).toEqual([{ type: 'payment' }]);
  });
});

// ---------------------------------------------------------------------------
// Pagina Precios
// ---------------------------------------------------------------------------
describe('Pricing handlers', () => {
  it('add-division delegates to db.addDivision', async () => {
    const division = { name: 'NewDiv' };
    db.addDivision.mockResolvedValue({ lastInsertRowid: 5 });
    const result = await callHandler('add-division', division);
    expect(db.addDivision).toHaveBeenCalledWith(division);
    expect(result).toEqual({ lastInsertRowid: 5 });
  });

  it('delete-division delegates to db.deleteDivision', async () => {
    db.deleteDivision.mockResolvedValue(undefined);
    await callHandler('delete-division', 3);
    expect(db.deleteDivision).toHaveBeenCalledWith(3);
  });

  it('update-division delegates to db.updateDivision with id and name', async () => {
    db.updateDivision.mockResolvedValue({ success: true });
    const result = await callHandler('update-division', { id: 2, name: 'Renamed' });
    expect(db.updateDivision).toHaveBeenCalledWith(2, 'Renamed');
    expect(result).toEqual({ success: true });
  });

  it('update-price-concept delegates to db.updatePriceConcept', async () => {
    const concept = { id: 1, amount: 50000 };
    db.updatePriceConcept.mockResolvedValue(undefined);
    await callHandler('update-price-concept', concept);
    expect(db.updatePriceConcept).toHaveBeenCalledWith(concept);
  });

  it('update-price-division delegates to db.updatePriceDivision', async () => {
    const division = { id: 1, amount: 75000 };
    db.updatePriceDivision.mockResolvedValue(undefined);
    await callHandler('update-price-division', division);
    expect(db.updatePriceDivision).toHaveBeenCalledWith(division);
  });

  it('get-all-division-payment-concepts delegates to db.getAllDivisionPaymentConcepts', async () => {
    db.getAllDivisionPaymentConcepts.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler('get-all-division-payment-concepts');
    expect(db.getAllDivisionPaymentConcepts).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('update-division-payment-concept delegates with id and amount', async () => {
    db.updateDivisionPaymentConcept.mockResolvedValue(1);
    const result = await callHandler('update-division-payment-concept', { id: 10, amount: 999 });
    expect(db.updateDivisionPaymentConcept).toHaveBeenCalledWith(10, 999);
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
    const result = await callHandler('export-receipt-excel', payment);
    expect(excel.exportReceiptToExcel).toHaveBeenCalledWith(payment);
    expect(result).toBe(true);
  });

  it('export-report-excel delegates to excel.exportReportToExcel with payments', async () => {
    const data = { payments: [{ id: 1 }, { id: 2 }] };
    excel.exportReportToExcel.mockResolvedValue(true);
    const result = await callHandler('export-report-excel', data);
    expect(excel.exportReportToExcel).toHaveBeenCalledWith(data.payments);
    expect(result).toBe(true);
  });

  it('export-cash-register-report delegates to excel.exportCashRegisterReportToExcel', async () => {
    const data = { entries: [] };
    excel.exportCashRegisterReportToExcel.mockResolvedValue(true);
    const result = await callHandler('export-cash-register-report', data);
    expect(excel.exportCashRegisterReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-payments-by-year delegates to excel.exportPaymentsByYearToExcel', async () => {
    const data = [{ id: 1 }];
    excel.exportPaymentsByYearToExcel.mockResolvedValue(true);
    const result = await callHandler('export-payments-by-year', data);
    expect(excel.exportPaymentsByYearToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-expenses-by-year delegates to excel.exportExpensesByYearToExcel', async () => {
    const data = [{ id: 1 }];
    excel.exportExpensesByYearToExcel.mockResolvedValue(true);
    const result = await callHandler('export-expenses-by-year', data);
    expect(excel.exportExpensesByYearToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-students-by-active delegates with destructured studentData', async () => {
    const studentData = { students: [{ name: 'A' }], payments: [{}], years: ['2025'] };
    excel.exportStudentsByActiveToExcel.mockResolvedValue(true);
    const result = await callHandler('export-students-by-active', studentData);
    expect(excel.exportStudentsByActiveToExcel).toHaveBeenCalledWith(
      studentData.students,
      studentData.payments,
      studentData.years,
    );
    expect(result).toBe(true);
  });

  it('export-students-template delegates to excel.exportTemplateStudents', async () => {
    excel.exportTemplateStudents.mockResolvedValue(true);
    const result = await callHandler('export-students-template');
    expect(excel.exportTemplateStudents).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

  it('export-historic delegates to excel.exportHistoric', async () => {
    const data = { year: '2025' };
    excel.exportHistoric.mockResolvedValue(true);
    const result = await callHandler('export-historic', data);
    expect(excel.exportHistoric).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('import-student-from-excel delegates to excel.importStudentsFromExcel', async () => {
    const data = [{ nombre: 'Juan' }];
    excel.importStudentsFromExcel.mockResolvedValue({ success: true });
    const result = await callHandler('import-student-from-excel', data);
    expect(excel.importStudentsFromExcel).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true });
  });

  it('export-delay-by-month-report delegates to excel.exportDelayByMonthReportToExcel', async () => {
    const data = { months: {} };
    excel.exportDelayByMonthReportToExcel.mockResolvedValue(true);
    const result = await callHandler('export-delay-by-month-report', data);
    expect(excel.exportDelayByMonthReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('export-delay-by-teacher-report delegates to excel.exportDelayByTeacherReportToExcel', async () => {
    const data = { teachers: [] };
    excel.exportDelayByTeacherReportToExcel.mockResolvedValue(true);
    const result = await callHandler('export-delay-by-teacher-report', data);
    expect(excel.exportDelayByTeacherReportToExcel).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it('propagates errors from excel handlers', async () => {
    excel.exportReceiptToExcel.mockRejectedValue(new Error('excel fail'));
    await expect(callHandler('export-receipt-excel', {})).rejects.toThrow('excel fail');
  });
});

// ---------------------------------------------------------------------------
// App functionality
// ---------------------------------------------------------------------------
describe('App functionality handlers', () => {
  it('add-image delegates to db.addImage', async () => {
    const imageData = { image: Buffer.from('test') };
    db.addImage.mockResolvedValue(1);
    const result = await callHandler('add-image', imageData);
    expect(db.addImage).toHaveBeenCalledWith(imageData);
    expect(result).toBe(1);
  });

  it('get-images delegates to db.getImages', async () => {
    db.getImages.mockResolvedValue([{ id: 1 }]);
    const result = await callHandler('get-images');
    expect(db.getImages).toHaveBeenCalledOnce();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('set-image delegates to db.setImage', async () => {
    const imageState = { id: 1, current_image: 1 };
    db.setImage.mockResolvedValue(undefined);
    await callHandler('set-image', imageState);
    expect(db.setImage).toHaveBeenCalledWith(imageState);
  });

  it('get-current-image delegates to db.getCurrentImage', async () => {
    db.getCurrentImage.mockResolvedValue({ id: 1, image: Buffer.from('x') });
    const result = await callHandler('get-current-image');
    expect(db.getCurrentImage).toHaveBeenCalledOnce();
    expect(result).toEqual({ id: 1, image: Buffer.from('x') });
  });

  it('delete-image-by-id delegates to db.deleteImageById', async () => {
    db.deleteImageById.mockResolvedValue(undefined);
    await callHandler('delete-image-by-id', 3);
    expect(db.deleteImageById).toHaveBeenCalledWith(3);
  });

  it('app:quit calls app.quit', async () => {
    const { app } = await import('electron');
    await callHandler('app:quit');
    expect(app.quit).toHaveBeenCalledOnce();
  });
});
