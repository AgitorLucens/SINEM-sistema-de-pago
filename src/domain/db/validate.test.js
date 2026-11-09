import { describe, it, expect } from 'vitest';
import {
  validatePaymentsUpdate,
  validateExpensesUpdate,
  validateStudentsUpdate,
  validateTeachersUpdate,
} from './validate.js';

describe('validatePaymentsUpdate', () => {
  const validData = {
    fields: {
      date: '2024-01-01',
      amount: 100,
      payment_method: 'Efectivo',
    },
  };

  it('returns filtered keys for valid fields', () => {
    const result = validatePaymentsUpdate(validData);
    expect(result).toEqual(['date', 'amount', 'payment_method']);
  });

  it('filters out invalid fields', () => {
    const data = {
      fields: {
        date: '2024-01-01',
        invalidField: 'should be removed',
        anotherBad: 'also removed',
      },
    };
    const result = validatePaymentsUpdate(data);
    expect(result).toEqual(['date']);
    expect(result).not.toContain('invalidField');
  });

  it('returns null for empty fields object', () => {
    const result = validatePaymentsUpdate({ fields: {} });
    expect(result).toBeNull();
  });

  it('returns null when no allowed fields provided', () => {
    const result = validatePaymentsUpdate({ fields: { bad: 'value' } });
    expect(result).toBeNull();
  });

  it('returns null when fields is missing', () => {
    expect(validatePaymentsUpdate({})).toBeNull();
    expect(validatePaymentsUpdate(null)).toBeNull();
    expect(validatePaymentsUpdate({ fields: 'not-an-object' })).toBeNull();
  });
});

describe('validateExpensesUpdate', () => {
  it('returns valid expense fields', () => {
    const result = validateExpensesUpdate({
      fields: { date: '2024-01-01', description: 'test' },
    });
    expect(result).toEqual(['date', 'description']);
  });

  it('returns null for invalid fields only', () => {
    expect(validateExpensesUpdate({ fields: { bad: 'value' } })).toBeNull();
  });
});

describe('validateStudentsUpdate', () => {
  it('returns valid student fields', () => {
    const result = validateStudentsUpdate({
      fields: { name: 'Juan', phone: '8888-8888', active: 1 },
    });
    expect(result).toEqual(['name', 'phone', 'active']);
  });

  it('returns null for invalid fields', () => {
    expect(validateStudentsUpdate({ fields: { unknown: 'x' } })).toBeNull();
  });
});

describe('validateTeachersUpdate', () => {
  it('returns valid teacher fields', () => {
    const result = validateTeachersUpdate({
      fields: { name: 'Profesor', amount: 50000 },
    });
    expect(result).toEqual(['name', 'amount']);
  });

  it('returns null for invalid fields', () => {
    expect(validateTeachersUpdate({ fields: { unknown: 'x' } })).toBeNull();
  });
});
