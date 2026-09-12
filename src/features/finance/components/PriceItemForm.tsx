import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { usePriceList } from '../hooks/usePriceList';
import { PriceItem, PriceCategory, PriceUnit, PRICE_CATEGORY_NAMES } from '../types';
import { Toast } from '../../../shared/ui/Toast';

interface PriceItemFormProps {
  item: PriceItem | null;
  onClose: () => void;
}

export function PriceItemForm({ item, onClose }: PriceItemFormProps) {
  const { addPriceItem, updatePriceItem } = usePriceList();
  const isEditing = Boolean(item);

  const [formData, setFormData] = useState({
    name: '',
    category: 'plumbing' as PriceCategory,
    price: 0,
    unit: 'шт' as PriceUnit,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        unit: item.unit,
        description: item.description || '',
      });
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите название работы';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: 'Заполните обязательные поля', type: 'error' });
      return;
    }

    try {
      if (isEditing && item) {
        updatePriceItem(item.id, formData);
        setToast({ message: 'Работа обновлена', type: 'success' });
      } else {
        addPriceItem(formData);
        setToast({ message: 'Работа добавлена', type: 'success' });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const units: PriceUnit[] = ['шт', 'м', 'точка', 'час'];
  const categories: PriceCategory[] = ['plumbing', 'heating', 'sewage', 'boilers'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Название */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Название работы <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Например: Замена смесителя"
          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Категория */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Категория
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {PRICE_CATEGORY_NAMES[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Цена и единица измерения */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цена (₽) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            min="0"
            step="100"
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.price ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.price && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ед. измерения
          </label>
          <select
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Описание */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Описание работы (необязательно)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Сохранить' : 'Добавить'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  );
}
