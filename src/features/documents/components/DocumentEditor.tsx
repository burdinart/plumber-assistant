import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createEmptyProfile } from '../../profile/types';
import { useProfile } from '../../profile/hooks/useProfile';
import { useAppStore } from '../../../shared/store/useAppStore';
import { hydrateClientsFromStorage } from '../../clients/hooks/useClients';
import { Document, DocumentType, DocumentContent, DocumentItem, ChangeHistoryEntry } from '../types';
import { getChangedFields } from '../utils/diffUtils';
import { generateDocumentPDF } from '../utils/pdfGenerator';
import { buildContractorAutoFill, hasContractorData, getContractorFields } from '../utils/autoFillProfile';
import { generateDocumentNumber } from '../model/documentNumber';
import { useDocumentItems } from '../hooks/useDocumentItems';
import { useScreenOrientation } from '../../../shared/hooks/useScreenOrientation';
import { DocumentToolbar } from './editor/DocumentToolbar';
import { DocumentBasicsPanel } from './editor/DocumentBasicsPanel';
import { DocumentContentPanel } from './editor/DocumentContentPanel';
import { DocumentPreviewModal } from './editor/DocumentPreviewModal';

/**
 * Редактор документов.
 *
 * Рефакторинг (decomposition): компонент разбит на части:
 * - model/documentNumber.ts  — генерация номера по шаблону профиля;
 * - model/documentItems.ts   — чистые функции пересчёта позиций и итогов;
 * - hooks/useDocumentItems.ts — логика позиций (add/update/remove);
 * - editor/DocumentToolbar.tsx      — шапка с действиями;
 * - editor/DocumentBasicsPanel.tsx  — левая колонка (тип, реквизиты, заказчик, исполнитель);
 * - editor/DocumentContentPanel.tsx — правая колонка (содержание, позиции, доп. условия);
 * - editor/DocumentPreviewModal.tsx — модальное окно предпросмотра.
 */
export const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { documents, addDocument, updateDocument, clients } = useAppStore();

  // Управление ориентацией экрана: в альбомном режиме редактор документов
  // становится двухколоночным (форма + таблица работ), место под таблицу важнее отступов.
  const { isLandscape, lockSupported, lockOrientation, unlockOrientation } = useScreenOrientation();

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
    },
  });

  const [showPreview, setShowPreview] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const isEditMode = !!id && id !== 'new';

  // Гидрация CRM-клиентов из localStorage в стор при прямом заходе на редактор
  useEffect(() => {
    hydrateClientsFromStorage();
  }, []);

  // Загрузка существующего документа
  useEffect(() => {
    if (isEditMode) {
      const existing = documents.find((d) => d.id === id);
      if (existing) {
        setDocument(existing);
        if (existing.clientId) {
          const client = clients.find((c) => c.id === existing.clientId);
          setSelectedClient(client || null);
        }
      } else {
        alert('Документ не найден');
        navigate('/documents');
      }
    }
  }, [id, isEditMode, documents, clients, navigate]);

  // Автозаполнение нового документа данными из профиля (ФИО / телефон / адрес исполнителя).
  // Ручные правки уже открытого документа не перезаписываются (см. buildContractorAutoFill).
  useEffect(() => {
    if (!isEditMode && hasContractorData(profile)) {
      setDocument((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          ...buildContractorAutoFill(profile, prev.content),
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, id]);

  // Генерация номера по шаблону профиля для новых документов
  useEffect(() => {
    if (!isEditMode) {
      setDocument((prev) => ({
        ...prev,
        number: generateDocumentNumber(profile?.contractNumberTemplate, documents, prev.type as DocumentType),
        date: new Date().toISOString().split('T')[0],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.type, isEditMode]);

  const markChanged = () => setHasChanges(true);

  const handleTypeChange = (type: DocumentType) => {
    setDocument((prev) => ({ ...prev, type }));
    markChanged();
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    setDocument((prev) => ({
      ...prev,
      clientId,
      ...(client ? { content: { ...prev.content, customer: client } } : {}),
    }));
    markChanged();
  };

  // Отслеживание изменений в полях документа
  const handleChange = (field: string, value: any) => {
    setDocument((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
    markChanged();
  };

  const handleContentChange = (field: string, value: any) => {
    setDocument((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
    markChanged();
  };

  // Ручное редактирование полей исполнителя внутри документа
  // (значения по умолчанию приходят из профиля, но могут быть переопределены)
  const handleContractorChange = (field: 'fullName' | 'phone' | 'address', value: string) => {
    setDocument((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        contractor: {
          ...createEmptyProfile(),
          ...(prev.content?.contractor || {}),
          [field]: value,
        },
      },
    }));
    markChanged();
  };

  // Позиции работ/материалов — логика вынесена в useDocumentItems
  const { addItem, updateItem, removeItem } = useDocumentItems(
    () => document.content?.items || [],
    (items: DocumentItem[], totalAmount: number) =>
      setDocument((prev) => ({ ...prev, content: { ...prev.content, items, totalAmount } })),
    markChanged,
  );

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

    if (isEditMode) {
      // Режим редактирования — обновляем существующий документ
      const oldDoc = documents.find((d) => d.id === id);
      updateDocument(docToSave);

      // История изменений: фиксируем diff старого и нового состояний
      if (oldDoc) {
        const changes = getChangedFields(docToSave, oldDoc);
        if (Object.keys(changes).length > 0) {
          const historyEntry: ChangeHistoryEntry = {
            action: 'updated',
            timestamp: new Date().toISOString(),
            changes,
          };
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
      title: document.title || '',
      number: document.number || '',
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

  return (
    <div className="p-4 landscape:p-2 max-w-6xl mx-auto">
      <DocumentToolbar
        isEditMode={isEditMode}
        lockSupported={lockSupported}
        isLandscape={isLandscape}
        onLockOrientation={() => lockOrientation('landscape')}
        onUnlockOrientation={unlockOrientation}
        onShowPreview={() => setShowPreview(true)}
        onExportPDF={handleExportPDF}
        onSave={handleSave}
      />

      {/* Основная форма: в альбомном режиме (landscape) или на широких экранах — 2 колонки */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 lg:grid-cols-2 gap-6">
        <DocumentBasicsPanel
          document={document}
          isEditMode={isEditMode}
          clients={clients}
          selectedClient={selectedClient}
          hasContractor={hasContractorData(profile)}
          contractorDefaults={getContractorFields(profile)}
          onTypeChange={handleTypeChange}
          onFieldChange={handleChange}
          onClientSelect={handleClientSelect}
          onContractorChange={handleContractorChange}
          onNavigateToProfile={() => navigate('/settings/profile')}
        />

        <DocumentContentPanel
          title={document.title || ''}
          content={document.content}
          onFieldChange={handleChange}
          onContentChange={handleContentChange}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      </div>

      {showPreview && (
        <DocumentPreviewModal
          document={document}
          profile={profile}
          selectedClient={selectedClient}
          onClose={() => setShowPreview(false)}
          onExportPDF={handleExportPDF}
        />
      )}
    </div>
  );
};
