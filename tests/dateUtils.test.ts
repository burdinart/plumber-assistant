import { describe, it, expect } from 'vitest';
import { getRemindersWord } from '../src/features/reminders/utils/dateUtils';

describe('getRemindersWord (склонение)', () => {
  it.each([
    [1, 'напоминание'],
    [21, 'напоминание'],
    [2, 'напоминания'],
    [4, 'напоминания'],
    [24, 'напоминания'],
    [5, 'напоминаний'],
    [11, 'напоминаний'],
    [14, 'напоминаний'],
    [111, 'напоминаний'],
    [0, 'напоминаний'],
  ])('%d → %s', (count, expected) => {
    expect(getRemindersWord(count)).toBe(expected);
  });
});
