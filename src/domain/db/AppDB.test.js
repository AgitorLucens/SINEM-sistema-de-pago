import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';

const tmpDbDir = vi.hoisted(() => {
  const os = require('os');
  const path = require('path');
  const fs = require('fs');
  const dir = path.join(os.tmpdir(), 'sinem-appdb-test-' + Date.now());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
});

vi.mock('electron', () => ({
  app: {
    getPath: () => tmpDbDir,
  },
}));

import AppDB from './db.js';

describe('AppDB', () => {
  let db;

  beforeAll(() => {
    db = new AppDB();
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.db.exec('DELETE FROM payments');
    db.db.exec('DELETE FROM expenses');
    db.db.exec('DELETE FROM students');
    db.db.exec('DELETE FROM teachers');
    db.db.exec('DELETE FROM images');
  });

  describe('Students', () => {
    it('addStudent inserts and returns lastInsertRowid', () => {
      const id = db.addStudent({ name: 'Juan', phone: '8888', email: 'j@t.com', reference: 'R1', active: 1, scholarship: 0, scholarship_amount: 0 });
      expect(id).toBeGreaterThan(0);
    });

    it('getAllStudents returns all students', () => {
      db.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
      const students = db.getAllStudents();
      expect(students).toHaveLength(2);
      expect(students[0].name).toBe('B');
    });

    it('getStudentsByActive filters active students', () => {
      db.addStudent({ name: 'Active', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.addStudent({ name: 'Inactive', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
      const active = db.getStudentsByActive(1);
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe('Active');
    });

    it('getStudentsByActive with falsy returns all', () => {
      db.addStudent({ name: 'X', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      const all = db.getStudentsByActive(0);
      expect(all.length).toBeGreaterThanOrEqual(1);
    });

    it('getStudentsActive returns distinct active values', () => {
      db.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
      const res = db.getStudentsActive();
      expect(res.length).toBeGreaterThanOrEqual(1);
    });

    it('getStudentCount returns count of active students', () => {
      db.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.addStudent({ name: 'C', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
      const count = db.getStudentCount();
      expect(count[0]['COUNT(*)']).toBe(2);
    });

    it('updateStudent updates fields successfully', () => {
      const id = db.addStudent({ name: 'Old', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      const result = db.updateStudent({ id, fields: { name: 'New' }, list: ['name'] });
      expect(result.success).toBe(true);
      const row = db.db.prepare('SELECT name FROM students WHERE id = ?').get(id);
      expect(row.name).toBe('New');
    });

    it('updateStudent throws on empty fields', () => {
      expect(() => db.updateStudent({ id: 1, fields: {} })).toThrow();
    });

    it('deleteStudentById removes student', () => {
      const id = db.addStudent({ name: 'Del', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
      db.deleteStudentById(id);
      const row = db.db.prepare('SELECT * FROM students WHERE id = ?').get(id);
      expect(row).toBeUndefined();
    });

    it('importStudents inserts multiple students with Si/No conversion', () => {
      const data = [
        { nombre: 'M', telefono: '1', correo: 'm@t.com', referencia: 'R1', activo: 'Si', scholarship: 'No', scholarship_amount: 0 },
        { nombre: 'P', telefono: '', correo: '', referencia: '', activo: 'no', scholarship: 'si', scholarship_amount: 5000 },
      ];
      const result = db.importStudents(data);
      expect(result.success).toBe(true);
      const rows = db.getAllStudents();
      expect(rows).toHaveLength(2);
      expect(rows[0].active).toBe(0);
      expect(rows[0].scholarship).toBe(1);
      expect(rows[0].scholarship_amount).toBe(5000);
      expect(rows[1].active).toBe(1);
      expect(rows[1].scholarship).toBe(0);
    });

    it('importStudents returns error when data is null', () => {
      const result = db.importStudents(null);
      expect(result.error).toBe('Datos Estudiantes no encontrados.');
    });
  });

  describe('Payments', () => {
    let studentId, conceptId, divisionId;

    beforeEach(() => {
      const s = db.db.prepare("INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)").run('S1', '', '', '', 1, 0, 0);
      studentId = s.lastInsertRowid;
      const c = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Mensualidad'").get();
      conceptId = c.id;
      const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
      divisionId = d.id;
    });

    it('addPayment inserts a payment with auto-sequence', () => {
      const result = db.addPayment({ date: '2024-01-15', amount: 10000, payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
      expect(result.success).toBe(true);
      expect(result.transaction.year).toBe(2024);
      expect(result.transaction.sequence).toBe(1);
    });

    it('addPaymentWithConsecutive inserts and returns createdPayment', () => {
      const result = db.addPaymentWithConsecutive({ date: '2024-02-01', amount: 5000, receipt: 'R01', payment_method: 'Transferencia', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 2, sequence: 1, status: 'ACTIVE', timestamp: '2024-02-01T10:00:00' });
      expect(result.success).toBe(true);
      expect(result.payment.amount).toBe(5000);
      expect(result.payment.student_name).toBe('S1');
    });

    it('getAllPayments returns all payments', () => {
      db.addPaymentWithConsecutive({ date: '2024-03-01', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 3, sequence: 1, status: 'ACTIVE', timestamp: '2024-03-01T10:00:00' });
      const payments = db.getAllPayments();
      expect(payments).toHaveLength(1);
      expect(payments[0].student_name).toBe('S1');
    });

    it('getAllPaymentsByYear filters by year', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      db.addPaymentWithConsecutive({ date: '2023-06-01', amount: 2000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2023, month: 6, sequence: 1, status: 'ACTIVE', timestamp: '2023-06-01T10:00:00' });
      const payments = db.getAllPaymentsByYear('2024');
      expect(payments).toHaveLength(1);
      expect(payments[0].amount).toBe(1000);
    });

    it('getPaymentsByYear with year returns filtered', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      const payments = db.getPaymentsByYear('2024');
      expect(payments).toHaveLength(1);
    });

    it('getPaymentsByYear without year returns all', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      const payments = db.getPaymentsByYear(null);
      expect(payments).toHaveLength(1);
    });

    it('getYearsOfPayments returns distinct years', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      db.addPaymentWithConsecutive({ date: '2023-06-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2023, month: 6, sequence: 1, status: 'ACTIVE', timestamp: '2023-06-01T10:00:00' });
      const years = db.getYearsOfPayments();
      expect(years.map(y => y.year)).toContain('2024');
      expect(years.map(y => y.year)).toContain('2023');
    });

    it('getDateOfPayments returns distinct dates', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-15', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
      const dates = db.getDateOfPayments();
      expect(dates.length).toBeGreaterThanOrEqual(1);
    });

    it('getPaymentByStudentId returns payments for student', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      const payments = db.getPaymentByStudentId(studentId);
      expect(payments).toHaveLength(1);
      expect(payments[0].student_name).toBe('S1');
    });

    it('deletePaymentById removes payment', () => {
      const result = db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      db.deletePaymentById(result.payment.id);
      const row = db.db.prepare('SELECT * FROM payments WHERE id = ?').get(result.payment.id);
      expect(row).toBeUndefined();
    });

    it('getPaymentsConcepts returns payment concepts', () => {
      const concepts = db.getPaymentsConcepts();
      expect(concepts.length).toBeGreaterThanOrEqual(3);
      expect(concepts.map(c => c.name)).toContain('Matricula');
    });

    it('getPaymentsDivisions returns divisions', () => {
      const divisions = db.getPaymentsDivisions();
      expect(divisions.length).toBeGreaterThanOrEqual(3);
      expect(divisions.map(d => d.name)).toContain('SINEM');
    });

    it('getNextConsecutiveByYear returns next sequence number', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      const next = db.getNextConsecutiveByYear(2024);
      expect(next).toBe(2);
    });

    it('getNextConsecutiveByYear returns 1 for empty year', () => {
      const next = db.getNextConsecutiveByYear(2099);
      expect(next).toBe(1);
    });

    it('updatePayment updates fields', () => {
      const result = db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      const updateResult = db.updatePayment({ id: result.payment.id, fields: { amount: 9999 }, list: ['amount'] });
      expect(updateResult.success).toBe(true);
      const row = db.db.prepare('SELECT amount FROM payments WHERE id = ?').get(result.payment.id);
      expect(row.amount).toBe(9999);
    });

    it('getDelayPayments aggregates by month and type', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-15', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
      db.addPaymentWithConsecutive({ date: '2024-02-15', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 2, sequence: 2, status: 'ACTIVE', timestamp: '2024-02-15T10:00:00' });
      const report = db.getDelayPayments([2024]);
      expect(report.months[1]).toBe(5000);
      expect(report.months[2]).toBe(5000);
    });

    it('getDelayPayments returns error when years is falsy', () => {
      const result = db.getDelayPayments(null);
      expect(result).toBeInstanceOf(Error);
    });

    it('getExpectedIncome returns income data', () => {
      db.addPaymentWithConsecutive({ date: '2024-01-15', amount: 10000, receipt: '', payment_method: 'Efectivo', concept_id: db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Matricula'").get().id, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
      const income = db.getExpectedIncome([2024]);
      expect(income).toHaveProperty('matricula1');
      expect(income).toHaveProperty('monthly1');
    });
  });

  describe('Expenses', () => {
    it('addExpense inserts and returns id', () => {
      const id = db.addExpense({ date: '2024-02-01', description: 'Rent', reference: 'R1', type: 'Administrativo', amount: 500000 });
      expect(id).toBeGreaterThan(0);
    });

    it('getAllExpenses returns all expenses', () => {
      db.addExpense({ date: '2024-02-01', description: 'Rent', reference: 'R1', type: 'Administrativo', amount: 500000 });
      const expenses = db.getAllExpenses();
      expect(expenses).toHaveLength(1);
      expect(expenses[0].description).toBe('Rent');
    });

    it('getExpensesByYear with year returns filtered', () => {
      db.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
      db.addExpense({ date: '2023-06-01', description: 'B', reference: '', type: 'T2', amount: 200 });
      const result = db.getExpensesByYear('2024');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('A');
    });

    it('getExpensesByYear without year returns all', () => {
      db.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
      const result = db.getExpensesByYear(null);
      expect(result).toHaveLength(1);
    });

    it('getYearsOfExpenses returns distinct years', () => {
      db.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
      db.addExpense({ date: '2023-06-01', description: 'B', reference: '', type: 'T2', amount: 200 });
      const years = db.getYearsOfExpenses();
      expect(years.map(y => y.year)).toContain('2024');
      expect(years.map(y => y.year)).toContain('2023');
    });

    it('updateExpense updates fields', () => {
      const id = db.addExpense({ date: '2024-02-01', description: 'Old', reference: '', type: 'T1', amount: 100 });
      const result = db.updateExpense({ id, fields: { description: 'New' }, list: ['description'] });
      expect(result.success).toBe(true);
      const row = db.db.prepare('SELECT description FROM expenses WHERE id = ?').get(id);
      expect(row.description).toBe('New');
    });

    it('deleteExpenseById removes expense', () => {
      const id = db.addExpense({ date: '2024-02-01', description: 'Del', reference: '', type: 'T1', amount: 100 });
      db.deleteExpenseById(id);
      const row = db.db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
      expect(row).toBeUndefined();
    });
  });

  describe('Teachers', () => {
    let divisionId;

    beforeEach(() => {
      const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
      divisionId = d.id;
    });

    it('addTeacher inserts teacher', () => {
      const result = db.addTeacher({ name: 'Prof A', division_id: divisionId, amount: 300000 });
      expect(result.lastInsertRowid).toBeGreaterThan(0);
    });

    it('getAllTeachers returns teachers with division name', () => {
      db.addTeacher({ name: 'Prof A', division_id: divisionId, amount: 300000 });
      const teachers = db.getAllTeachers();
      expect(teachers).toHaveLength(1);
      expect(teachers[0].division_name).toBe('SINEM');
    });

    it('updateTeacher updates fields', () => {
      const r = db.addTeacher({ name: 'Old', division_id: divisionId, amount: 100 });
      const id = r.lastInsertRowid;
      const result = db.updateTeacher({ id, fields: { name: 'New' }, list: ['name'] });
      expect(result.success).toBe(true);
      const row = db.db.prepare('SELECT name FROM teachers WHERE id = ?').get(id);
      expect(row.name).toBe('New');
    });

    it('deleteTeacherById removes teacher', () => {
      const r = db.addTeacher({ name: 'Del', division_id: divisionId, amount: 100 });
      const id = r.lastInsertRowid;
      db.deleteTeacherById(id);
      const row = db.db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
      expect(row).toBeUndefined();
    });
  });

  describe('Pricing', () => {
    beforeEach(() => {
      db.db.exec('DELETE FROM division_payment_concepts');
      db.db.exec('DELETE FROM divisions');
      db.db.exec('DELETE FROM teachers');
      const sinemDiv = db.db.prepare("INSERT INTO divisions (name, description) VALUES (?, ?)").run('SINEM', 'Test division');
      const sinemId = sinemDiv.lastInsertRowid;
      const concepts = db.db.prepare("SELECT id FROM payment_concepts WHERE type != 'Otros'").all();
      const insertLink = db.db.prepare("INSERT INTO division_payment_concepts (division_id, concept_id, amount) VALUES (?, ?, 0)");
      for (const c of concepts) {
        insertLink.run(sinemId, c.id);
      }
    });

    it('addDivision creates division and links concepts', () => {
      const result = db.addDivision({ name: 'NewDivTest' });
      expect(result.lastInsertRowid).toBeGreaterThan(0);
      const links = db.db.prepare("SELECT * FROM division_payment_concepts WHERE division_id = ?").all(result.lastInsertRowid);
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it('deleteDivision removes division', () => {
      const r = db.addDivision({ name: 'DelDivTest' });
      const id = r.lastInsertRowid;
      db.deleteDivision(id);
      const row = db.db.prepare('SELECT * FROM divisions WHERE id = ?').get(id);
      expect(row).toBeUndefined();
    });

    it('updateDivision renames division', () => {
      const r = db.addDivision({ name: 'OldDivTest' });
      const id = r.lastInsertRowid;
      const result = db.updateDivision(id, 'RenamedDivTest');
      expect(result.success).toBe(true);
      const row = db.db.prepare('SELECT name FROM divisions WHERE id = ?').get(id);
      expect(row.name).toBe('RenamedDivTest');
    });

    it('getAllDivisionPaymentConcepts returns all links', () => {
      const links = db.getAllDivisionPaymentConcepts();
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveProperty('division_name');
      expect(links[0]).toHaveProperty('concept_name');
    });

    it('updateDivisionPaymentConcept updates amount', () => {
      const link = db.getAllDivisionPaymentConcepts()[0];
      const changes = db.updateDivisionPaymentConcept(link.id, 99999);
      expect(changes).toBe(1);
      const updated = db.db.prepare('SELECT amount FROM division_payment_concepts WHERE id = ?').get(link.id);
      expect(updated.amount).toBe(99999);
    });

    it('updatePriceConcept updates concept amount', () => {
      const concept = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Matricula'").get();
      db.updatePriceConcept({ id: concept.id, amount: 50000 });
      const row = db.db.prepare('SELECT amount FROM payment_concepts WHERE id = ?').get(concept.id);
      expect(row.amount).toBe(50000);
    });

    it('updatePriceDivision updates division amount', () => {
      const div = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
      db.updatePriceDivision({ id: div.id, amount: 99999 });
      const row = db.db.prepare('SELECT amount FROM divisions WHERE id = ?').get(div.id);
      expect(row.amount).toBe(99999);
    });

    it('getPaymentAmount returns amount from division_payment_concepts', () => {
      const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
      const mens = db.db.prepare("SELECT id, type FROM payment_concepts WHERE type = 'Mensualidad'").get();
      const amount = db.getPaymentAmount(d.id, mens.id);
      expect(typeof amount).toBe('number');
    });

    it('getPaymentAmount returns 0 for unknown concept', () => {
      const amount = db.getPaymentAmount(1, 99999);
      expect(amount).toBe(0);
    });

    it('getPaymentAmount returns concept amount for Otros', () => {
      db.db.prepare("UPDATE payment_concepts SET amount = 12345 WHERE type = 'Otros'").run();
      const otros = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Otros'").get();
      const amount = db.getPaymentAmount(null, otros.id);
      expect(amount).toBe(12345);
    });
  });

  describe('Images', () => {
    it('addImage inserts image', () => {
      const id = db.addImage({ image: Buffer.from('test') });
      expect(id).toBeGreaterThan(0);
    });

    it('getImages returns all images', () => {
      db.addImage({ image: Buffer.from('img1') });
      db.addImage({ image: Buffer.from('img2') });
      const images = db.getImages();
      expect(images).toHaveLength(2);
    });

    it('setImage updates current_image flag', () => {
      const id = db.addImage({ image: Buffer.from('img') });
      db.setImage({ id, current_image: 1 });
      const current = db.getCurrentImage();
      expect(current.id).toBe(id);
    });

    it('deleteImageById removes image', () => {
      const id = db.addImage({ image: Buffer.from('del') });
      db.deleteImageById(id);
      const row = db.db.prepare('SELECT * FROM images WHERE id = ?').get(id);
      expect(row).toBeUndefined();
    });
  });

  describe('Reports', () => {
    it('getCashRegister returns combined payments and expenses', () => {
      const sId = db.db.prepare("INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)").run('S1', '', '', '', 1, 0, 0).lastInsertRowid;
      const cId = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Mensualidad'").get().id;
      const dId = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get().id;
      db.addPaymentWithConsecutive({ date: '2024-01-01', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: cId, division_id: dId, student_id: sId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
      db.addExpense({ date: '2024-01-02', description: 'Rent', reference: '', type: 'Admin', amount: 1000 });
      const register = db.getCashRegister();
      expect(register.length).toBeGreaterThanOrEqual(2);
    });

    it('getDelayByTeacherReport throws on empty SQL', () => {
      expect(() => db.getDelayByTeacherReport()).toThrow();
    });
  });
});
