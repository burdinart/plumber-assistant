import { describe, it, expect } from 'vitest';
import { formatPhone, validatePhone, validateEmail } from '../src/shared/utils/helpers';

describe('formatPhone', () => {
  it('нормализует номер с 8 в начало', () => {
    expect(formatPhone('89161234567')).toBe('+7 (916) 123-45-67');
  });
  it('форматирует номер с 7', () => {
    expect(formatPhone('+7 (916) 123-45-67')).toBe('+7 (916) 123-45-67');
  });
  it('оставляет без изменений нестандартный ввод', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('validatePhone', () => {
  it.each(['89161234567', '+7 (916) 123-45-67'])('валиден: %s', (p) => {
    expect(validatePhone(p)).toBe(true);
  });
  it.each(['9161234567', '8916123456', '', '+7 916'])('невалиден: "%s"', (p) => {
    expect(validatePhone(p)).toBe(false);
  });
});

describe('validateEmail', () => {
  it('пустой email опционален → валиден', () => expect(validateEmail('')).toBe(true));
  it('принимает корректный', () => expect(validateEmail('a@b.ru')).toBe(true));
  it('отклоняет некорректный', () => expect(validateEmail('a@b')).toBe(false));
});
