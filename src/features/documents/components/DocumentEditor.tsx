import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../../profile/hooks/useProfile';
import { useAppStore } from '../../../shared/store/useAppStore';
import { Document, DocumentType, DocumentContent, DocumentItem, ChangeHistoryEntry } from '../types';
import { generateDocumentPDF } from '../utils/pdfGenerator';
import { getChangedFields } from '../utils/diffUtils';
import { FileText, Save, Download, X, Plus, Trash2, Eye, User, Building, ArrowLeft } from 'lucide-react';

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'act', label: 'Акт выполненных работ' },
  { value: 'contract', label: 'Договор на оказание услуг' },
  { value: 'warranty', label: 'Гарантийный талон' },
  { value: 'handover', label: 'Акт приёмки-передачи' },
  { value: 'estimate', label: 'Смета' },
];

export const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { documents, addDocument, updateDocument, clients } = useAppStore();
  
  const [document, setDocument] = useState<Partial<Document>>({
    type: 'act',
    title: '',
    number: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    clientId: '',
    content: {
      subject: '',
      description: '',
      items: [],
      totalAmount: 0,
      contractorSigned: false,
      customerSigned: false,
    } as Partial<DocumentContent>,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const isEditMode = !!id && id !== 'new';

  // Загрузка существующего документа
  useEffect(() => {
    if (id && id !== 'new') {
      const existing = documents.find(d => d.id === id);
      if (existing) {
        setDocument(existing);
        if (existing.clientId) {
          const client = clients.find(c => c.id === existing.clientId);
          setSelectedClient(client || null);
        }
      } else {
        alert('Документ не найден');
        navigate('/documents');
      }
    }
  }, [id, documents, clients, navigate]);

  // Автозаполнение из профиля
  useEffect(() => {
    if (profile && !id) {
      // Генерация номера по шаблону
      const template = profile.contractNumberTemplate || '№ {number} от {date}';
      const nextNumber = (documents.filter(d => d.type === document.type).length + 1).toString();
      const dateStr = new Date().toLocaleDateString('ru-RU');
      
      const generatedNumber = template
        .replace('{number}', nextNumber)
        .replace('{date}', dateStr);

      setDocument(prev => ({
        ...prev,
        number: generatedNumber,
        content: {
          ...prev.content,
          contractor: profile,
        } as Partial<DocumentContent>,
      }));
    }
  }, [profile, document.type, documents, id]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setDocument(prev => ({ ...prev, clientId }));
    setHasChanges(true);
    
    if (client) {
      setDocument(prev => ({
        ...prev,
        content: {
          ...prev.content,
          customer: client,
        } as Partial<DocumentContent>,
      }));
    }
  };

  // Отслеживание изменений в полях документа
  const handleChange = (field: string, value: any) => {
    setDocument(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
    setHasChanges(true);
  };

  const handleContentChange = (field: string, value: any) => {
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      } as Partial<DocumentContent>,
    }));
    setHasChanges(true);
  };

  const addItem = () => {
    const newItem: DocumentItem = {
      name: '',
      unit: 'шт',
      quantity: 1,
      price: 0,
      total: 0,
    };
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: [...(prev.content?.items || []), newItem],
      } as Partial<DocumentContent>,
    }));
    setHasChanges(true);
  };

  const updateItem = (index: number, field: keyof DocumentItem, value: any) => {
    const items = [...(document.content?.items || [])];
    items[index] = { ...items[index], [field]: value };

    // Пересчёт суммы
    if (field === 'quantity' || field === 'price') {
      const qty = field === 'quantity' ? Number(value) : items[index].quantity;
      const price = field === 'price' ? Number(value) : items[index].price;
      items[index].total = qty * price;
    }

    // Пересчёт общей суммы
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items,
        totalAmount,
      } as Partial<DocumentContent>,
    }));
    setHasChanges(true);
  };

  const removeItem = (index: number) => {
    const items = (document.content?.items || []).filter((_, i) => i !== index);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items,
        totalAmount,
      } as Partial<DocumentContent>,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!document.title || !document.number) {
      alert('Заполните название и номер документа');
      return;
    }

    const docToSave: Document = {
      id: document.id || Date.now().toString(),
      type: document.type as DocumentType,
      title: document.title,
      number: document.number,
      date: document.date || new Date().toISOString(),
      clientId: document.clientId || '',
      content: document.content as DocumentContent,
      status: document.status || 'draft',
      createdAt: document.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (id && id !== 'new') {
      // Режим редактирования — обновляем существующий документ
      const oldDoc = documents.find(d => d.id === id);
      updateDocument(docToSave);
      
      // Добавляем запись в историю изменений
      if (oldDoc) {
        const changes = getChangedFields(docToSave, oldDoc);
        if (Object.keys(changes).length > 0) {
          const historyEntry: ChangeHistoryEntry = {
            action: 'updated',
            timestamp: new Date().toISOString(),
            changes,
          };
          // Используем addChangeHistory из store (будет добавлено)
          console.log('История изменений:', historyEntry);
        }
      }
    } else {
      // Режим создания — создаём новый документ
      addDocument(docToSave);
      
      // Добавляем запись о создании в историю
      const historyEntry: ChangeHistoryEntry = {
        action: 'created',
        timestamp: new Date().toISOString(),
      };
      console.log('Документ создан:', historyEntry);
    }

    setHasChanges(false);
    navigate('/documents');
  };

  const handleExportPDF = () => {
    if (!profile) {
      alert('Сначала заполните профиль пользователя в настройках');
      return;
    }

    const docToExport: Document = {
      id: document.id || 'temp',
      type: document.type as DocumentType,
      title: document.title,
      number: document.number,
      date: document.date || new Date().toISOString(),
      clientId: document.clientId || '',
      content: {
        ...document.content,
        contractor: profile,
        customer: selectedClient,
      } as DocumentContent,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    generateDocumentPDF(docToExport, profile);
  };

  const docType = DOCUMENT_TYPES.find(t => t.value === document.type);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">
            {id && id !== 'new' ? 'Редактирование документа' : 'Новый документ'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Предпросмотр
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Основная форма */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка - Основные данные */}
        <div className="space-y-4">
          {/* Тип документа */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Тип документа</h3>
            <select
              value={document.type}
              onChange={(e) => setDocument(prev => ({ ...prev, type: e.target.value as DocumentType }))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={id && id !== 'new'}
            >
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Номер и дата */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Реквизиты</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Номер *</label>
              <input
                type="text"
                value={document.number}
                onChange={(e) => setDocument(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="№ 1 от 01.01.2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Дата</label>
              <input
                type="date"
                value={document.date?.split('T')[0]}
                onChange={(e) => setDocument(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Заказчик */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Заказчик
            </h3>
            <select
              value={document.clientId || ''}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите клиента</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            
            {selectedClient && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                <p><strong>Телефон:</strong> {selectedClient.phone}</p>
                <p><strong>Адрес:</strong> {selectedClient.address}</p>
              </div>
            )}
          </div>

          {/* Исполнитель (из профиля) */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Исполнитель
            </h3>
            {profile ? (
              <div className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                <p><strong>{profile.companyName}</strong></p>
                <p>ИНН: {profile.inn || 'Не указан'}</p>
                <p>Телефон: {profile.phone}</p>
              </div>
            ) : (
              <div className="p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg text-sm text-yellow-300">
                <p>⚠️ Заполните профиль в настройках для автозаполнения</p>
                <button
                  onClick={() => navigate('/settings/profile')}
                  className="mt-2 text-blue-400 hover:text-blue-300 underline"
                >
                  Перейти в профиль
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка - Содержимое */}
        <div className="space-y-4">
          {/* Название и предмет */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Содержание</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название *</label>
              <input
                type="text"
                value={document.title}
                onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Акт выполненных работ по установке сантехники"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Предмет</label>
              <input
                type="text"
                value={document.content?.subject || ''}
                onChange={(e) => setDocument(prev => ({
                  ...prev,
                  content: { ...prev.content, subject: e.target.value } as Partial<DocumentContent>
                }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Монтаж системы отопления"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
              <textarea
                value={document.content?.description || ''}
                onChange={(e) => setDocument(prev => ({
                  ...prev,
                  content: { ...prev.content, description: e.target.value } as Partial<DocumentContent>
                }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Подробное описание работ"
              />
            </div>
          </div>

          {/* Таблица работ/материалов */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Работы и материалы</h3>
              <button
                onClick={addItem}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            </div>

            {(document.content?.items || []).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Нет позиций. Добавьте работы или материалы.</p>
            ) : (
              <div className="space-y-2">
                {(document.content?.items || []).map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-700 p-3 rounded-lg">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="col-span-5 px-2 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Наименование"
                    />
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="col-span-1 px-2 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      placeholder="Ед."
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="col-span-2 px-2 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      placeholder="Кол-во"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                      className="col-span-2 px-2 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                      placeholder="Цена"
                    />
                    <div className="col-span-1 text-right text-white text-sm font-medium">
                      {item.total.toFixed(0)} ₽
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="col-span-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Итого */}
                <div className="mt-3 pt-3 border-t border-gray-600 flex justify-end">
                  <div className="text-lg font-bold text-white">
                    Итого: {document.content?.totalAmount?.toFixed(2) || '0.00'} ₽
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Дополнительные условия */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Дополнительно</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Гарантийный срок</label>
              <input
                type="text"
                value={document.content?.warrantyPeriod || ''}
                onChange={(e) => setDocument(prev => ({
                  ...prev,
                  content: { ...prev.content, warrantyPeriod: e.target.value } as Partial<DocumentContent>
                }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: 12 месяцев"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Условия оплаты</label>
              <textarea
                value={document.content?.paymentTerms || ''}
                onChange={(e) => setDocument(prev => ({
                  ...prev,
                  content: { ...prev.content, paymentTerms: e.target.value } as Partial<DocumentContent>
                }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Условия оплаты работ"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно предпросмотра */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Предпросмотр документа</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 bg-white text-black min-h-[600px]">
              {/* Простой предпросмотр */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">{document.title}</h1>
                <p className="text-gray-600 mt-2">{document.number}</p>
                <p className="text-gray-600">от {new Date(document.date || '').toLocaleDateString('ru-RU')}</p>
              </div>
              
              <div className="mb-6">
                <p><strong>Исполнитель:</strong> {profile?.companyName || 'Не указан'}</p>
                <p><strong>Заказчик:</strong> {selectedClient?.name || 'Не выбран'}</p>
              </div>

              {document.content?.items && document.content.items.length > 0 && (
                <table className="w-full mb-6 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">№</th>
                      <th className="border border-gray-300 p-2 text-left">Наименование</th>
                      <th className="border border-gray-300 p-2 text-center">Ед.</th>
                      <th className="border border-gray-300 p-2 text-center">Кол-во</th>
                      <th className="border border-gray-300 p-2 text-right">Цена</th>
                      <th className="border border-gray-300 p-2 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.content.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border border-gray-300 p-2">{i + 1}</td>
                        <td className="border border-gray-300 p-2">{item.name || '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.unit}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-right">{item.price.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-right">{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="text-right text-xl font-bold mb-6">
                Итого: {document.content?.totalAmount?.toFixed(2) || '0.00'} ₽
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-bold mb-8">Исполнитель:</p>
                  <p className="text-sm text-gray-600">{profile?.companyName}</p>
                  {profile?.stampUrl && (
                    <img src={profile.stampUrl} alt="Печать" className="mt-4 h-20" />
                  )}
                </div>
                <div>
                  <p className="font-bold mb-8">Заказчик:</p>
                  <p className="text-sm text-gray-600">_________________</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Закрыть
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Скачать PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
