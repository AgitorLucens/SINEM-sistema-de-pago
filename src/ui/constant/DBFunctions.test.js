// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAllPayments,
  addPayment,
  addPaymentWithConsecutive,
  updatePayment,
  getNextConsecutiveByYear,
  getPaymentsByYear,
  getYearsOfPayments,
  getDateOfPayments,
  getPaymentByStudentId,
  deletePaymentById,
  getPaymentConcepts,
  getExpectedIncome,
  getPaymentAmount,
  getPaymentDivisions,
  getDelayPayments,
  getAllExpenses,
  getExpensesByYear,
  getYearsOfExpenses,
  addExpense,
  updateExpense,
  deleteExpenseById,
  getAllStudents,
  getStudentsByActive,
  getStudentsActive,
  getStudentCount,
  addStudent,
  updateStudent,
  deleteStudentById,
  getAllTeachers,
  addTeacher,
  deleteTeacherById,
  updateTeacher,
  addDivision,
  deleteDivision,
  updateDivision,
  updatePriceConcept,
  updatePriceDivision,
  getAllDivisionPaymentConcepts,
  updateDivisionPaymentConcept,
  getCashRegister,
  exportReceiptToExcel,
  exportReportToExcel,
  exportCashRegisterReportToExcel,
  exportPaymentsByYearToExcel,
  exportExpensesByYearToExcel,
  exportStudentsByActiveToExcel,
  exportTemplateStudents,
  exportHistoric,
  exportDelayByMonthReportToExcel,
  exportDelayByTeacherReportToExcel,
  importStudentsFromExcel,
  importStudents,
  addImage,
  getImages,
  setImage,
  getCurrentImage,
  deleteImageById,
  quitApp,
} from './DBFunctions.jsx';

const mockApi = {
  getAllPayments: vi.fn(),
  addPayment: vi.fn(),
  addPaymentWithConsecutive: vi.fn(),
  updatePayment: vi.fn(),
  getNextConsecutiveByYear: vi.fn(),
  getPaymentsByYear: vi.fn(),
  getYearsOfPayments: vi.fn(),
  getDateOfPayments: vi.fn(),
  getPaymentByStudentId: vi.fn(),
  deletePaymentById: vi.fn(),
  getPaymentConcepts: vi.fn(),
  getExpectedIncome: vi.fn(),
  getPaymentAmount: vi.fn(),
  getPaymentDivisions: vi.fn(),
  getDelayPayments: vi.fn(),
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
  addDivision: vi.fn(),
  deleteDivision: vi.fn(),
  updateDivision: vi.fn(),
  updatePriceConcept: vi.fn(),
  updatePriceDivision: vi.fn(),
  getAllDivisionPaymentConcepts: vi.fn(),
  updateDivisionPaymentConcept: vi.fn(),
  getCashRegister: vi.fn(),
  exportReceiptToExcel: vi.fn(),
  exportReportToExcel: vi.fn(),
  exportCashRegisterReportToExcel: vi.fn(),
  exportPaymentsByYearToExcel: vi.fn(),
  exportExpensesByYearToExcel: vi.fn(),
  exportStudentsByActiveToExcel: vi.fn(),
  exportTemplateStudents: vi.fn(),
  exportHistoric: vi.fn(),
  exportDelayByMonthReportToExcel: vi.fn(),
  exportDelayByTeacherReportToExcel: vi.fn(),
  importStudentsFromExcel: vi.fn(),
  importStudents: vi.fn(),
  addImage: vi.fn(),
  getImages: vi.fn(),
  setImage: vi.fn(),
  getCurrentImage: vi.fn(),
  deleteImageById: vi.fn(),
  quitApp: vi.fn(),
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  window.api = mockApi;
  for (const key of Object.keys(mockApi)) {
    mockApi[key].mockReset();
  }
});

describe('DBFunctions', () => {
  describe('Payments', () => {
    it('getAllPayments resolves with data', async () => {
      const data = [{ id: 1, amount: 5000 }];
      mockApi.getAllPayments.mockResolvedValue(data);
      const result = await getAllPayments();
      expect(result).toEqual(data);
    });

    it('getAllPayments rejects and returns error object', async () => {
      mockApi.getAllPayments.mockRejectedValue(new Error('fail'));
      const result = await getAllPayments();
      expect(result).toEqual({ error: "Error al cargar pagos." });
    });

    it('addPayment resolves with result', async () => {
      const payment = { amount: 10000 };
      mockApi.addPayment.mockResolvedValue({ id: 2 });
      const result = await addPayment(payment);
      expect(result).toEqual({ id: 2 });
      expect(mockApi.addPayment).toHaveBeenCalledWith(payment);
    });

    it('addPayment rejects and returns error object', async () => {
      mockApi.addPayment.mockRejectedValue(new Error('fail'));
      const result = await addPayment({});
      expect(result).toEqual({ error: "Error al agregar pago." });
    });

    it('addPaymentWithConsecutive resolves with result', async () => {
      const payment = { amount: 10000 };
      mockApi.addPaymentWithConsecutive.mockResolvedValue({ id: 3 });
      const result = await addPaymentWithConsecutive(payment);
      expect(result).toEqual({ id: 3 });
      expect(mockApi.addPaymentWithConsecutive).toHaveBeenCalledWith(payment);
    });

    it('addPaymentWithConsecutive rejects and returns error with message', async () => {
      mockApi.addPaymentWithConsecutive.mockRejectedValue(new Error('db error'));
      const result = await addPaymentWithConsecutive({});
      expect(result).toEqual({ error: "Error al agregar pago: db error" });
    });

    it('updatePayment resolves with result', async () => {
      const payment = { id: 1, amount: 20000 };
      mockApi.updatePayment.mockResolvedValue({ success: true });
      const result = await updatePayment(payment);
      expect(result).toEqual({ success: true });
      expect(mockApi.updatePayment).toHaveBeenCalledWith(payment);
    });

    it('updatePayment rejects and returns error object', async () => {
      mockApi.updatePayment.mockRejectedValue(new Error('fail'));
      const result = await updatePayment({});
      expect(result).toEqual({ error: "Error al cambiar pago." });
    });

    it('getNextConsecutiveByYear resolves with sequence', async () => {
      mockApi.getNextConsecutiveByYear.mockResolvedValue(5);
      const result = await getNextConsecutiveByYear(2024);
      expect(result).toBe(5);
      expect(mockApi.getNextConsecutiveByYear).toHaveBeenCalledWith(2024);
    });

    it('getNextConsecutiveByYear rejects and returns error object', async () => {
      mockApi.getNextConsecutiveByYear.mockRejectedValue(new Error('fail'));
      const result = await getNextConsecutiveByYear(2024);
      expect(result).toEqual({ error: "Error al obtener consecutivo." });
    });

    it('getPaymentsByYear resolves with payments', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockApi.getPaymentsByYear.mockResolvedValue(data);
      const result = await getPaymentsByYear(2024);
      expect(result).toEqual(data);
      expect(mockApi.getPaymentsByYear).toHaveBeenCalledWith(2024);
    });

    it('getPaymentsByYear rejects and returns empty array', async () => {
      mockApi.getPaymentsByYear.mockRejectedValue(new Error('fail'));
      const result = await getPaymentsByYear(2024);
      expect(result).toEqual([]);
    });

    it('getYearsOfPayments resolves with years', async () => {
      const data = [2023, 2024];
      mockApi.getYearsOfPayments.mockResolvedValue(data);
      const result = await getYearsOfPayments();
      expect(result).toEqual(data);
    });

    it('getYearsOfPayments rejects and returns empty array', async () => {
      mockApi.getYearsOfPayments.mockRejectedValue(new Error('fail'));
      const result = await getYearsOfPayments();
      expect(result).toEqual([]);
    });

    it('getDateOfPayments resolves with dates', async () => {
      const data = ['2024-01-15'];
      mockApi.getDateOfPayments.mockResolvedValue(data);
      const result = await getDateOfPayments();
      expect(result).toEqual(data);
    });

    it('getDateOfPayments rejects and returns empty array', async () => {
      mockApi.getDateOfPayments.mockRejectedValue(new Error('fail'));
      const result = await getDateOfPayments();
      expect(result).toEqual([]);
    });

    it('getPaymentByStudentId resolves with data', async () => {
      const data = [{ id: 1, student_id: 5 }];
      mockApi.getPaymentByStudentId.mockResolvedValue(data);
      const result = await getPaymentByStudentId(5);
      expect(result).toEqual(data);
      expect(mockApi.getPaymentByStudentId).toHaveBeenCalledWith(5);
    });

    it('getPaymentByStudentId rejects and returns error object', async () => {
      mockApi.getPaymentByStudentId.mockRejectedValue(new Error('fail'));
      const result = await getPaymentByStudentId(5);
      expect(result).toEqual({ error: "Error al obtener pago por ID de estudiante" });
    });

    it('deletePaymentById resolves with result', async () => {
      mockApi.deletePaymentById.mockResolvedValue({ success: true });
      const result = await deletePaymentById(10);
      expect(result).toEqual({ success: true });
      expect(mockApi.deletePaymentById).toHaveBeenCalledWith(10);
    });

    it('deletePaymentById rejects and returns empty array', async () => {
      mockApi.deletePaymentById.mockRejectedValue(new Error('fail'));
      const result = await deletePaymentById(10);
      expect(result).toEqual([]);
    });

    it('getPaymentConcepts resolves with concepts', async () => {
      const data = [{ type: 'Matricula' }];
      mockApi.getPaymentConcepts.mockResolvedValue(data);
      const result = await getPaymentConcepts();
      expect(result).toEqual(data);
    });

    it('getPaymentConcepts rejects and returns empty array', async () => {
      mockApi.getPaymentConcepts.mockRejectedValue(new Error('fail'));
      const result = await getPaymentConcepts();
      expect(result).toEqual([]);
    });

    it('getExpectedIncome resolves with income data', async () => {
      const data = { matricula: 50000, monthly: 200000 };
      mockApi.getExpectedIncome.mockResolvedValue(data);
      const result = await getExpectedIncome([2024]);
      expect(result).toEqual(data);
      expect(mockApi.getExpectedIncome).toHaveBeenCalledWith([2024]);
    });

    it('getExpectedIncome rejects and returns zeroed object', async () => {
      mockApi.getExpectedIncome.mockRejectedValue(new Error('fail'));
      const result = await getExpectedIncome([2024]);
      expect(result).toEqual({ matricula: 0, monthly: 0 });
    });

    it('getPaymentAmount resolves with amount', async () => {
      mockApi.getPaymentAmount.mockResolvedValue(15000);
      const result = await getPaymentAmount(1, 2);
      expect(result).toBe(15000);
      expect(mockApi.getPaymentAmount).toHaveBeenCalledWith({ divisionId: 1, conceptId: 2 });
    });

    it('getPaymentAmount rejects and returns 0', async () => {
      mockApi.getPaymentAmount.mockRejectedValue(new Error('fail'));
      const result = await getPaymentAmount(1, 2);
      expect(result).toBe(0);
    });

    it('getPaymentDivisions resolves with divisions', async () => {
      const data = [{ name: 'SINEM' }];
      mockApi.getPaymentDivisions.mockResolvedValue(data);
      const result = await getPaymentDivisions();
      expect(result).toEqual(data);
    });

    it('getPaymentDivisions rejects and returns empty array', async () => {
      mockApi.getPaymentDivisions.mockRejectedValue(new Error('fail'));
      const result = await getPaymentDivisions();
      expect(result).toEqual([]);
    });

    it('getDelayPayments resolves with delays', async () => {
      const data = [{ month: 3, total: 5000 }];
      mockApi.getDelayPayments.mockResolvedValue(data);
      const result = await getDelayPayments(2024);
      expect(result).toEqual(data);
      expect(mockApi.getDelayPayments).toHaveBeenCalledWith(2024);
    });

    it('getDelayPayments rejects and returns empty array', async () => {
      mockApi.getDelayPayments.mockRejectedValue(new Error('fail'));
      const result = await getDelayPayments(2024);
      expect(result).toEqual([]);
    });
  });

  describe('Expenses', () => {
    it('getAllExpenses resolves with data', async () => {
      const data = [{ id: 1, description: 'Rent' }];
      mockApi.getAllExpenses.mockResolvedValue(data);
      const result = await getAllExpenses();
      expect(result).toEqual(data);
    });

    it('getAllExpenses rejects and returns empty array', async () => {
      mockApi.getAllExpenses.mockRejectedValue(new Error('fail'));
      const result = await getAllExpenses();
      expect(result).toEqual([]);
    });

    it('getExpensesByYear resolves with data', async () => {
      const data = [{ id: 1 }];
      mockApi.getExpensesByYear.mockResolvedValue(data);
      const result = await getExpensesByYear(2024);
      expect(result).toEqual(data);
      expect(mockApi.getExpensesByYear).toHaveBeenCalledWith(2024);
    });

    it('getExpensesByYear rejects and returns empty array', async () => {
      mockApi.getExpensesByYear.mockRejectedValue(new Error('fail'));
      const result = await getExpensesByYear(2024);
      expect(result).toEqual([]);
    });

    it('getYearsOfExpenses resolves with years', async () => {
      const data = [2023, 2024];
      mockApi.getYearsOfExpenses.mockResolvedValue(data);
      const result = await getYearsOfExpenses();
      expect(result).toEqual(data);
    });

    it('getYearsOfExpenses rejects and returns empty array', async () => {
      mockApi.getYearsOfExpenses.mockRejectedValue(new Error('fail'));
      const result = await getYearsOfExpenses();
      expect(result).toEqual([]);
    });

    it('addExpense resolves with result', async () => {
      const expense = { description: 'Rent', amount: 500000 };
      mockApi.addExpense.mockResolvedValue({ id: 1 });
      const result = await addExpense(expense);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.addExpense).toHaveBeenCalledWith(expense);
    });

    it('addExpense rejects and returns error with message', async () => {
      mockApi.addExpense.mockRejectedValue(new Error('db error'));
      const result = await addExpense({});
      expect(result).toEqual({ error: 'db error' });
    });

    it('updateExpense resolves with result', async () => {
      const expense = { id: 1, amount: 600000 };
      mockApi.updateExpense.mockResolvedValue({ success: true });
      const result = await updateExpense(expense);
      expect(result).toEqual({ success: true });
      expect(mockApi.updateExpense).toHaveBeenCalledWith(expense);
    });

    it('updateExpense rejects and returns error object', async () => {
      mockApi.updateExpense.mockRejectedValue(new Error('fail'));
      const result = await updateExpense({});
      expect(result).toEqual({ error: "Error al cambiar gasto" });
    });

    it('deleteExpenseById resolves with result', async () => {
      mockApi.deleteExpenseById.mockResolvedValue({ success: true });
      const result = await deleteExpenseById(5);
      expect(result).toEqual({ success: true });
      expect(mockApi.deleteExpenseById).toHaveBeenCalledWith(5);
    });

    it('deleteExpenseById rejects and returns empty array', async () => {
      mockApi.deleteExpenseById.mockRejectedValue(new Error('fail'));
      const result = await deleteExpenseById(5);
      expect(result).toEqual([]);
    });
  });

  describe('Students', () => {
    it('getAllStudents resolves with data', async () => {
      const data = [{ id: 1, name: 'Juan' }];
      mockApi.getAllStudents.mockResolvedValue(data);
      const result = await getAllStudents();
      expect(result).toEqual(data);
    });

    it('getAllStudents rejects and returns empty array', async () => {
      mockApi.getAllStudents.mockRejectedValue(new Error('fail'));
      const result = await getAllStudents();
      expect(result).toEqual([]);
    });

    it('getStudentsByActive resolves with data', async () => {
      const data = [{ id: 1, active: 1 }];
      mockApi.getStudentsByActive.mockResolvedValue(data);
      const result = await getStudentsByActive(1);
      expect(result).toEqual(data);
      expect(mockApi.getStudentsByActive).toHaveBeenCalledWith(1);
    });

    it('getStudentsByActive rejects and returns empty array', async () => {
      mockApi.getStudentsByActive.mockRejectedValue(new Error('fail'));
      const result = await getStudentsByActive(1);
      expect(result).toEqual([]);
    });

    it('getStudentsActive resolves with data', async () => {
      const data = [{ active: 1, count: 25 }];
      mockApi.getStudentsActive.mockResolvedValue(data);
      const result = await getStudentsActive();
      expect(result).toEqual(data);
    });

    it('getStudentsActive rejects and returns empty array', async () => {
      mockApi.getStudentsActive.mockRejectedValue(new Error('fail'));
      const result = await getStudentsActive();
      expect(result).toEqual([]);
    });

    it('getStudentCount resolves with data', async () => {
      const data = [{ count: 30 }];
      mockApi.getStudentCount.mockResolvedValue(data);
      const result = await getStudentCount();
      expect(result).toEqual(data);
    });

    it('getStudentCount rejects and returns empty array', async () => {
      mockApi.getStudentCount.mockRejectedValue(new Error('fail'));
      const result = await getStudentCount();
      expect(result).toEqual([]);
    });

    it('addStudent resolves with result', async () => {
      const student = { name: 'Maria' };
      mockApi.addStudent.mockResolvedValue({ id: 5 });
      const result = await addStudent(student);
      expect(result).toEqual({ id: 5 });
      expect(mockApi.addStudent).toHaveBeenCalledWith(student);
    });

    it('addStudent rejects and returns empty array', async () => {
      mockApi.addStudent.mockRejectedValue(new Error('fail'));
      const result = await addStudent({});
      expect(result).toEqual([]);
    });

    it('updateStudent resolves with result', async () => {
      const student = { id: 1, name: 'Ana' };
      mockApi.updateStudent.mockResolvedValue({ success: true });
      const result = await updateStudent(student);
      expect(result).toEqual({ success: true });
      expect(mockApi.updateStudent).toHaveBeenCalledWith(student);
    });

    it('updateStudent rejects and returns error object', async () => {
      mockApi.updateStudent.mockRejectedValue(new Error('fail'));
      const result = await updateStudent({});
      expect(result).toEqual({ error: "Error al cambiar estudiante." });
    });

    it('deleteStudentById resolves with result', async () => {
      mockApi.deleteStudentById.mockResolvedValue({ success: true });
      const result = await deleteStudentById(3);
      expect(result).toEqual({ success: true });
      expect(mockApi.deleteStudentById).toHaveBeenCalledWith(3);
    });

    it('deleteStudentById rejects and returns empty array', async () => {
      mockApi.deleteStudentById.mockRejectedValue(new Error('fail'));
      const result = await deleteStudentById(3);
      expect(result).toEqual([]);
    });
  });

  describe('Teachers', () => {
    it('getAllTeachers resolves with data', async () => {
      const data = [{ id: 1, name: 'Prof Lopez' }];
      mockApi.getAllTeachers.mockResolvedValue(data);
      const result = await getAllTeachers();
      expect(result).toEqual(data);
    });

    it('getAllTeachers rejects and returns error object', async () => {
      mockApi.getAllTeachers.mockRejectedValue(new Error('fail'));
      const result = await getAllTeachers();
      expect(result).toEqual({ error: "Error al obtener profesores." });
    });

    it('addTeacher resolves with result', async () => {
      const teacher = { name: 'Prof Garcia' };
      mockApi.addTeacher.mockResolvedValue({ id: 2 });
      const result = await addTeacher(teacher);
      expect(result).toEqual({ id: 2 });
      expect(mockApi.addTeacher).toHaveBeenCalledWith(teacher);
    });

    it('addTeacher rejects and returns error with message', async () => {
      mockApi.addTeacher.mockRejectedValue(new Error('duplicate'));
      const result = await addTeacher({});
      expect(result).toEqual({ error: "Error al agregar profesor: duplicate" });
    });

    it('deleteTeacherById resolves with result', async () => {
      mockApi.deleteTeacherById.mockResolvedValue({ success: true });
      const result = await deleteTeacherById(1);
      expect(result).toEqual({ success: true });
      expect(mockApi.deleteTeacherById).toHaveBeenCalledWith(1);
    });

    it('deleteTeacherById rejects and returns error with message', async () => {
      mockApi.deleteTeacherById.mockRejectedValue(new Error('not found'));
      const result = await deleteTeacherById(1);
      expect(result).toEqual({ error: "Error al eliminar profesor. not found" });
    });

    it('updateTeacher resolves with result', async () => {
      const teacher = { id: 1, name: 'Prof Updated' };
      mockApi.updateTeacher.mockResolvedValue({ success: true });
      const result = await updateTeacher(teacher);
      expect(result).toEqual({ success: true });
      expect(mockApi.updateTeacher).toHaveBeenCalledWith(teacher);
    });

    it('updateTeacher rejects and returns error with message', async () => {
      mockApi.updateTeacher.mockRejectedValue(new Error('fail'));
      const result = await updateTeacher({});
      expect(result).toEqual({ error: "Error al cambiar profesor: fail" });
    });
  });

  describe('Pricing', () => {
    it('addDivision resolves with result', async () => {
      const division = { name: 'SINEM' };
      mockApi.addDivision.mockResolvedValue({ id: 1 });
      const result = await addDivision(division);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.addDivision).toHaveBeenCalledWith(division);
    });

    it('addDivision rejects and returns empty array', async () => {
      mockApi.addDivision.mockRejectedValue(new Error('fail'));
      const result = await addDivision({});
      expect(result).toEqual([]);
    });

    it('deleteDivision resolves with result', async () => {
      mockApi.deleteDivision.mockResolvedValue({ success: true });
      const result = await deleteDivision(1);
      expect(result).toEqual({ success: true });
      expect(mockApi.deleteDivision).toHaveBeenCalledWith(1);
    });

    it('deleteDivision rejects and returns empty array', async () => {
      mockApi.deleteDivision.mockRejectedValue(new Error('fail'));
      const result = await deleteDivision(1);
      expect(result).toEqual([]);
    });

    it('updateDivision resolves with result', async () => {
      const data = { id: 1, name: 'Updated' };
      mockApi.updateDivision.mockResolvedValue({ success: true });
      const result = await updateDivision(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.updateDivision).toHaveBeenCalledWith(data);
    });

    it('updateDivision rejects and returns empty array', async () => {
      mockApi.updateDivision.mockRejectedValue(new Error('fail'));
      const result = await updateDivision({});
      expect(result).toEqual([]);
    });

    it('updatePriceConcept resolves with result', async () => {
      const data = { conceptId: 1, amount: 20000 };
      mockApi.updatePriceConcept.mockResolvedValue({ success: true });
      const result = await updatePriceConcept(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.updatePriceConcept).toHaveBeenCalledWith(data);
    });

    it('updatePriceConcept rejects and returns empty array', async () => {
      mockApi.updatePriceConcept.mockRejectedValue(new Error('fail'));
      const result = await updatePriceConcept({});
      expect(result).toEqual([]);
    });

    it('updatePriceDivision resolves with result', async () => {
      const data = { divisionId: 1, amount: 15000 };
      mockApi.updatePriceDivision.mockResolvedValue({ success: true });
      const result = await updatePriceDivision(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.updatePriceDivision).toHaveBeenCalledWith(data);
    });

    it('updatePriceDivision rejects and returns empty array', async () => {
      mockApi.updatePriceDivision.mockRejectedValue(new Error('fail'));
      const result = await updatePriceDivision({});
      expect(result).toEqual([]);
    });

    it('getAllDivisionPaymentConcepts resolves with data', async () => {
      const data = [{ divisionId: 1, conceptId: 2 }];
      mockApi.getAllDivisionPaymentConcepts.mockResolvedValue(data);
      const result = await getAllDivisionPaymentConcepts();
      expect(result).toEqual(data);
    });

    it('getAllDivisionPaymentConcepts rejects and returns empty array', async () => {
      mockApi.getAllDivisionPaymentConcepts.mockRejectedValue(new Error('fail'));
      const result = await getAllDivisionPaymentConcepts();
      expect(result).toEqual([]);
    });

    it('updateDivisionPaymentConcept resolves with result', async () => {
      const data = { divisionId: 1, conceptId: 2, amount: 25000 };
      mockApi.updateDivisionPaymentConcept.mockResolvedValue({ success: true });
      const result = await updateDivisionPaymentConcept(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.updateDivisionPaymentConcept).toHaveBeenCalledWith(data);
    });

    it('updateDivisionPaymentConcept rejects and returns empty array', async () => {
      mockApi.updateDivisionPaymentConcept.mockRejectedValue(new Error('fail'));
      const result = await updateDivisionPaymentConcept({});
      expect(result).toEqual([]);
    });
  });

  describe('Reports', () => {
    it('getCashRegister resolves with data', async () => {
      const data = { total: 500000 };
      mockApi.getCashRegister.mockResolvedValue(data);
      const result = await getCashRegister();
      expect(result).toEqual(data);
    });

    it('getCashRegister rejects and returns empty array', async () => {
      mockApi.getCashRegister.mockRejectedValue(new Error('fail'));
      const result = await getCashRegister();
      expect(result).toEqual([]);
    });
  });

  describe('Excel', () => {
    it('exportReceiptToExcel resolves with result', async () => {
      const payment = { id: 1 };
      mockApi.exportReceiptToExcel.mockResolvedValue({ success: true });
      const result = await exportReceiptToExcel(payment);
      expect(result).toEqual({ success: true });
      expect(mockApi.exportReceiptToExcel).toHaveBeenCalledWith(payment);
    });

    it('exportReceiptToExcel rejects and returns error object', async () => {
      mockApi.exportReceiptToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportReceiptToExcel({});
      expect(result).toEqual({ error: "Error al exportar recivo a excel. Revise que no tenga el archivo con el mismo nombre abierto." });
    });

    it('exportReportToExcel resolves with result', async () => {
      const data = { year: 2024 };
      mockApi.exportReportToExcel.mockResolvedValue({ success: true });
      const result = await exportReportToExcel(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.exportReportToExcel).toHaveBeenCalledWith(data);
    });

    it('exportReportToExcel rejects and returns error object', async () => {
      mockApi.exportReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte a excel. Revise que no tengaa el archivo con el mismo nombre abierto." });
    });

    it('exportCashRegisterReportToExcel resolves with result', async () => {
      const data = { month: 6 };
      mockApi.exportCashRegisterReportToExcel.mockResolvedValue({ success: true });
      const result = await exportCashRegisterReportToExcel(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.exportCashRegisterReportToExcel).toHaveBeenCalledWith(data);
    });

    it('exportCashRegisterReportToExcel rejects and returns error object', async () => {
      mockApi.exportCashRegisterReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportCashRegisterReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de caja a excel." });
    });

    it('exportPaymentsByYearToExcel resolves with result', async () => {
      mockApi.exportPaymentsByYearToExcel.mockResolvedValue({ success: true });
      const result = await exportPaymentsByYearToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportPaymentsByYearToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportPaymentsByYearToExcel rejects and returns error object', async () => {
      mockApi.exportPaymentsByYearToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportPaymentsByYearToExcel({});
      expect(result).toEqual({ error: "Error al exportar pagos por año a excel. Revise que no tengaa el archivo con el mismo nombre abierto." });
    });

    it('exportExpensesByYearToExcel resolves with result', async () => {
      mockApi.exportExpensesByYearToExcel.mockResolvedValue({ success: true });
      const result = await exportExpensesByYearToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportExpensesByYearToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportExpensesByYearToExcel rejects and returns error object', async () => {
      mockApi.exportExpensesByYearToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportExpensesByYearToExcel({});
      expect(result).toEqual({ error: "Error al exportar egresos por año a excel." });
    });

    it('exportStudentsByActiveToExcel resolves with result', async () => {
      mockApi.exportStudentsByActiveToExcel.mockResolvedValue({ success: true });
      const result = await exportStudentsByActiveToExcel({ active: 1 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportStudentsByActiveToExcel).toHaveBeenCalledWith({ active: 1 });
    });

    it('exportStudentsByActiveToExcel rejects and returns error object', async () => {
      mockApi.exportStudentsByActiveToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportStudentsByActiveToExcel({});
      expect(result).toEqual({ error: "Error al exportar estudiantes por estado a excel." });
    });

    it('exportTemplateStudents resolves with result', async () => {
      mockApi.exportTemplateStudents.mockResolvedValue({ success: true });
      const result = await exportTemplateStudents();
      expect(result).toEqual({ success: true });
    });

    it('exportTemplateStudents rejects and returns error object', async () => {
      mockApi.exportTemplateStudents.mockRejectedValue(new Error('fail'));
      const result = await exportTemplateStudents();
      expect(result).toEqual({ error: "Error al generar plantilla excel estudiantes." });
    });

    it('exportHistoric resolves with result', async () => {
      mockApi.exportHistoric.mockResolvedValue({ success: true });
      const result = await exportHistoric({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportHistoric).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportHistoric rejects and returns error object', async () => {
      mockApi.exportHistoric.mockRejectedValue(new Error('fail'));
      const result = await exportHistoric({});
      expect(result).toEqual({ error: "Error al exportar respaldo por estado a excel." });
    });

    it('exportDelayByMonthReportToExcel resolves with result', async () => {
      mockApi.exportDelayByMonthReportToExcel.mockResolvedValue({ success: true });
      const result = await exportDelayByMonthReportToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportDelayByMonthReportToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportDelayByMonthReportToExcel rejects and returns error object', async () => {
      mockApi.exportDelayByMonthReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportDelayByMonthReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de morosidad por mes a excel." });
    });

    it('exportDelayByTeacherReportToExcel resolves with result', async () => {
      mockApi.exportDelayByTeacherReportToExcel.mockResolvedValue({ success: true });
      const result = await exportDelayByTeacherReportToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.exportDelayByTeacherReportToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportDelayByTeacherReportToExcel rejects and returns error object', async () => {
      mockApi.exportDelayByTeacherReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportDelayByTeacherReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de morosidad por profesor a excel." });
    });

    it('importStudentsFromExcel resolves with result', async () => {
      const students = [{ name: 'Maria' }];
      mockApi.importStudentsFromExcel.mockResolvedValue({ count: 1 });
      const result = await importStudentsFromExcel(students);
      expect(result).toEqual({ count: 1 });
      expect(mockApi.importStudentsFromExcel).toHaveBeenCalledWith(students);
    });

    it('importStudentsFromExcel rejects and returns error object', async () => {
      mockApi.importStudentsFromExcel.mockRejectedValue(new Error('fail'));
      const result = await importStudentsFromExcel([]);
      expect(result).toEqual({ error: "Error al exportar respaldo por estado a excel." });
    });

    it('importStudents resolves with result', async () => {
      const students = [{ name: 'Pedro' }];
      mockApi.importStudents.mockResolvedValue({ count: 1 });
      const result = await importStudents(students);
      expect(result).toEqual({ count: 1 });
      expect(mockApi.importStudents).toHaveBeenCalledWith(students);
    });

    it('importStudents rejects and returns error with message', async () => {
      mockApi.importStudents.mockRejectedValue(new Error('invalid data'));
      const result = await importStudents([]);
      expect(result).toEqual({ error: "Error al importar estudiantes: invalid data" });
    });
  });

  describe('Images', () => {
    it('addImage resolves with result', async () => {
      const imageData = { name: 'logo.png' };
      mockApi.addImage.mockResolvedValue({ id: 1 });
      const result = await addImage(imageData);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.addImage).toHaveBeenCalledWith(imageData);
    });

    it('addImage rejects and returns error object', async () => {
      mockApi.addImage.mockRejectedValue(new Error('fail'));
      const result = await addImage({});
      expect(result).toEqual({ error: "Error al agregar imagen." });
    });

    it('getImages resolves with data', async () => {
      const data = [{ id: 1, name: 'logo.png' }];
      mockApi.getImages.mockResolvedValue(data);
      const result = await getImages();
      expect(result).toEqual(data);
    });

    it('getImages rejects and returns error object', async () => {
      mockApi.getImages.mockRejectedValue(new Error('fail'));
      const result = await getImages();
      expect(result).toEqual({ error: "Error al obtener imagenes." });
    });

    it('setImage resolves with result', async () => {
      mockApi.setImage.mockResolvedValue({ success: true });
      const result = await setImage(true);
      expect(result).toEqual({ success: true });
      expect(mockApi.setImage).toHaveBeenCalledWith(true);
    });

    it('setImage rejects and returns error object', async () => {
      mockApi.setImage.mockRejectedValue(new Error('fail'));
      const result = await setImage(true);
      expect(result).toEqual({ error: "Error al establecer imagen." });
    });

    it('getCurrentImage resolves with data', async () => {
      const data = { id: 1, name: 'logo.png' };
      mockApi.getCurrentImage.mockResolvedValue(data);
      const result = await getCurrentImage();
      expect(result).toEqual(data);
    });

    it('getCurrentImage rejects and returns error object', async () => {
      mockApi.getCurrentImage.mockRejectedValue(new Error('fail'));
      const result = await getCurrentImage();
      expect(result).toEqual({ error: "Error al obtener imagen." });
    });

    it('deleteImageById resolves with result', async () => {
      mockApi.deleteImageById.mockResolvedValue({ success: true });
      const result = await deleteImageById(3);
      expect(result).toEqual({ success: true });
      expect(mockApi.deleteImageById).toHaveBeenCalledWith(3);
    });

    it('deleteImageById rejects and returns error object', async () => {
      mockApi.deleteImageById.mockRejectedValue(new Error('fail'));
      const result = await deleteImageById(3);
      expect(result).toEqual({ error: "Error al eliminar imagen." });
    });
  });

  describe('Functionality', () => {
    it('quitApp resolves with result', async () => {
      mockApi.quitApp.mockResolvedValue(undefined);
      const result = await quitApp();
      expect(result).toBeUndefined();
    });

    it('quitApp rejects and returns error object', async () => {
      mockApi.quitApp.mockRejectedValue(new Error('fail'));
      const result = await quitApp();
      expect(result).toEqual({ error: "Error al cerrar la aplicación." });
    });
  });
});
