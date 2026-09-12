import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Save, X, User, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { PhoneInput } from '../../../shared/ui/PhoneInput';
import { Toast } from '../../../shared/ui/Toast';
import { validatePhone, validateEmail } from '../../../shared/utils/helpers';
import { ClientType } from '../../../shared/types';

export function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, addClient, updateClient } = useClients();

  const isEditing = Boolean(id);
  const existingClient = id ? getClient(id) : undefined;

  const [clientType, setClientType] = useState<ClientType>('individual');
  const [showPassport, setShowPassport] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    notes: '',
    // Юридические лица
    inn: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    bankName: '',
    bik: '',
    account: '',
    correspondentAccount: '',
    // Физические лица
    passportSeries: '',
    passportNumber: '',
    passportIssuedBy: '',
    passportDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isEditing && existingClient) {
      setClientType(existingClient.type);
      setFormData({
        name: existingClient.name,
        phone: existingClient.phone,
        address: existingClient.address,
        email: existingClient.email || '',
        notes: existingClient.notes || '',
        inn: existingClient.inn || '',
        kpp: existingClient.kpp || '',
        ogrn: existingClient.ogrn || '',
        legalAddress: existingClient.legalAddress || '',
        bankName: existingClient.bankName || '',
        bik: existingClient.bik || '',
        account: existingClient.account || '',
        correspondentAccount: existingClient.correspondentAccount || '',
        passportSeries: existingClient.passportSeries || '',
        passportNumber: existingClient.passportNumber || '',
        passportIssuedBy: existingClient.passportIssuedBy || '',
        passportDate: existingClient.passportDate || '',
      });
      // Показываем секции если есть данные
      if (existingClient.inn || existingClient.kpp) {
        setShowBankDetails(true);
      }
      if (existingClient.passportSeries || existingClient.passportNumber) {
        setShowPassport(true);
      }
    }
  }, [isEditing, existingClient]);

  const validateINN = (inn: string): boolean => {
    if (!inn) return true; // опционально для некоторых случаев
    const digits = inn.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 12;
  };

  const validateKPP = (kpp: string): boolean => {
    if (!kpp) return true;
    const digits = kpp.replace(/\D/g, '');
    return digits.length === 9;
  };

  const validateBIK = (bik: string): boolean => {
    if (!bik) return true;
    const digits = bik.replace(/\D/g, '');
    return digits.length === 9;
  };

  const validateAccount = (account: string): boolean => {
    if (!account) return true;
    const digits = account.replace(/\D/g, '');
    return digits.length === 20;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (clientType === 'individual') {
      if (!formData.name.trim() || formData.name.trim().length < 3) {
        newErrors.name = 'ФИО должно содержать минимум 3 символа';
      }
    } else {
      if (!formData.name.trim() || formData.name.trim().length < 3) {
        newErrors.name = 'Название организации должно содержать минимум 3 символа';
      }
      if (!formData.inn) {
        newErrors.inn = 'ИНН обязателен';
      } else if (!validateINN(formData.inn)) {
        newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
      }
      if (formData.kpp && !validateKPP(formData.kpp)) {
        newErrors.kpp = 'КПП должен содержать 9 цифр';
      }
    }

    if (!formData.phone) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (!formData.address.trim()) {
      newErrors.address = clientType === 'individual' ? 'Адрес обязателен' : 'Юридический адрес обязателен';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    // Валидация банковских реквизитов
    if (formData.bik && !validateBIK(formData.bik)) {
      newErrors.bik = 'БИК должен содержать 9 цифр';
    }
    if (formData.account && !validateAccount(formData.account)) {
      newErrors.account = 'Расчётный счёт должен содержать 20 цифр';
    }
    if (formData.correspondentAccount && !validateAccount(formData.correspondentAccount)) {
      newErrors.correspondentAccount = 'Корреспондентский счёт должен содержать 20 цифр';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: 'Исправьте ошибки в форме', type: 'error' });
      return;
    }

    try {
      const clientData = {
        type: clientType,
        ...formData,
      };

      if (isEditing && id) {
        updateClient(id, clientData);
        setToast({ message: 'Клиент обновлён', type: 'success' });
      } else {
        addClient(clientData);
        setToast({ message: 'Клиент добавлен', type: 'success' });
      }

      setTimeout(() => navigate('/clients'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Редактирование клиента' : 'Новый клиент'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Измените данные клиента' : 'Заполните данные нового клиента'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Client Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип клиента <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClientType('individual')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  clientType === 'individual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <User className="w-5 h-5" />
                Физическое лицо
              </button>
              <button
                type="button"
                onClick={() => setClientType('legal')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  clientType === 'legal'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
                Юридическое лицо
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {clientType === 'individual' ? 'ФИО' : 'Название организации'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={clientType === 'individual' ? 'Иванов Иван Иванович' : 'ООО "Название"'}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <PhoneInput
            label="Телефон"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            error={errors.phone}
            required
          />

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {clientType === 'individual' ? 'Адрес' : 'Юридический адрес'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={clientType === 'individual' ? 'г. Москва, ул. Ленина, д. 1, кв. 10' : 'г. Москва, ул. Примерная, д. 1, оф. 100'}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                errors.address ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.address && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.ru"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.email && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Legal Entity Fields */}
          {clientType === 'legal' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ИНН <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inn}
                    onChange={(e) => handleChange('inn', e.target.value)}
                    placeholder="7712345678"
                    maxLength={12}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                      errors.inn ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.inn && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.inn}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    КПП
                  </label>
                  <input
                    type="text"
                    value={formData.kpp}
                    onChange={(e) => handleChange('kpp', e.target.value)}
                    placeholder="771201001"
                    maxLength={9}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                      errors.kpp ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.kpp && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.kpp}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ОГРН
                </label>
                <input
                  type="text"
                  value={formData.ogrn}
                  onChange={(e) => handleChange('ogrn', e.target.value)}
                  placeholder="1167746123456"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Bank Details Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Банковские реквизиты (опционально)
                  </span>
                  {showBankDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showBankDetails && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название банка
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="ПАО Сбербанк"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        БИК
                      </label>
                      <input
                        type="text"
                        value={formData.bik}
                        onChange={(e) => handleChange('bik', e.target.value)}
                        placeholder="044525225"
                        maxLength={9}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                          errors.bik ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.bik && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.bik}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Расчётный счёт
                      </label>
                      <input
                        type="text"
                        value={formData.account}
                        onChange={(e) => handleChange('account', e.target.value)}
                        placeholder="40702810123456789012"
                        maxLength={20}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                          errors.account ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.account && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.account}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Корреспондентский счёт
                      </label>
                      <input
                        type="text"
                        value={formData.correspondentAccount}
                        onChange={(e) => handleChange('correspondentAccount', e.target.value)}
                        placeholder="30101810400000000225"
                        maxLength={20}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                          errors.correspondentAccount ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.correspondentAccount && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.correspondentAccount}</p>}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Individual Passport Section */}
          {clientType === 'individual' && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={() => setShowPassport(!showPassport)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Паспортные данные (опционально)
                </span>
                {showPassport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPassport && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Серия
                      </label>
                      <input
                        type="text"
                        value={formData.passportSeries}
                        onChange={(e) => handleChange('passportSeries', e.target.value)}
                        placeholder="4510"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Номер
                      </label>
                      <input
                        type="text"
                        value={formData.passportNumber}
                        onChange={(e) => handleChange('passportNumber', e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Кем выдан
                    </label>
                    <input
                      type="text"
                      value={formData.passportIssuedBy}
                      onChange={(e) => handleChange('passportIssuedBy', e.target.value)}
                      placeholder="ОВД района Тверской г. Москвы"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Дата выдачи
                    </label>
                    <input
                      type="date"
                      value={formData.passportDate}
                      onChange={(e) => handleChange('passportDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Заметки
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Особенности, пожелания, важные заметки..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Сохранить' : 'Добавить'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
