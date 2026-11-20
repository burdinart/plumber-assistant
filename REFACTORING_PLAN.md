# План реконструкции кода — «Помощник Сантехника»

Дата аудита: 2026-11-20
Ветка: `qwen-code-d3cdb8f0-d66a-485a-aec3-31be90d3fec6` (рабочее дерево чистое)

## Текущее состояние (проверено фактически)

| Проверка | Результат |
|---|---|
| `npm run typecheck` (`tsc --noEmit`) | ✅ без ошибок |
| `npm run build` (Vite + PWA) | ✅ успешно, 85 precache-записей |
| Объём `src/` | 124 TS/TSX-файла, ~24 900 строк |
| Тесты | ❌ отсутствуют (нет ни одного тест-файла, нет тест-раннера) |
| CI | GitHub Actions deploy (Pages), тестов/линта в pipeline нет |

Стек: React 18 + TypeScript + Vite 6 + Tailwind v4 + Zustand (persist → localStorage) +
React Router (lazy-страницы) + PWA (generateSW) + IndexedDB (фотоотчёты) + jspdf.
Архитектура — FSD-подобная: `app / features / shared`. В целом структура здоровая,
реконструкция нужна точечная, а не перепись.

---

## Найденные проблемы (по убыванию приоритета)

### P1. Дублирование состояния и рассинхрон источников данных
- **Документы живут в двух местах**: `shared/store/useAppStore.ts` хранит `documents[]`
  (persist), но `features/documents/hooks/useDocuments.ts` работает напрямую с
  `localStorage` и **не использует стор**. Отсюда «мост»-костыль в
  `useClients.ts` («Гидрация CRM-клиентов из LocalStorage в глобальный стор»).
- **Дубли типов**: `Reminder` и `Client` объявлены и в `shared/types/index.ts`,
  и в `features/reminders/types.ts` / локально — риск разъезда схем.
- **Прямые обращения к `localStorage`** в ~18 файлах вместо инкапсуляции через
  `shared/utils/storage.ts`.

**Решение:**
1. Один источник правды на сущность: либо всё через Zustand-slices с `persist`,
   либо всё через хуки + `storage`. Рекомендуется вариант A: разбить `useAppStore`
   на slices (`clientsSlice`, `documentsSlice`, `remindersSlice`, `settingsSlice`),
   перевести `useDocuments` на slice, удалить `setClients`-гидрацию.
2. Типы сущностей оставить только в `features/*/types.ts`; `shared/types` — только
   действительно общие типы. Либо наоборот — единый `shared/types`, но одно место.
3. Запретить прямой `localStorage` правилом ESLint (`no-restricted-globals`) —
   только через `shared/utils/storage.ts`.

### P2. Мёртвый код и несогласованность feature-папок
- `features/pump-selection/PumpSelectionPage.tsx` **никуда не импортируется**
  (в роутере его нет) — дублирует функциональность `calculators/components/PumpCalculator`.
- Калькуляторы размазаны по двум конвенциям: отдельные top-level features
  (`pressure-calculator`, `pipe-calculator`, `water-flow-calculator`, `heat-loss`,
  `pipe-length`) и компоненты внутри `features/calculators/components/`
  (`PipeDiameterCalculator`, `SlopeCalculator`, `ExpansionTankCalculator`, …).

**Решение:** удалить `pump-selection` (или слить в `calculators`); все калькуляторы
свести в `features/calculators/{components,data,utils}` с единой схемой именования.

### P3. Гигантские компоненты (>400 строк, смешана логика/данные/UI)
Top: `DocumentEditor` 730, `ReminderForm` 691, `ClientCard` 557, `ClientForm` 551,
`DashboardPage` 547, `ProfilePage` 538, `PropertyForm` 511, `EstimateForm` 505,
`ActForm` 471, `ContractForm` 458, `WarrantyForm` 420.
Отдельно: статические данные прямо в компонентах (`boilerErrors.ts` — ок, это data;
но таблицы справочников внутри `MaterialsReferencePage` 458 строк — нет).

**Решение (без big-bang):**
- Из форм выделить чистую логику в хуки (`useXxxForm`: state, валидация, submit) —
  формы станут тонкими; хуки станет возможно тестировать.
- Повторяющиеся поля/секции форм (адрес, телефон, клиент-select, даты) — в
  `shared/ui/form/`.
- Справочные таблицы вынести в `data/*.ts`.
- Критерий готовности файла: ≤ 250 строк, один компонент или одна тема.

### P4. Отсутствие тестов при активной бизнес-логике
Уже есть готовые к покрытию чистые модули: `calculators/utils/designCalculations.ts`,
`reference/regulations/logic/search.ts`, `reminders/utils/dateUtils.ts`,
`finance`-расчёты смет, `helpers.ts`. Есть `TESTING_TRANSACTIONS.md` — ручные проверки.

**Решение:**
1. Внедрить Vitest (`npm i -D vitest` + `test` script; для компонентов позже —
   @testing-library/react + jsdom).
2. Начать с unit-тестов чистой логики (калькуляторы, финансы, поиск, даты) —
   это безопасно фиксирует поведение **до** рефакторинга форм (страховочная сетка).
3. Добавить `lint` (ESLint + typescript-eslint + react-hooks) и включить
   `typecheck && lint && test` в CI перед deploy-workflow.

### P5. Хлам в корне репозитория
- Файлы-артефакты диффов, не нужные в `main`: `README_diff.md`, `vite.config_diff.js`,
  `src_app_router_index_diff.tsx`, `github_workflows_deploy_diff.yml`, `ROOT_INDEX.html`.
- Шесть MD-отчётов об отдельных изменениях (`PHASE_REMOVAL.md`, `PUSH_NOTIFICATIONS.md`,
  `VERSION_FIX.md`, …) — история изменений, а не документация проекта.
- `.gitignore` повреждён: строки склеены (`dist/src/app/router/lazyPages.tsx`), из-за чего
  артефакты сборки не игнорируются корректно; в git отслеживается 12 файлов из `dist/`.
- В `package.json` зависимость `@supabase/supabase-js` не используется в коде (0 импортов).

**Решение:** diff-артефакты удалить; отчёты переместить в `docs/changes/`; починить
`.gitignore` (`dist/`, `node_modules/` построчно) и `git rm -r --cached dist`;
удалить supabase из зависимостей; `package.json` переименовать из
`sandbox-workspace` → `plumber-assistant`.

### P6. Мелочи
- `main.tsx`: логирование версии/ручных ссылок на GitHub в консоль прода — убрать
  за `import.meta.env.DEV`.
- `version.ts`: версия хардкодом + changelog в коде — синхронизировать с
  `package.json` через `__APP_VERSION__` define на сборке.
- README: нумерация шагов местами сбитая (1,2,4,6), раздел «Фаза 1…» описывает уже
  удалённые фазы (см. PHASE_REMOVAL.md) — актуализировать после переноса docs.

---

## Порядок работ (поэтапно, каждый этап — отдельный коммит/PR, зелёный build+typecheck)

| Этап | Содержание | Риск |
|---|---|---|
| 0 | Починка `.gitignore`, удаление diff-артефактов, docs → `docs/`, мусорные зависимости | ~0 |
| 1 | Vitest + ESLint + CI-gate; unit-тесты на существующую чистую логику | 0 (только добавление) |
| 2 | Удаление мёртвого кода (`pump-selection`), консолидация калькуляторов в `features/calculators` | низкий |
| 3 | Единый источник данных: Zustand-slices, перевод `useDocuments`/`useClients`, запрет прямого localStorage | средний |
| 4 | Декомпозиция гигантских форм: выделение `use*Form`-хуков, общих секций в `shared/ui/form` | средний |
| 5 | Типы: устранение дублей `Reminder`/`Client`; версионирование из package.json | низкий |
| 6 | Актуализация README/docs, удаление устаревших разделов | 0 |

Контрольные точки после каждого этапа: `npm run typecheck && npm run build && npm test`.
