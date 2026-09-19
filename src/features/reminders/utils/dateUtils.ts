const daysOfWeekNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const daysOfWeekFull = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

/**
 * Форматирует дату в русском формате (15 сентября 2026)
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Форматирует дату и время (15 сентября 2026, 14:30)
 */
export const formatDateTime = (dateString: string, time: string): string => {
  const date = new Date(`${dateString}T${time}`);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Возвращает строку времени до события (через 2 ч. 30 мин.)
 */
export const getTimeUntil = (date: string | undefined, time: string): string => {
  if (!date) return '';
  
  const fireDate = new Date(`${date}T${time}`);
  const now = new Date();
  const diff = fireDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'уже прошло';
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `через ${days} дн. ${hours % 24} ч.`;
  if (hours > 0) return `через ${hours} ч. ${minutes % 60} мин.`;
  if (minutes > 0) return `через ${minutes} мин.`;
  return 'менее минуты';
};

/**
 * Возвращает дату следующего срабатывания для повторяющегося напоминания
 */
export const getNextFireDate = (time: string, daysOfWeek: number[]): string => {
  if (daysOfWeek.length === 0) return '—';
  
  const now = new Date();
  const currentDay = now.getDay();
  const [hours, minutes] = time.split(':').map(Number);
  
  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDay + i) % 7;
    if (daysOfWeek.includes(dayIndex)) {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + i);
      nextDate.setHours(hours, minutes, 0, 0);
      return nextDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  return '—';
};

/**
 * Склоняет слово "напоминание" по числам
 */
export const getRemindersWord = (count: number): string => {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  
  if (lastTwo >= 11 && lastTwo <= 19) return 'напоминаний';
  if (lastOne === 1) return 'напоминание';
  if (lastOne >= 2 && lastOne <= 4) return 'напоминания';
  return 'напоминаний';
};

export { daysOfWeekNames, daysOfWeekFull };
