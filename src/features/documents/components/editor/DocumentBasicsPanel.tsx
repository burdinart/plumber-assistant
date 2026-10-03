import { User, Building } from 'lucide-react';
import type { Document, DocumentType } from '../../types';
import type { ContractorFields } from '../../utils/autoFillProfile';

const INPUT_CLS =
  'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
const LABEL_CLS = 'block text-sm font-medium text-gray-300 mb-2';
const CARD_CLS = 'bg-gray-800 rounded-xl p-4';

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'act', label: 'Акт выполненных работ' },
  { value: 'contract', label: 'Договор на оказание услуг' },
  { value: 'warranty', label: 'Гарантийный талон' },
  { value: 'handover', label: 'Акт приёмки-передачи' },
  { value: 'estimate', label: 'Смета' },
];

interface DocumentBasicsPanelProps {
  document: Partial<Document>;
  isEditMode: boolean;
  clients: { id: string; name: string; phone?: string; address?: string }[];
  selectedClient: any;
  hasContractor: boolean;
  /** Значения исполнителя по умолчанию из профиля (ФИО / телефон / адрес). */
  contractorDefaults: ContractorFields;
  onTypeChange: (type: DocumentType) => void;
  onFieldChange: (field: string, value: any) => void;
  onClientSelect: (clientId: string) => void;
  onContractorChange: (field: 'fullName' | 'phone' | 'address', value: string) => void;
  onNavigateToProfile: () => void;
}

/** Левая колонка редактора: тип документа, реквизиты, заказчик и исполнитель. */
export const DocumentBasicsPanel = ({
  document,
  isEditMode,
  clients,
  selectedClient,
  hasContractor,
  contractorDefaults,
  onTypeChange,
  onFieldChange,
  onClientSelect,
  onContractorChange,
  onNavigateToProfile,
}: DocumentBasicsPanelProps) => {
  // Отображаемые значения исполнителя: ручные правки документа, иначе — из профиля.
  const contractor = document.content?.contractor;
  const contractorValue = (field: 'fullName' | 'phone' | 'address') =>
    contractor?.[field] ?? contractorDefaults[field] ?? '';

  return (
    <div className="space-y-4">
      {/* Тип документа */}
      <div className={CARD_CLS}>
        <h3 className="text-lg font-semibold text-white mb-3">Тип документа</h3>
        <select
          value={document.type}
          onChange={(e) => onTypeChange(e.target.value as DocumentType)}
          className={INPUT_CLS}
          disabled={isEditMode}
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Номер и дата */}
      <div className={`${CARD_CLS} space-y-4`}>
        <h3 className="text-lg font-semibold text-white">Реквизиты</h3>
        <div>
          <label className={LABEL_CLS}>Номер *</label>
          <input
            type="text"
            value={document.number}
            onChange={(e) => onFieldChange('number', e.target.value)}
            className={INPUT_CLS}
            placeholder="№ 1 от 01.01.2026"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Дата</label>
          <input
            type="date"
            value={document.date?.split('T')[0]}
            onChange={(e) => onFieldChange('date', e.target.value)}
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Заказчик */}
      <div className={CARD_CLS}>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <User className="w-5 h-5" />
          Заказчик
        </h3>
        <select
          value={document.clientId || ''}
          onChange={(e) => onClientSelect(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="">Выберите клиента</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {selectedClient && (
          <div className="mt-3 p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
            <p>
              <strong>Телефон:</strong> {selectedClient.phone}
            </p>
            <p>
              <strong>Адрес:</strong> {selectedClient.address}
            </p>
          </div>
        )}
      </div>

      {/* Исполнитель (автозаполнение из профиля, можно править вручную) */}
      <div className={CARD_CLS}>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Исполнитель
        </h3>
        {!hasContractor && (
          <div className="mb-3 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg text-sm text-yellow-300">
            <p>💡 Заполните данные в Настройки → Профиль, чтобы они подставлялись в документы автоматически</p>
            <button onClick={onNavigateToProfile} className="mt-2 text-blue-400 hover:text-blue-300 underline">
              Перейти в профиль
            </button>
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ФИО исполнителя</label>
            <input
              type="text"
              value={contractorValue('fullName')}
              onChange={(e) => onContractorChange('fullName', e.target.value)}
              className={INPUT_CLS}
              placeholder="Иванов Иван Иванович"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Номер телефона</label>
            <input
              type="tel"
              value={contractorValue('phone')}
              onChange={(e) => onContractorChange('phone', e.target.value)}
              className={INPUT_CLS}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Адрес</label>
            <input
              type="text"
              value={contractorValue('address')}
              onChange={(e) => onContractorChange('address', e.target.value)}
              className={INPUT_CLS}
              placeholder="г. Москва, ул. Примерная, д. 1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
