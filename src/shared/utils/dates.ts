/**
 * Общие утилиты дат (shared-слой).
 * Единственный источник для getTodayDate/getDateAfterDays за пределами финмодуля —
 * раньше features/documents импортировал их напрямую из features/finance (нарушение
 * изоляции фич). Реэкспортирует реализацию из features/finance/utils/dateUtils.
 */
export { getTodayDate, getDateAfterDays } from '../../features/finance/utils/dateUtils';
