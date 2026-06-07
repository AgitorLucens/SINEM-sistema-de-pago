import { describe, it, expect } from 'vitest';
import { buildPaymentRow, getPaymentsColumns } from './payments.js';

describe('buildPaymentRow', () => {
  it('maps payment fields to export row', () => {
    const payment = {
      year: 2024,
      sequence: 42,
      date: '2024-03-15',
      student_name: 'Juan Perez',
      concept_type: 'Matricula',
      division_name: 'Violin',
      payment_method: 'Efectivo',
      amount: 10000,
      receipt: 'REC-001',
    };

    const row = buildPaymentRow(payment);
    expect(row.consecutive).toBe('2024-00042');
    expect(row.student).toBe('Juan Perez');
    expect(row.concept).toBe('Matricula');
    expect(row.division).toBe('Violin');
    expect(row.method).toBe('Efectivo');
    expect(row.amount).toBe(10000);
    expect(row.receipt).toBe('REC-001');
  });

  it('pads sequence to 5 digits', () => {
    const row = buildPaymentRow({ year: 2025, sequence: 1, date: '2025-01-01', student_name: 'A', concept_type: 'X', division_name: 'Y', payment_method: 'Z', amount: 0, receipt: '' });
    expect(row.consecutive).toBe('2025-00001');
  });

  it('handles missing student_name', () => {
    const row = buildPaymentRow({ year: 2024, sequence: 1, date: '2024-01-01', student_name: null, concept_type: 'X', division_name: 'Y', payment_method: 'Z', amount: 0, receipt: '' });
    expect(row.student).toBe('');
  });

  it('formats date', () => {
    const row = buildPaymentRow({ year: 2024, sequence: 1, date: '2024-06-15', student_name: 'A', concept_type: 'X', division_name: 'Y', payment_method: 'Z', amount: 0, receipt: '' });
    expect(row.date).toBeTruthy();
  });

  it('converts amount to number', () => {
    const row = buildPaymentRow({ year: 2024, sequence: 1, date: '2024-01-01', student_name: 'A', concept_type: 'X', division_name: 'Y', payment_method: 'Z', amount: '5000.50', receipt: '' });
    expect(row.amount).toBe(5000.5);
  });
});

describe('getPaymentsColumns', () => {
  it('returns array of column definitions', () => {
    const cols = getPaymentsColumns();
    expect(cols.length).toBeGreaterThan(0);
    expect(cols[0].key).toBe('consecutive');
  });
});
