import { describe, it, expect } from 'vitest';
import {
  formatConsecutive,
  formatDate,
  formatCRC,
  formatPhone,
  formatMonth,
  handleFieldChange,
  onRadixChange,
} from './Function.jsx';

describe('formatConsecutive', () => {
  it('pads sequence to 5 digits', () => {
    expect(formatConsecutive(2024, 1)).toBe('2024-00001');
  });

  it('formats multi-digit sequences', () => {
    expect(formatConsecutive(2024, 123)).toBe('2024-00123');
    expect(formatConsecutive(2025, 99999)).toBe('2025-99999');
  });

  it('handles zero sequence', () => {
    expect(formatConsecutive(2024, 0)).toBe('2024-00000');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to locale', () => {
    const result = formatDate('2024-01-15T00:00:00');
    expect(result).toContain('2024');
  });

  it('formats date-only string', () => {
    const result = formatDate('2024-06-01');
    expect(result).toBeTruthy();
  });
});

describe('formatCRC', () => {
  it('formats number as CRC currency', () => {
    const result = formatCRC(50000);
    expect(result).toContain('50');
    expect(result).toContain('000');
  });

  it('returns empty string for null', () => {
    expect(formatCRC(null)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatCRC('')).toBe('');
  });

  it('formats zero', () => {
    const result = formatCRC(0);
    expect(result).toContain('0');
  });

  it('formats decimal amounts', () => {
    const result = formatCRC(15000.5);
    expect(result).toContain('15');
  });
});

describe('formatPhone', () => {
  it('formats 8-digit number with dash', () => {
    expect(formatPhone('88881234')).toBe('8888-1234');
  });

  it('formats digits with other characters', () => {
    expect(formatPhone('8888 1234')).toBe('8888-1234');
  });

  it('returns original for non-8-digit input', () => {
    expect(formatPhone('12345')).toBe('12345');
    expect(formatPhone('123456789')).toBe('123456789');
  });

  it('returns empty string for falsy values', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone(null)).toBe('');
    expect(formatPhone(undefined)).toBe('');
  });
});

describe('formatMonth', () => {
  it('returns Spanish month names', () => {
    expect(formatMonth(1)).toBe('Enero');
    expect(formatMonth(6)).toBe('Junio');
    expect(formatMonth(12)).toBe('Diciembre');
  });

  it('returns N/A for zero', () => {
    expect(formatMonth(0)).toBe('N/A');
  });

  it('returns N/A for falsy values', () => {
    expect(formatMonth(null)).toBe('N/A');
    expect(formatMonth(undefined)).toBe('N/A');
    expect(formatMonth(false)).toBe('N/A');
  });

  it('returns undefined for invalid month numbers', () => {
    expect(formatMonth(13)).toBeUndefined();
    expect(formatMonth(-1)).toBeUndefined();
  });
});

describe('handleFieldChange', () => {
  it('calls handleChange with synthetic event', () => {
    const handleChange = vi.fn();
    const handler = handleFieldChange(handleChange, 'testField');
    handler('testValue');
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'testField', value: 'testValue' },
    });
  });
});

describe('onRadixChange', () => {
  it('calls handleChange with synthetic event', () => {
    const handleChange = vi.fn();
    const handler = onRadixChange(handleChange, 'radixField');
    handler('radixValue');
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'radixField', value: 'radixValue' },
    });
  });
});
