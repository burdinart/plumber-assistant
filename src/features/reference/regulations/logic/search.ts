import type { RegulationEntry, QuickTable } from '../types';
import { regulationsData } from '../data/regulationsData';
import { quickTables } from '../data/quickTables';

/**
 * Нормализация строки для поиска: нижний регистр, убрать пунктуацию
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
}

/**
 * Разбить запрос на токены
 */
function tokenize(query: string): string[] {
  return normalize(query).split(/\s+/).filter(t => t.length > 0);
}

/**
 * Проверка числового совпадения (например "110" в запросе и "110 мм" в значении)
 */
function hasNumericMatch(query: string, text: string): boolean {
  const queryNumbers = query.match(/\d+/g);
  if (!queryNumbers) return false;
  
  const normalizedText = normalize(text);
  return queryNumbers.some(num => normalizedText.includes(num));
}

/**
 * Алгоритм нечёткого поиска
 */
export function searchRegulations(query: string): RegulationEntry[] {
  if (!query.trim()) return [];
  
  const tokens = tokenize(query);
  const normalizedQuery = normalize(query);
  
  const scored = regulationsData.map(entry => {
    let score = 0;
    const normalizedTitle = normalize(entry.title);
    const normalizedValue = normalize(entry.value);
    const normalizedKeywords = entry.keywords.map(k => normalize(k));
    
    // Совпадение в title: +10
    if (normalizedTitle === normalizedQuery) {
      score += 10;
    }
    
    // Подстрока в title: +3
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 3;
    }
    
    // Совпадение в keywords: +5 за каждый токен
    for (const token of tokens) {
      for (const keyword of normalizedKeywords) {
        if (keyword.includes(token)) {
          score += 5;
          break;
        }
      }
    }
    
    // Числовое совпадение: +4
    if (hasNumericMatch(query, entry.title) || hasNumericMatch(query, entry.value)) {
      score += 4;
    }
    
    // Бонус для быстрых таблиц
    if (entry.isQuickTable) {
      score += 2;
    }
    
    return { entry, score };
  });
  
  // Фильтруем по score > 0 и сортируем по убыванию
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.entry);
}

/**
 * Получить быструю таблицу по ID
 */
export function getQuickTableById(id: string): QuickTable | undefined {
  return quickTables.find(table => table.id === id);
}

/**
 * Получить все записи для быстрой таблицы
 */
export function getEntriesForQuickTable(groupId: string): RegulationEntry[] {
  return regulationsData.filter(entry => entry.quickTableGroup === groupId);
}

/**
 * Получить записи по категории
 */
export function getRegulationsByCategory(category: RegulationEntry['category']): RegulationEntry[] {
  return regulationsData.filter(entry => entry.category === category);
}
