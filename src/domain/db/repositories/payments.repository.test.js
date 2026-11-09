import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Payments repository contract tests: CRUD + yearly consecutive numbering.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-payments-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM payments');
  db.db.exec('DELETE FROM students');
});

describe('Payments repository', () => {
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
    const result = db.payments.addPayment({ date: '2024-01-15', amount: 10000, payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
    expect(result.success).toBe(true);
    expect(result.transaction.year).toBe(2024);
    expect(result.transaction.sequence).toBe(1);
  });

  it('addPaymentWithConsecutive inserts and returns createdPayment', () => {
    const result = db.payments.addPaymentWithConsecutive({ date: '2024-02-01', amount: 5000, receipt: 'R01', payment_method: 'Transferencia', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 2, sequence: 1, status: 'ACTIVE', timestamp: '2024-02-01T10:00:00' });
    expect(result.success).toBe(true);
    expect(result.payment.amount).toBe(5000);
    expect(result.payment.student_name).toBe('S1');
  });

  it('getAllPayments returns all payments', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-03-01', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 3, sequence: 1, status: 'ACTIVE', timestamp: '2024-03-01T10:00:00' });
    const payments = db.payments.getAllPayments();
    expect(payments).toHaveLength(1);
    expect(payments[0].student_name).toBe('S1');
  });

  it('getAllPaymentsByYear filters by year', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    db.payments.addPaymentWithConsecutive({ date: '2023-06-01', amount: 2000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2023, month: 6, sequence: 1, status: 'ACTIVE', timestamp: '2023-06-01T10:00:00' });
    const payments = db.payments.getAllPaymentsByYear('2024');
    expect(payments).toHaveLength(1);
    expect(payments[0].amount).toBe(1000);
  });

  it('getPaymentsByYear with year returns filtered', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    const payments = db.payments.getPaymentsByYear('2024');
    expect(payments).toHaveLength(1);
  });

  it('getPaymentsByYear without year returns all', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    const payments = db.payments.getPaymentsByYear(null);
    expect(payments).toHaveLength(1);
  });

  it('getYearsOfPayments returns distinct years', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    db.payments.addPaymentWithConsecutive({ date: '2023-06-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2023, month: 6, sequence: 1, status: 'ACTIVE', timestamp: '2023-06-01T10:00:00' });
    const years = db.payments.getYearsOfPayments();
    expect(years.map(y => y.year)).toContain('2024');
    expect(years.map(y => y.year)).toContain('2023');
  });

  it('getDateOfPayments returns distinct dates', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-15', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
    const dates = db.payments.getDateOfPayments();
    expect(dates.length).toBeGreaterThanOrEqual(1);
  });

  it('getPaymentByStudentId returns payments for student', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    const payments = db.payments.getPaymentByStudentId(studentId);
    expect(payments).toHaveLength(1);
    expect(payments[0].student_name).toBe('S1');
  });

  it('deletePaymentById removes payment', () => {
    const result = db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    db.payments.deletePaymentById(result.payment.id);
    const row = db.db.prepare('SELECT * FROM payments WHERE id = ?').get(result.payment.id);
    expect(row).toBeUndefined();
  });

  it('getNextConsecutiveByYear returns next sequence number', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    const next = db.payments.getNextConsecutiveByYear(2024);
    expect(next).toBe(2);
  });

  it('getNextConsecutiveByYear returns 1 for empty year', () => {
    const next = db.payments.getNextConsecutiveByYear(2099);
    expect(next).toBe(1);
  });

  it('updatePayment updates fields', () => {
    const result = db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 1000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    const updateResult = db.payments.updatePayment({ id: result.payment.id, fields: { amount: 9999 }, list: ['amount'] });
    expect(updateResult.success).toBe(true);
    const row = db.db.prepare('SELECT amount FROM payments WHERE id = ?').get(result.payment.id);
    expect(row.amount).toBe(9999);
  });
});
