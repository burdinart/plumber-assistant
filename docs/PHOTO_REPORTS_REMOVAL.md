# Удаление функциональности фотоотчётов

## 📋 Описание изменений

Полностью удалена функциональность фотоотчётов из приложения "Помощник Сантехника".

## 🗑️ Что было удалено

### 1. Компоненты
- ❌ `src/features/documents/components/PhotoReport.tsx` - компонент формы фотоотчёта

### 2. Маршруты
- ❌ Маршрут `/documents/photo-reports/new` из `src/app/router/index.tsx`
- ❌ Импорт `PhotoReportForm` из роутера

### 3. Типы и интерфейсы
- ❌ Тип `'photo_report'` из `DocumentType` в `src/features/documents/types.ts`
- ❌ Интерфейс `PhotoReport` из `src/features/documents/types.ts`
- ❌ Интерфейс `Photo` из `src/features/documents/types.ts`
- ❌ Поле `photoReports` из интерфейса `Documents`
- ❌ Запись `photo_report` из `DOCUMENT_TYPE_NAMES`
- ❌ Запись `photo_report` из `DOCUMENT_NUMBER_PREFIXES`
- ❌ Комментарий `ФОТ-001` из `BaseDocument`

### 4. Хук useDocuments
- ❌ Импорт типа `PhotoReport` из `src/features/documents/hooks/useDocuments.ts`
- ❌ Поле `photoReports` из демо-данных `DEMO_DOCUMENTS`
- ❌ Функция `createPhotoReport()`
- ❌ Обработка `case 'photo_report'` в функции `updateDocument()`
- ❌ Обработка `case 'photo_report'` в функции `deleteDocument()`
- ❌ Возврат `photoReports` из функции `getByClient()`
- ❌ Возврат `photoReports` из функции `getByOrder()`
- ❌ Функция `getPhotoReport()`
- ❌ Экспорт `createPhotoReport` и `getPhotoReport` из хука

### 5. Компонент DocumentsList
- ❌ Импорт иконки `Camera` из `lucide-react`
- ❌ Добавление `photoReports` в массив `allDocuments`
- ❌ Обработка `case 'photo_report'` в функции `getPreviewLink()`
- ❌ Обработка `case 'photo_report'` в функции `getTypeColor()`
- ❌ Кнопка создания фотоотчёта с иконкой камеры

## ✅ Что осталось

### Документы
- ✅ Акты выполненных работ
- ✅ Договоры с клиентами
- ✅ Гарантийные талоны

### Функциональность
- ✅ Создание, редактирование и удаление актов
- ✅ Создание, редактирование и удаление договоров
- ✅ Создание, редактирование и удаление гарантийных талонов
- ✅ Поиск и фильтрация документов
- ✅ Просмотр документов

## 📊 Результаты

### До изменений
- 4 типа документов: акты, договоры, гарантийные талоны, фотоотчёты
- 4 кнопки создания в интерфейсе
- Поддержка загрузки фото "ДО" и "ПОСЛЕ"

### После изменений
- 3 типа документов: акты, договоры, гарантийные талоны
- 3 кнопки создания в интерфейсе
- Упрощённый интерфейс без функциональности фотоотчётов

## 🔍 Проверка

### В коде
- Откройте `src/features/documents/types.ts` - тип `DocumentType` содержит только `'act' | 'contract' | 'warranty'`
- Откройте `src/features/documents/hooks/useDocuments.ts` - нет упоминаний `photoReports`
- Откройте `src/features/documents/components/DocumentsList.tsx` - нет кнопки фотоотчёта

### В интерфейсе
- На странице "Документы" отображаются только 3 типа документов
- Нет кнопки "Фотоотчёт" в блоке быстрых действий
- В фильтрах нет опции "Фотоотчёт"

## 📦 Размер сборки

После удаления фотоотчётов:
- JavaScript: 713.10 kB (gzip: 154.46 kB)
- CSS: 64.57 kB (gzip: 10.44 kB)
- Precache: 764.23 KiB

Уменьшение размера по сравнению с предыдущей версией.

## 🚀 Следующие шаги

1. Закоммитьте изменения:
```bash
git add .
git commit -m "refactor: remove photo reports functionality"
git push origin main
```

2. Проверьте работу приложения:
  - Создание актов
  - Создание договоров
  - Создание гарантийных талонов
  - Поиск и фильтрация документов

## 📞 Поддержка

Если потребуется вернуть функциональность фотоотчётов:
1. Восстановите файл `src/features/documents/components/PhotoReport.tsx` из git history
2. Добавьте тип `photo_report` обратно в `DocumentType`
3. Восстановите интерфейсы `PhotoReport` и `Photo`
4. Добавьте функции `createPhotoReport` и `getPhotoReport` в хук `useDocuments`
5. Добавьте кнопку создания фотоотчёта в `DocumentsList.tsx`
6. Добавьте маршрут `/documents/photo-reports/new` в роутер

---

**Дата изменения:** 14.09.2026  
**Версия:** 1.0.0
