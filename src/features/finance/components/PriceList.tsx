import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { usePriceList } from '../hooks/usePriceList';
import { PriceItem, PriceCategory, PRICE_CATEGORY_NAMES } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';
import { PriceItemForm } from './PriceItemForm';

export function PriceList() {
  const { priceList, deletePriceItem, search, getByCategory } = usePriceList();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PriceCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PriceItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Фильтрация
  const filteredItems = (() => {
    let items = searchQuery ? search(searchQuery) : priceList;
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    return items;
  })();

  const handleEdit = (item: PriceItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (item: PriceItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const success = deletePriceItem(itemToDelete.id);
      if (success) {
        setToast({ message: 'Работа удалена', type: 'success' });
      } else {
        setToast({ message: 'Нельзя удалить системную работу', type: 'error' });
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const categories: Array<PriceCategory | 'all'> = ['all', 'plumbing', 'heating', 'sewage', 'boilers'];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Прайс-лист</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {priceList.length} работ
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Добавить работу</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск работы..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {cat === 'all' ? 'Все' : PRICE_CATEGORY_NAMES[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                      {PRICE_CATEGORY_NAMES[item.category]}
                    </span>
                    {item.isDefault && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        Системная
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    за {item.unit}
                  </div>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {item.description}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Изменить
                </button>
                {!item.isDefault && (
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Работы не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первую работу'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить работу
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal isOpen={showForm} onClose={handleFormClose} title={editingItem ? 'Редактирование работы' : 'Новая работа'}>
          <PriceItemForm item={editingItem} onClose={handleFormClose} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить работу?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить работу <strong>{itemToDelete?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Удалить
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
