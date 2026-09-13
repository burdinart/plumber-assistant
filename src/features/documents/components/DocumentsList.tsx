import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Eye, Printer, Trash2, Camera } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { DocumentType, DOCUMENT_TYPE_NAMES } from '../types';
import { formatDocumentDate } from '../utils/documentHelpers';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';

export function DocumentsList() {
  const { documents, deleteDocument } = useDocuments();
  const { getClient } = useClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; type: DocumentType } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Объединяем все документы в один массив
  const allDocuments = [
    ...documents.acts.map(act => ({ ...act, documentType: 'act' as const })),
    ...documents.contracts.map(contract => ({ ...contract, documentType: 'contract' as const })),
    ...documents.warranties.map(warranty => ({ ...warranty, documentType: 'warranty' as const })),
    ...documents.photoReports.map(report => ({ ...report, documentType: 'photo_report' as const })),
  ];

  // Фильтрация и поиск
  const filteredDocuments = allDocuments
    .filter(doc => {
      const matchesType = typeFilter === 'all' || doc.documentType === typeFilter;
      const client = getClient(doc.clientId);
      const matchesSearch = searchQuery === '' || 
        doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = (id: string, type: DocumentType) => {
    setDocumentToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id, documentToDelete.type);
      setToast({ message: 'Документ удалён', type: 'success' });
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const getPreviewLink = (doc: typeof allDocuments[0]): string => {
    switch (doc.documentType) {
      case 'act':
        return `/documents/acts/${doc.id}`;
      case 'contract':
        return `/documents/contracts/${doc.id}`;
      case 'warranty':
        return `/documents/warranties/${doc.id}`;
      case 'photo_report':
        return `/documents/photo-reports/${doc.id}`;
    }
  };

  const getTypeColor = (type: DocumentType): string => {
    switch (type) {
      case 'act':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'contract':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'warranty':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'photo_report':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Документы</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {allDocuments.length} документов
            </p>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2">
          <Link
            to="/documents/acts/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Акт</span>
          </Link>
          <Link
            to="/documents/contracts/new"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Договор</span>
          </Link>
          <Link
            to="/documents/warranties/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Талон</span>
          </Link>
          <Link
            to="/documents/photo-reports/new"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Фотоотчёт</span>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру или клиенту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              typeFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            Все
          </button>
          {(Object.keys(DOCUMENT_TYPE_NAMES) as DocumentType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {DOCUMENT_TYPE_NAMES[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Documents list */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => {
            const client = getClient(doc.clientId);
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {doc.number}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(doc.documentType)}`}>
                        {DOCUMENT_TYPE_NAMES[doc.documentType]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {client?.name || 'Клиент не найден'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Создан: {formatDocumentDate(doc.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={getPreviewLink(doc)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      title="Просмотр"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`${getPreviewLink(doc)}?print=true`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Печать"
                    >
                      <Printer className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(doc.id, doc.documentType)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Документы не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || typeFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первый документ'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить документ?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить этот документ? Это действие нельзя отменить.
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
