import { describe, it, expect } from 'vitest';
import { validateEmail, validateCPF, validatePhone, getPasswordStrength } from './validations';

describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });
});

describe('validateCPF', () => {
  it('should accept valid CPF with formatting', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('should accept valid CPF without formatting', () => {
    expect(validateCPF('52998224725')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validateCPF('')).toBe(false);
  });

  it('should reject all same digits', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('000.000.000-00')).toBe(false);
  });

  it('should reject too short', () => {
    expect(validateCPF('123')).toBe(false);
  });

  it('should reject invalid check digits', () => {
    expect(validateCPF('529.982.247-26')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('should accept 11-digit phone', () => {
    expect(validatePhone('(11) 99999-9999')).toBe(true);
  });

  it('should accept 10-digit phone', () => {
    expect(validatePhone('(11) 3333-3333')).toBe(true);
  });

  it('should accept raw digits', () => {
    expect(validatePhone('11999999999')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validatePhone('')).toBe(false);
  });

  it('should reject too short', () => {
    expect(validatePhone('123')).toBe(false);
  });
});

describe('getPasswordStrength', () => {
  it('should return score 0 for empty password', () => {
    const result = getPasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('Fraca');
  });

  it('should return Fraca for weak password', () => {
    const result = getPasswordStrength('abc');
    expect(result.label).toBe('Fraca');
    expect(result.score).toBeLessThan(3);
  });

  it('should return Média for medium password', () => {
    // Score: length>=8 (1) + uppercase (1) + number (1) = 3 → Média
    const result = getPasswordStrength('Abcdefg1');
    expect(result.label).toBe('Média');
  });

  it('should return Forte for strong password', () => {
    const result = getPasswordStrength('MyStr0ng!P@ss');
    expect(result.label).toBe('Forte');
    expect(result.score).toBeGreaterThanOrEqual(4);
  });

  it('should give higher score for longer passwords', () => {
    const short = getPasswordStrength('abc');
    const long = getPasswordStrength('abcdefghij');
    expect(long.score).toBeGreaterThan(short.score);
  });

  it('should give higher score for uppercase letters', () => {
    const lower = getPasswordStrength('abcdef');
    const upper = getPasswordStrength('Abcdef');
    expect(upper.score).toBeGreaterThan(lower.score);
  });

  it('should give higher score for numbers', () => {
    const noNum = getPasswordStrength('abcdef');
    const withNum = getPasswordStrength('abcde1');
    expect(withNum.score).toBeGreaterThan(noNum.score);
  });

  it('should give higher score for special characters', () => {
    const plain = getPasswordStrength('abcdef');
    const special = getPasswordStrength('abcde!');
    expect(special.score).toBeGreaterThan(plain.score);
  });
});
