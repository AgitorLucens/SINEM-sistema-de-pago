import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Expenses repository contract tests.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-expenses-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM expenses');
});

describe('Expenses repository', () => {
  it('addExpense inserts and returns id', () => {
    const id = db.expenses.addExpense({ date: '2024-02-01', description: 'Rent', reference: 'R1', type: 'Administrativo', amount: 500000 });
    expect(id).toBeGreaterThan(0);
  });

  it('getAllExpenses returns all expenses', () => {
    db.expenses.addExpense({ date: '2024-02-01', description: 'Rent', reference: 'R1', type: 'Administrativo', amount: 500000 });
    const expenses = db.expenses.getAllExpenses();
    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Rent');
  });

  it('getExpensesByYear with year returns filtered', () => {
    db.expenses.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
    db.expenses.addExpense({ date: '2023-06-01', description: 'B', reference: '', type: 'T2', amount: 200 });
    const result = db.expenses.getExpensesByYear('2024');
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('A');
  });

  it('getExpensesByYear without year returns all', () => {
    db.expenses.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
    const result = db.expenses.getExpensesByYear(null);
    expect(result).toHaveLength(1);
  });

  it('getYearsOfExpenses returns distinct years', () => {
    db.expenses.addExpense({ date: '2024-02-01', description: 'A', reference: '', type: 'T1', amount: 100 });
    db.expenses.addExpense({ date: '2023-06-01', description: 'B', reference: '', type: 'T2', amount: 200 });
    const years = db.expenses.getYearsOfExpenses();
    expect(years.map(y => y.year)).toContain('2024');
    expect(years.map(y => y.year)).toContain('2023');
  });

  it('updateExpense updates fields', () => {
    const id = db.expenses.addExpense({ date: '2024-02-01', description: 'Old', reference: '', type: 'T1', amount: 100 });
    const result = db.expenses.updateExpense({ id, fields: { description: 'New' }, list: ['description'] });
    expect(result.success).toBe(true);
    const row = db.db.prepare('SELECT description FROM expenses WHERE id = ?').get(id);
    expect(row.description).toBe('New');
  });

  it('deleteExpenseById removes expense', () => {
    const id = db.expenses.addExpense({ date: '2024-02-01', description: 'Del', reference: '', type: 'T1', amount: 100 });
    db.expenses.deleteExpenseById(id);
    const row = db.db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    expect(row).toBeUndefined();
  });
});
