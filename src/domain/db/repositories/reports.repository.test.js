import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Reports repository contract tests: cross-entity queries
    (delay aggregation, expected income, cash register).
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-reports-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM payments');
  db.db.exec('DELETE FROM expenses');
  db.db.exec('DELETE FROM students');
});

describe('Reports repository', () => {
  let studentId, conceptId, divisionId;

  beforeEach(() => {
    const s = db.db.prepare("INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)").run('S1', '', '', '', 1, 0, 0);
    studentId = s.lastInsertRowid;
    const c = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Mensualidad'").get();
    conceptId = c.id;
    const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
    divisionId = d.id;
  });

  it('getDelayPayments aggregates by month and type', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-15', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
    db.payments.addPaymentWithConsecutive({ date: '2024-02-15', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: conceptId, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 2, sequence: 2, status: 'ACTIVE', timestamp: '2024-02-15T10:00:00' });
    const report = db.reports.getDelayPayments([2024]);
    expect(report.months[1]).toBe(5000);
    expect(report.months[2]).toBe(5000);
  });

  it('getDelayPayments throws when years is falsy', () => {
    expect(() => db.reports.getDelayPayments(null)).toThrow();
  });

  it('getExpectedIncome returns income data', () => {
    db.payments.addPaymentWithConsecutive({ date: '2024-01-15', amount: 10000, receipt: '', payment_method: 'Efectivo', concept_id: db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Matricula'").get().id, division_id: divisionId, student_id: studentId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-15T10:00:00' });
    const income = db.reports.getExpectedIncome([2024]);
    expect(income).toHaveProperty('matricula1');
    expect(income).toHaveProperty('monthly1');
  });

  it('getCashRegister returns combined payments and expenses', () => {
    const sId = db.db.prepare("INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)").run('S1', '', '', '', 1, 0, 0).lastInsertRowid;
    const cId = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Mensualidad'").get().id;
    const dId = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get().id;
    db.payments.addPaymentWithConsecutive({ date: '2024-01-01', amount: 5000, receipt: '', payment_method: 'Efectivo', concept_id: cId, division_id: dId, student_id: sId, semester: 1, year: 2024, month: 1, sequence: 1, status: 'ACTIVE', timestamp: '2024-01-01T10:00:00' });
    db.expenses.addExpense({ date: '2024-01-02', description: 'Rent', reference: '', type: 'Admin', amount: 1000 });
    const register = db.reports.getCashRegister();
    expect(register.length).toBeGreaterThanOrEqual(2);
  });
});
