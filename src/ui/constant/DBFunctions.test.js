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
  payments: {
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
  },
  pricing: {
    getPaymentConcepts: vi.fn(),
    getPaymentAmount: vi.fn(),
    getPaymentDivisions: vi.fn(),
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
  excel: {
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
  },
  images: {
    addImage: vi.fn(),
    getImages: vi.fn(),
    setImage: vi.fn(),
    getCurrentImage: vi.fn(),
    deleteImageById: vi.fn(),
  },
  app: {
    quitApp: vi.fn(),
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  window.api = mockApi;
  for (const ns of Object.keys(mockApi)) {
    for (const key of Object.keys(mockApi[ns])) {
      mockApi[ns][key].mockReset();
    }
  }
});

describe('DBFunctions', () => {
  describe('Payments', () => {
    it('getAllPayments resolves with data', async () => {
      const data = [{ id: 1, amount: 5000 }];
      mockApi.payments.getAllPayments.mockResolvedValue(data);
      const result = await getAllPayments();
      expect(result).toEqual(data);
    });

    it('getAllPayments rejects and returns error object', async () => {
      mockApi.payments.getAllPayments.mockRejectedValue(new Error('fail'));
      const result = await getAllPayments();
      expect(result).toEqual({ error: "Error al cargar pagos." });
    });

    it('addPayment resolves with result', async () => {
      const payment = { amount: 10000 };
      mockApi.payments.addPayment.mockResolvedValue({ id: 2 });
      const result = await addPayment(payment);
      expect(result).toEqual({ id: 2 });
      expect(mockApi.payments.addPayment).toHaveBeenCalledWith(payment);
    });

    it('addPayment rejects and returns error object', async () => {
      mockApi.payments.addPayment.mockRejectedValue(new Error('fail'));
      const result = await addPayment({});
      expect(result).toEqual({ error: "Error al agregar pago." });
    });

    it('addPaymentWithConsecutive resolves with result', async () => {
      const payment = { amount: 10000 };
      mockApi.payments.addPaymentWithConsecutive.mockResolvedValue({ id: 3 });
      const result = await addPaymentWithConsecutive(payment);
      expect(result).toEqual({ id: 3 });
      expect(mockApi.payments.addPaymentWithConsecutive).toHaveBeenCalledWith(payment);
    });

    it('addPaymentWithConsecutive rejects and returns error with message', async () => {
      mockApi.payments.addPaymentWithConsecutive.mockRejectedValue(new Error('db error'));
      const result = await addPaymentWithConsecutive({});
      expect(result).toEqual({ error: "Error al agregar pago: db error" });
    });

    it('updatePayment resolves with result', async () => {
      const payment = { id: 1, amount: 20000 };
      mockApi.payments.updatePayment.mockResolvedValue({ success: true });
      const result = await updatePayment(payment);
      expect(result).toEqual({ success: true });
      expect(mockApi.payments.updatePayment).toHaveBeenCalledWith(payment);
    });

    it('updatePayment rejects and returns error object', async () => {
      mockApi.payments.updatePayment.mockRejectedValue(new Error('fail'));
      const result = await updatePayment({});
      expect(result).toEqual({ error: "Error al cambiar pago." });
    });

    it('getNextConsecutiveByYear resolves with sequence', async () => {
      mockApi.payments.getNextConsecutiveByYear.mockResolvedValue(5);
      const result = await getNextConsecutiveByYear(2024);
      expect(result).toBe(5);
      expect(mockApi.payments.getNextConsecutiveByYear).toHaveBeenCalledWith(2024);
    });

    it('getNextConsecutiveByYear rejects and returns error object', async () => {
      mockApi.payments.getNextConsecutiveByYear.mockRejectedValue(new Error('fail'));
      const result = await getNextConsecutiveByYear(2024);
      expect(result).toEqual({ error: "Error al obtener consecutivo." });
    });

    it('getPaymentsByYear resolves with payments', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockApi.payments.getPaymentsByYear.mockResolvedValue(data);
      const result = await getPaymentsByYear(2024);
      expect(result).toEqual(data);
      expect(mockApi.payments.getPaymentsByYear).toHaveBeenCalledWith(2024);
    });

    it('getPaymentsByYear rejects and returns empty array', async () => {
      mockApi.payments.getPaymentsByYear.mockRejectedValue(new Error('fail'));
      const result = await getPaymentsByYear(2024);
      expect(result).toEqual([]);
    });

    it('getYearsOfPayments resolves with years', async () => {
      const data = [2023, 2024];
      mockApi.payments.getYearsOfPayments.mockResolvedValue(data);
      const result = await getYearsOfPayments();
      expect(result).toEqual(data);
    });

    it('getYearsOfPayments rejects and returns empty array', async () => {
      mockApi.payments.getYearsOfPayments.mockRejectedValue(new Error('fail'));
      const result = await getYearsOfPayments();
      expect(result).toEqual([]);
    });

    it('getDateOfPayments resolves with dates', async () => {
      const data = ['2024-01-15'];
      mockApi.payments.getDateOfPayments.mockResolvedValue(data);
      const result = await getDateOfPayments();
      expect(result).toEqual(data);
    });

    it('getDateOfPayments rejects and returns empty array', async () => {
      mockApi.payments.getDateOfPayments.mockRejectedValue(new Error('fail'));
      const result = await getDateOfPayments();
      expect(result).toEqual([]);
    });

    it('getPaymentByStudentId resolves with data', async () => {
      const data = [{ id: 1, student_id: 5 }];
      mockApi.payments.getPaymentByStudentId.mockResolvedValue(data);
      const result = await getPaymentByStudentId(5);
      expect(result).toEqual(data);
      expect(mockApi.payments.getPaymentByStudentId).toHaveBeenCalledWith(5);
    });

    it('getPaymentByStudentId rejects and returns error object', async () => {
      mockApi.payments.getPaymentByStudentId.mockRejectedValue(new Error('fail'));
      const result = await getPaymentByStudentId(5);
      expect(result).toEqual({ error: "Error al obtener pago por ID de estudiante" });
    });

    it('deletePaymentById resolves with result', async () => {
      mockApi.payments.deletePaymentById.mockResolvedValue({ success: true });
      const result = await deletePaymentById(10);
      expect(result).toEqual({ success: true });
      expect(mockApi.payments.deletePaymentById).toHaveBeenCalledWith(10);
    });

    it('deletePaymentById rejects and returns empty array', async () => {
      mockApi.payments.deletePaymentById.mockRejectedValue(new Error('fail'));
      const result = await deletePaymentById(10);
      expect(result).toEqual([]);
    });

    it('getPaymentConcepts resolves with concepts', async () => {
      const data = [{ type: 'Matricula' }];
      mockApi.pricing.getPaymentConcepts.mockResolvedValue(data);
      const result = await getPaymentConcepts();
      expect(result).toEqual(data);
    });

    it('getPaymentConcepts rejects and returns empty array', async () => {
      mockApi.pricing.getPaymentConcepts.mockRejectedValue(new Error('fail'));
      const result = await getPaymentConcepts();
      expect(result).toEqual([]);
    });

    it('getExpectedIncome resolves with income data', async () => {
      const data = { matricula: 50000, monthly: 200000 };
      mockApi.reports.getExpectedIncome.mockResolvedValue(data);
      const result = await getExpectedIncome([2024]);
      expect(result).toEqual(data);
      expect(mockApi.reports.getExpectedIncome).toHaveBeenCalledWith([2024]);
    });

    it('getExpectedIncome rejects and returns zeroed object', async () => {
      mockApi.reports.getExpectedIncome.mockRejectedValue(new Error('fail'));
      const result = await getExpectedIncome([2024]);
      expect(result).toEqual({ matricula: 0, monthly: 0 });
    });

    it('getPaymentAmount resolves with amount', async () => {
      mockApi.pricing.getPaymentAmount.mockResolvedValue(15000);
      const result = await getPaymentAmount(1, 2);
      expect(result).toBe(15000);
      expect(mockApi.pricing.getPaymentAmount).toHaveBeenCalledWith({ divisionId: 1, conceptId: 2 });
    });

    it('getPaymentAmount rejects and returns 0', async () => {
      mockApi.pricing.getPaymentAmount.mockRejectedValue(new Error('fail'));
      const result = await getPaymentAmount(1, 2);
      expect(result).toBe(0);
    });

    it('getPaymentDivisions resolves with divisions', async () => {
      const data = [{ name: 'SINEM' }];
      mockApi.pricing.getPaymentDivisions.mockResolvedValue(data);
      const result = await getPaymentDivisions();
      expect(result).toEqual(data);
    });

    it('getPaymentDivisions rejects and returns empty array', async () => {
      mockApi.pricing.getPaymentDivisions.mockRejectedValue(new Error('fail'));
      const result = await getPaymentDivisions();
      expect(result).toEqual([]);
    });

    it('getDelayPayments resolves with delays', async () => {
      const data = [{ month: 3, total: 5000 }];
      mockApi.reports.getDelayPayments.mockResolvedValue(data);
      const result = await getDelayPayments(2024);
      expect(result).toEqual(data);
      expect(mockApi.reports.getDelayPayments).toHaveBeenCalledWith(2024);
    });

    it('getDelayPayments rejects and returns empty array', async () => {
      mockApi.reports.getDelayPayments.mockRejectedValue(new Error('fail'));
      const result = await getDelayPayments(2024);
      expect(result).toEqual([]);
    });
  });

  describe('Expenses', () => {
    it('getAllExpenses resolves with data', async () => {
      const data = [{ id: 1, description: 'Rent' }];
      mockApi.expenses.getAllExpenses.mockResolvedValue(data);
      const result = await getAllExpenses();
      expect(result).toEqual(data);
    });

    it('getAllExpenses rejects and returns empty array', async () => {
      mockApi.expenses.getAllExpenses.mockRejectedValue(new Error('fail'));
      const result = await getAllExpenses();
      expect(result).toEqual([]);
    });

    it('getExpensesByYear resolves with data', async () => {
      const data = [{ id: 1 }];
      mockApi.expenses.getExpensesByYear.mockResolvedValue(data);
      const result = await getExpensesByYear(2024);
      expect(result).toEqual(data);
      expect(mockApi.expenses.getExpensesByYear).toHaveBeenCalledWith(2024);
    });

    it('getExpensesByYear rejects and returns empty array', async () => {
      mockApi.expenses.getExpensesByYear.mockRejectedValue(new Error('fail'));
      const result = await getExpensesByYear(2024);
      expect(result).toEqual([]);
    });

    it('getYearsOfExpenses resolves with years', async () => {
      const data = [2023, 2024];
      mockApi.expenses.getYearsOfExpenses.mockResolvedValue(data);
      const result = await getYearsOfExpenses();
      expect(result).toEqual(data);
    });

    it('getYearsOfExpenses rejects and returns empty array', async () => {
      mockApi.expenses.getYearsOfExpenses.mockRejectedValue(new Error('fail'));
      const result = await getYearsOfExpenses();
      expect(result).toEqual([]);
    });

    it('addExpense resolves with result', async () => {
      const expense = { description: 'Rent', amount: 500000 };
      mockApi.expenses.addExpense.mockResolvedValue({ id: 1 });
      const result = await addExpense(expense);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.expenses.addExpense).toHaveBeenCalledWith(expense);
    });

    it('addExpense rejects and returns error with message', async () => {
      mockApi.expenses.addExpense.mockRejectedValue(new Error('db error'));
      const result = await addExpense({});
      expect(result).toEqual({ error: 'db error' });
    });

    it('updateExpense resolves with result', async () => {
      const expense = { id: 1, amount: 600000 };
      mockApi.expenses.updateExpense.mockResolvedValue({ success: true });
      const result = await updateExpense(expense);
      expect(result).toEqual({ success: true });
      expect(mockApi.expenses.updateExpense).toHaveBeenCalledWith(expense);
    });

    it('updateExpense rejects and returns error object', async () => {
      mockApi.expenses.updateExpense.mockRejectedValue(new Error('fail'));
      const result = await updateExpense({});
      expect(result).toEqual({ error: "Error al cambiar gasto" });
    });

    it('deleteExpenseById resolves with result', async () => {
      mockApi.expenses.deleteExpenseById.mockResolvedValue({ success: true });
      const result = await deleteExpenseById(5);
      expect(result).toEqual({ success: true });
      expect(mockApi.expenses.deleteExpenseById).toHaveBeenCalledWith(5);
    });

    it('deleteExpenseById rejects and returns empty array', async () => {
      mockApi.expenses.deleteExpenseById.mockRejectedValue(new Error('fail'));
      const result = await deleteExpenseById(5);
      expect(result).toEqual([]);
    });
  });

  describe('Students', () => {
    it('getAllStudents resolves with data', async () => {
      const data = [{ id: 1, name: 'Juan' }];
      mockApi.students.getAllStudents.mockResolvedValue(data);
      const result = await getAllStudents();
      expect(result).toEqual(data);
    });

    it('getAllStudents rejects and returns empty array', async () => {
      mockApi.students.getAllStudents.mockRejectedValue(new Error('fail'));
      const result = await getAllStudents();
      expect(result).toEqual([]);
    });

    it('getStudentsByActive resolves with data', async () => {
      const data = [{ id: 1, active: 1 }];
      mockApi.students.getStudentsByActive.mockResolvedValue(data);
      const result = await getStudentsByActive(1);
      expect(result).toEqual(data);
      expect(mockApi.students.getStudentsByActive).toHaveBeenCalledWith(1);
    });

    it('getStudentsByActive rejects and returns empty array', async () => {
      mockApi.students.getStudentsByActive.mockRejectedValue(new Error('fail'));
      const result = await getStudentsByActive(1);
      expect(result).toEqual([]);
    });

    it('getStudentsActive resolves with data', async () => {
      const data = [{ active: 1, count: 25 }];
      mockApi.students.getStudentsActive.mockResolvedValue(data);
      const result = await getStudentsActive();
      expect(result).toEqual(data);
    });

    it('getStudentsActive rejects and returns empty array', async () => {
      mockApi.students.getStudentsActive.mockRejectedValue(new Error('fail'));
      const result = await getStudentsActive();
      expect(result).toEqual([]);
    });

    it('getStudentCount resolves with data', async () => {
      const data = [{ count: 30 }];
      mockApi.students.getStudentCount.mockResolvedValue(data);
      const result = await getStudentCount();
      expect(result).toEqual(data);
    });

    it('getStudentCount rejects and returns empty array', async () => {
      mockApi.students.getStudentCount.mockRejectedValue(new Error('fail'));
      const result = await getStudentCount();
      expect(result).toEqual([]);
    });

    it('addStudent resolves with result', async () => {
      const student = { name: 'Maria' };
      mockApi.students.addStudent.mockResolvedValue({ id: 5 });
      const result = await addStudent(student);
      expect(result).toEqual({ id: 5 });
      expect(mockApi.students.addStudent).toHaveBeenCalledWith(student);
    });

    it('addStudent rejects and returns empty array', async () => {
      mockApi.students.addStudent.mockRejectedValue(new Error('fail'));
      const result = await addStudent({});
      expect(result).toEqual([]);
    });

    it('updateStudent resolves with result', async () => {
      const student = { id: 1, name: 'Ana' };
      mockApi.students.updateStudent.mockResolvedValue({ success: true });
      const result = await updateStudent(student);
      expect(result).toEqual({ success: true });
      expect(mockApi.students.updateStudent).toHaveBeenCalledWith(student);
    });

    it('updateStudent rejects and returns error object', async () => {
      mockApi.students.updateStudent.mockRejectedValue(new Error('fail'));
      const result = await updateStudent({});
      expect(result).toEqual({ error: "Error al cambiar estudiante." });
    });

    it('deleteStudentById resolves with result', async () => {
      mockApi.students.deleteStudentById.mockResolvedValue({ success: true });
      const result = await deleteStudentById(3);
      expect(result).toEqual({ success: true });
      expect(mockApi.students.deleteStudentById).toHaveBeenCalledWith(3);
    });

    it('deleteStudentById rejects and returns empty array', async () => {
      mockApi.students.deleteStudentById.mockRejectedValue(new Error('fail'));
      const result = await deleteStudentById(3);
      expect(result).toEqual([]);
    });
  });

  describe('Teachers', () => {
    it('getAllTeachers resolves with data', async () => {
      const data = [{ id: 1, name: 'Prof Lopez' }];
      mockApi.teachers.getAllTeachers.mockResolvedValue(data);
      const result = await getAllTeachers();
      expect(result).toEqual(data);
    });

    it('getAllTeachers rejects and returns error object', async () => {
      mockApi.teachers.getAllTeachers.mockRejectedValue(new Error('fail'));
      const result = await getAllTeachers();
      expect(result).toEqual({ error: "Error al obtener profesores." });
    });

    it('addTeacher resolves with result', async () => {
      const teacher = { name: 'Prof Garcia' };
      mockApi.teachers.addTeacher.mockResolvedValue({ id: 2 });
      const result = await addTeacher(teacher);
      expect(result).toEqual({ id: 2 });
      expect(mockApi.teachers.addTeacher).toHaveBeenCalledWith(teacher);
    });

    it('addTeacher rejects and returns error with message', async () => {
      mockApi.teachers.addTeacher.mockRejectedValue(new Error('duplicate'));
      const result = await addTeacher({});
      expect(result).toEqual({ error: "Error al agregar profesor: duplicate" });
    });

    it('deleteTeacherById resolves with result', async () => {
      mockApi.teachers.deleteTeacherById.mockResolvedValue({ success: true });
      const result = await deleteTeacherById(1);
      expect(result).toEqual({ success: true });
      expect(mockApi.teachers.deleteTeacherById).toHaveBeenCalledWith(1);
    });

    it('deleteTeacherById rejects and returns error with message', async () => {
      mockApi.teachers.deleteTeacherById.mockRejectedValue(new Error('not found'));
      const result = await deleteTeacherById(1);
      expect(result).toEqual({ error: "Error al eliminar profesor. not found" });
    });

    it('updateTeacher resolves with result', async () => {
      const teacher = { id: 1, name: 'Prof Updated' };
      mockApi.teachers.updateTeacher.mockResolvedValue({ success: true });
      const result = await updateTeacher(teacher);
      expect(result).toEqual({ success: true });
      expect(mockApi.teachers.updateTeacher).toHaveBeenCalledWith(teacher);
    });

    it('updateTeacher rejects and returns error with message', async () => {
      mockApi.teachers.updateTeacher.mockRejectedValue(new Error('fail'));
      const result = await updateTeacher({});
      expect(result).toEqual({ error: "Error al cambiar profesor: fail" });
    });
  });

  describe('Pricing', () => {
    it('addDivision resolves with result', async () => {
      const division = { name: 'SINEM' };
      mockApi.pricing.addDivision.mockResolvedValue({ id: 1 });
      const result = await addDivision(division);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.pricing.addDivision).toHaveBeenCalledWith(division);
    });

    it('addDivision rejects and returns empty array', async () => {
      mockApi.pricing.addDivision.mockRejectedValue(new Error('fail'));
      const result = await addDivision({});
      expect(result).toEqual([]);
    });

    it('deleteDivision resolves with result', async () => {
      mockApi.pricing.deleteDivision.mockResolvedValue({ success: true });
      const result = await deleteDivision(1);
      expect(result).toEqual({ success: true });
      expect(mockApi.pricing.deleteDivision).toHaveBeenCalledWith(1);
    });

    it('deleteDivision rejects and returns empty array', async () => {
      mockApi.pricing.deleteDivision.mockRejectedValue(new Error('fail'));
      const result = await deleteDivision(1);
      expect(result).toEqual([]);
    });

    it('updateDivision resolves with result', async () => {
      const data = { id: 1, name: 'Updated' };
      mockApi.pricing.updateDivision.mockResolvedValue({ success: true });
      const result = await updateDivision(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.pricing.updateDivision).toHaveBeenCalledWith(data);
    });

    it('updateDivision rejects and returns empty array', async () => {
      mockApi.pricing.updateDivision.mockRejectedValue(new Error('fail'));
      const result = await updateDivision({});
      expect(result).toEqual([]);
    });

    it('updatePriceConcept resolves with result', async () => {
      const data = { conceptId: 1, amount: 20000 };
      mockApi.pricing.updatePriceConcept.mockResolvedValue({ success: true });
      const result = await updatePriceConcept(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.pricing.updatePriceConcept).toHaveBeenCalledWith(data);
    });

    it('updatePriceConcept rejects and returns empty array', async () => {
      mockApi.pricing.updatePriceConcept.mockRejectedValue(new Error('fail'));
      const result = await updatePriceConcept({});
      expect(result).toEqual([]);
    });

    it('updatePriceDivision resolves with result', async () => {
      const data = { divisionId: 1, amount: 15000 };
      mockApi.pricing.updatePriceDivision.mockResolvedValue({ success: true });
      const result = await updatePriceDivision(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.pricing.updatePriceDivision).toHaveBeenCalledWith(data);
    });

    it('updatePriceDivision rejects and returns empty array', async () => {
      mockApi.pricing.updatePriceDivision.mockRejectedValue(new Error('fail'));
      const result = await updatePriceDivision({});
      expect(result).toEqual([]);
    });

    it('getAllDivisionPaymentConcepts resolves with data', async () => {
      const data = [{ divisionId: 1, conceptId: 2 }];
      mockApi.pricing.getAllDivisionPaymentConcepts.mockResolvedValue(data);
      const result = await getAllDivisionPaymentConcepts();
      expect(result).toEqual(data);
    });

    it('getAllDivisionPaymentConcepts rejects and returns empty array', async () => {
      mockApi.pricing.getAllDivisionPaymentConcepts.mockRejectedValue(new Error('fail'));
      const result = await getAllDivisionPaymentConcepts();
      expect(result).toEqual([]);
    });

    it('updateDivisionPaymentConcept resolves with result', async () => {
      const data = { divisionId: 1, conceptId: 2, amount: 25000 };
      mockApi.pricing.updateDivisionPaymentConcept.mockResolvedValue({ success: true });
      const result = await updateDivisionPaymentConcept(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.pricing.updateDivisionPaymentConcept).toHaveBeenCalledWith(data);
    });

    it('updateDivisionPaymentConcept rejects and returns empty array', async () => {
      mockApi.pricing.updateDivisionPaymentConcept.mockRejectedValue(new Error('fail'));
      const result = await updateDivisionPaymentConcept({});
      expect(result).toEqual([]);
    });
  });

  describe('Reports', () => {
    it('getCashRegister resolves with data', async () => {
      const data = { total: 500000 };
      mockApi.reports.getCashRegister.mockResolvedValue(data);
      const result = await getCashRegister();
      expect(result).toEqual(data);
    });

    it('getCashRegister rejects and returns empty array', async () => {
      mockApi.reports.getCashRegister.mockRejectedValue(new Error('fail'));
      const result = await getCashRegister();
      expect(result).toEqual([]);
    });
  });

  describe('Excel', () => {
    it('exportReceiptToExcel resolves with result', async () => {
      const payment = { id: 1 };
      mockApi.excel.exportReceiptToExcel.mockResolvedValue({ success: true });
      const result = await exportReceiptToExcel(payment);
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportReceiptToExcel).toHaveBeenCalledWith(payment);
    });

    it('exportReceiptToExcel rejects and returns error object', async () => {
      mockApi.excel.exportReceiptToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportReceiptToExcel({});
      expect(result).toEqual({ error: "Error al exportar recivo a excel. Revise que no tenga el archivo con el mismo nombre abierto." });
    });

    it('exportReportToExcel resolves with result', async () => {
      const data = { year: 2024 };
      mockApi.excel.exportReportToExcel.mockResolvedValue({ success: true });
      const result = await exportReportToExcel(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportReportToExcel).toHaveBeenCalledWith(data);
    });

    it('exportReportToExcel rejects and returns error object', async () => {
      mockApi.excel.exportReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte a excel. Revise que no tenga el archivo con el mismo nombre abierto." });
    });

    it('exportCashRegisterReportToExcel resolves with result', async () => {
      const data = { month: 6 };
      mockApi.excel.exportCashRegisterReportToExcel.mockResolvedValue({ success: true });
      const result = await exportCashRegisterReportToExcel(data);
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportCashRegisterReportToExcel).toHaveBeenCalledWith(data);
    });

    it('exportCashRegisterReportToExcel rejects and returns error object', async () => {
      mockApi.excel.exportCashRegisterReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportCashRegisterReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de caja a excel." });
    });

    it('exportPaymentsByYearToExcel resolves with result', async () => {
      mockApi.excel.exportPaymentsByYearToExcel.mockResolvedValue({ success: true });
      const result = await exportPaymentsByYearToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportPaymentsByYearToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportPaymentsByYearToExcel rejects and returns error object', async () => {
      mockApi.excel.exportPaymentsByYearToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportPaymentsByYearToExcel({});
      expect(result).toEqual({ error: "Error al exportar pagos por año a excel. Revise que no tenga el archivo con el mismo nombre abierto." });
    });

    it('exportExpensesByYearToExcel resolves with result', async () => {
      mockApi.excel.exportExpensesByYearToExcel.mockResolvedValue({ success: true });
      const result = await exportExpensesByYearToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportExpensesByYearToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportExpensesByYearToExcel rejects and returns error object', async () => {
      mockApi.excel.exportExpensesByYearToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportExpensesByYearToExcel({});
      expect(result).toEqual({ error: "Error al exportar egresos por año a excel." });
    });

    it('exportStudentsByActiveToExcel resolves with result', async () => {
      mockApi.excel.exportStudentsByActiveToExcel.mockResolvedValue({ success: true });
      const result = await exportStudentsByActiveToExcel({ active: 1 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportStudentsByActiveToExcel).toHaveBeenCalledWith({ active: 1 });
    });

    it('exportStudentsByActiveToExcel rejects and returns error object', async () => {
      mockApi.excel.exportStudentsByActiveToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportStudentsByActiveToExcel({});
      expect(result).toEqual({ error: "Error al exportar estudiantes por estado a excel." });
    });

    it('exportTemplateStudents resolves with result', async () => {
      mockApi.excel.exportTemplateStudents.mockResolvedValue({ success: true });
      const result = await exportTemplateStudents();
      expect(result).toEqual({ success: true });
    });

    it('exportTemplateStudents rejects and returns error object', async () => {
      mockApi.excel.exportTemplateStudents.mockRejectedValue(new Error('fail'));
      const result = await exportTemplateStudents();
      expect(result).toEqual({ error: "Error al generar plantilla excel estudiantes." });
    });

    it('exportHistoric resolves with result', async () => {
      mockApi.excel.exportHistoric.mockResolvedValue({ success: true });
      const result = await exportHistoric({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportHistoric).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportHistoric rejects and returns error object', async () => {
      mockApi.excel.exportHistoric.mockRejectedValue(new Error('fail'));
      const result = await exportHistoric({});
      expect(result).toEqual({ error: "Error al exportar respaldo por estado a excel." });
    });

    it('exportDelayByMonthReportToExcel resolves with result', async () => {
      mockApi.excel.exportDelayByMonthReportToExcel.mockResolvedValue({ success: true });
      const result = await exportDelayByMonthReportToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportDelayByMonthReportToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportDelayByMonthReportToExcel rejects and returns error object', async () => {
      mockApi.excel.exportDelayByMonthReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportDelayByMonthReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de morosidad por mes a excel." });
    });

    it('exportDelayByTeacherReportToExcel resolves with result', async () => {
      mockApi.excel.exportDelayByTeacherReportToExcel.mockResolvedValue({ success: true });
      const result = await exportDelayByTeacherReportToExcel({ year: 2024 });
      expect(result).toEqual({ success: true });
      expect(mockApi.excel.exportDelayByTeacherReportToExcel).toHaveBeenCalledWith({ year: 2024 });
    });

    it('exportDelayByTeacherReportToExcel rejects and returns error object', async () => {
      mockApi.excel.exportDelayByTeacherReportToExcel.mockRejectedValue(new Error('fail'));
      const result = await exportDelayByTeacherReportToExcel({});
      expect(result).toEqual({ error: "Error al exportar reporte de morosidad por profesor a excel." });
    });

    it('importStudentsFromExcel resolves with result', async () => {
      const students = [{ name: 'Maria' }];
      mockApi.excel.importStudentsFromExcel.mockResolvedValue({ count: 1 });
      const result = await importStudentsFromExcel(students);
      expect(result).toEqual({ count: 1 });
      expect(mockApi.excel.importStudentsFromExcel).toHaveBeenCalledWith(students);
    });

    it('importStudentsFromExcel rejects and returns error object', async () => {
      mockApi.excel.importStudentsFromExcel.mockRejectedValue(new Error('fail'));
      const result = await importStudentsFromExcel([]);
      expect(result).toEqual({ error: "Error al importar estudiantes desde el excel." });
    });

    it('importStudents resolves with result', async () => {
      const students = [{ name: 'Pedro' }];
      mockApi.students.importStudents.mockResolvedValue({ count: 1 });
      const result = await importStudents(students);
      expect(result).toEqual({ count: 1 });
      expect(mockApi.students.importStudents).toHaveBeenCalledWith(students);
    });

    it('importStudents rejects and returns error with message', async () => {
      mockApi.students.importStudents.mockRejectedValue(new Error('invalid data'));
      const result = await importStudents([]);
      expect(result).toEqual({ error: "Error al importar estudiantes: invalid data" });
    });
  });

  describe('Images', () => {
    it('addImage resolves with result', async () => {
      const imageData = { name: 'logo.png' };
      mockApi.images.addImage.mockResolvedValue({ id: 1 });
      const result = await addImage(imageData);
      expect(result).toEqual({ id: 1 });
      expect(mockApi.images.addImage).toHaveBeenCalledWith(imageData);
    });

    it('addImage rejects and returns error object', async () => {
      mockApi.images.addImage.mockRejectedValue(new Error('fail'));
      const result = await addImage({});
      expect(result).toEqual({ error: "Error al agregar imagen." });
    });

    it('getImages resolves with data', async () => {
      const data = [{ id: 1, name: 'logo.png' }];
      mockApi.images.getImages.mockResolvedValue(data);
      const result = await getImages();
      expect(result).toEqual(data);
    });

    it('getImages rejects and returns error object', async () => {
      mockApi.images.getImages.mockRejectedValue(new Error('fail'));
      const result = await getImages();
      expect(result).toEqual({ error: "Error al obtener imagenes." });
    });

    it('setImage resolves with result', async () => {
      mockApi.images.setImage.mockResolvedValue({ success: true });
      const result = await setImage(true);
      expect(result).toEqual({ success: true });
      expect(mockApi.images.setImage).toHaveBeenCalledWith(true);
    });

    it('setImage rejects and returns error object', async () => {
      mockApi.images.setImage.mockRejectedValue(new Error('fail'));
      const result = await setImage(true);
      expect(result).toEqual({ error: "Error al establecer imagen." });
    });

    it('getCurrentImage resolves with data', async () => {
      const data = { id: 1, name: 'logo.png' };
      mockApi.images.getCurrentImage.mockResolvedValue(data);
      const result = await getCurrentImage();
      expect(result).toEqual(data);
    });

    it('getCurrentImage rejects and returns error object', async () => {
      mockApi.images.getCurrentImage.mockRejectedValue(new Error('fail'));
      const result = await getCurrentImage();
      expect(result).toEqual({ error: "Error al obtener imagen." });
    });

    it('deleteImageById resolves with result', async () => {
      mockApi.images.deleteImageById.mockResolvedValue({ success: true });
      const result = await deleteImageById(3);
      expect(result).toEqual({ success: true });
      expect(mockApi.images.deleteImageById).toHaveBeenCalledWith(3);
    });

    it('deleteImageById rejects and returns error object', async () => {
      mockApi.images.deleteImageById.mockRejectedValue(new Error('fail'));
      const result = await deleteImageById(3);
      expect(result).toEqual({ error: "Error al eliminar imagen." });
    });
  });

  describe('Functionality', () => {
    it('quitApp resolves with result', async () => {
      mockApi.app.quitApp.mockResolvedValue(undefined);
      const result = await quitApp();
      expect(result).toBeUndefined();
    });

    it('quitApp rejects and returns error object', async () => {
      mockApi.app.quitApp.mockRejectedValue(new Error('fail'));
      const result = await quitApp();
      expect(result).toEqual({ error: "Error al cerrar la aplicación." });
    });
  });
});
