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

  it('returns error for empty fields object', () => {
    const result = validatePaymentsUpdate({ fields: {} });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Intento de cambiar campo invalido');
  });

  it('returns error when no allowed fields provided', () => {
    const result = validatePaymentsUpdate({ fields: { bad: 'value' } });
    expect(result).toBeInstanceOf(Error);
  });
});

describe('validateExpensesUpdate', () => {
  it('returns valid expense fields', () => {
    const result = validateExpensesUpdate({
      fields: { date: '2024-01-01', description: 'test' },
    });
    expect(result).toEqual(['date', 'description']);
  });

  it('returns error for invalid fields only', () => {
    const result = validateExpensesUpdate({ fields: { bad: 'value' } });
    expect(result).toBeInstanceOf(Error);
  });
});

describe('validateStudentsUpdate', () => {
  it('returns valid student fields', () => {
    const result = validateStudentsUpdate({
      fields: { name: 'Juan', phone: '8888-8888', active: 1 },
    });
    expect(result).toEqual(['name', 'phone', 'active']);
  });

  it('returns error for invalid fields', () => {
    const result = validateStudentsUpdate({ fields: { unknown: 'x' } });
    expect(result).toBeInstanceOf(Error);
  });
});

describe('validateTeachersUpdate', () => {
  it('returns valid teacher fields', () => {
    const result = validateTeachersUpdate({
      fields: { name: 'Profesor', amount: 50000 },
    });
    expect(result).toEqual(['name', 'amount']);
  });

  it('returns error for invalid fields', () => {
    const result = validateTeachersUpdate({ fields: { unknown: 'x' } });
    expect(result).toBeInstanceOf(Error);
  });
});
