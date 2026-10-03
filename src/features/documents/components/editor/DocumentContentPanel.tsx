import { Plus, Trash2 } from 'lucide-react';
import type { DocumentItem } from '../../types';
import { DEFAULT_UNIT, unitOptionsFor } from '../../utils/units';

const INPUT_CLS =
  'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
const LABEL_CLS = 'block text-sm font-medium text-gray-300 mb-2';
const CARD_CLS = 'bg-gray-800 rounded-xl p-4';
const ITEM_INPUT_CLS =
  'px-2 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';

interface DocumentContentPanelProps {
  title: string;
  content?: {
    subject?: string;
    description?: string;
    items?: DocumentItem[];
    totalAmount?: number;
    warrantyPeriod?: string;
    paymentTerms?: string;
  };
  onFieldChange: (field: string, value: any) => void;
  onContentChange: (field: string, value: any) => void;
  onAddItem: () => void;
  onUpdateItem: (index: number, field: keyof DocumentItem, value: any) => void;
  onRemoveItem: (index: number) => void;
}

/** Правая колонка редактора: содержание, таблица работ/материалов, доп. условия. */
export const DocumentContentPanel = ({
  title,
  content,
  onFieldChange,
  onContentChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: DocumentContentPanelProps) => {
  const items = content?.items || [];

  return (
    <div className="space-y-4">
      {/* Название и предмет */}
      <div className={`${CARD_CLS} space-y-4`}>
        <h3 className="text-lg font-semibold text-white">Содержание</h3>
        <div>
          <label className={LABEL_CLS}>Название *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            className={INPUT_CLS}
            placeholder="Например: Акт выполненных работ по установке сантехники"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Предмет</label>
          <input
            type="text"
            value={content?.subject || ''}
            onChange={(e) => onContentChange('subject', e.target.value)}
            className={INPUT_CLS}
            placeholder="Например: Монтаж системы отопления"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Описание</label>
          <textarea
            value={content?.description || ''}
            onChange={(e) => onContentChange('description', e.target.value)}
            className={`${INPUT_CLS} resize-none`}
            rows={3}
            placeholder="Подробное описание работ"
          />
        </div>
      </div>

      {/* Таблица работ/материалов */}
      <div className={CARD_CLS}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Работы и материалы</h3>
          <button
            onClick={onAddItem}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Нет позиций. Добавьте работы или материалы.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-12 gap-2 items-center bg-gray-700 p-3 rounded-lg"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onUpdateItem(index, 'name', e.target.value)}
                  className={`${ITEM_INPUT_CLS} col-span-5`}
                  placeholder="Наименование"
                />
                <select
                  value={item.unit || DEFAULT_UNIT}
                  onChange={(e) => onUpdateItem(index, 'unit', e.target.value)}
                  className={`${ITEM_INPUT_CLS} col-span-1 text-center`}
                  title="Единица измерения"
                >
                  {unitOptionsFor(item.unit).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
                  step="any"
                  min="0"
                  className={`${ITEM_INPUT_CLS} col-span-2 text-center`}
                  placeholder="Кол-во"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => onUpdateItem(index, 'price', Number(e.target.value))}
                  className={`${ITEM_INPUT_CLS} col-span-2 text-right`}
                  placeholder="Цена"
                />
                <div className="col-span-1 text-right text-white text-sm font-medium">
                  {item.total.toFixed(0)} ₽
                </div>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="col-span-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Итого */}
            <div className="mt-3 pt-3 border-t border-gray-600 flex justify-end">
              <div className="text-lg font-bold text-white">
                Итого: {content?.totalAmount?.toFixed(2) || '0.00'} ₽
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Дополнительные условия */}
      <div className={`${CARD_CLS} space-y-4`}>
        <h3 className="text-lg font-semibold text-white">Дополнительно</h3>
        <div>
          <label className={LABEL_CLS}>Гарантийный срок</label>
          <input
            type="text"
            value={content?.warrantyPeriod || ''}
            onChange={(e) => onContentChange('warrantyPeriod', e.target.value)}
            className={INPUT_CLS}
            placeholder="Например: 12 месяцев"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Условия оплаты</label>
          <textarea
            value={content?.paymentTerms || ''}
            onChange={(e) => onContentChange('paymentTerms', e.target.value)}
            className={`${INPUT_CLS} resize-none`}
            rows={2}
            placeholder="Условия оплаты работ"
          />
        </div>
      </div>
    </div>
  );
};
