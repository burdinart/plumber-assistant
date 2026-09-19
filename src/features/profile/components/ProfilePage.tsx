import { useState, useRef } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UserProfile } from '../types';
import { User, Building, FileText, Upload, Save, Download, Trash2, AlertCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { profile, updateProfile, resetProfile, exportProfile, importProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Обработка загрузки изображений
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'stampUrl' | 'signatureUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: result }));
    };
    reader.readAsDataURL(file);
  };

  // Сохранение профиля
  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  // Экспорт профиля
  const handleExport = () => {
    const json = exportProfile();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Импорт профиля
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importProfile(json);
      if (success) {
        setFormData(profile);
        setImportError('');
        alert('Профиль успешно импортирован');
      } else {
        setImportError('Ошибка импорта: проверьте формат файла');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <User className="w-8 h-8 text-blue-400" />
          Профиль пользователя
        </h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Экспорт
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Импорт
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
              <button
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
            </>
          )}
        </div>
      </div>

      {importError && (
        <div className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{importError}</span>
        </div>
      )}

      {/* Секция 1: Личные данные */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Личные данные
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ФИО полностью *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Иванов Иван Иванович"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Должность
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Индивидуальный предприниматель"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="+7 (999) 000-00-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="email@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Адрес регистрации
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              rows={2}
              placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
            />
          </div>
        </div>
      </div>

      {/* Секция 2: Реквизиты */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          Реквизиты (для ИП/ООО)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название организации/ИП *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="ИП Иванов И.И."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ИНН
            </label>
            <input
              type="text"
              value={formData.inn}
              onChange={(e) => setFormData(prev => ({ ...prev, inn: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="123456789012"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ОГРН/ОГРНИП
            </label>
            <input
              type="text"
              value={formData.ogrn}
              onChange={(e) => setFormData(prev => ({ ...prev, ogrn: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="1234567890123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              КПП (если ООО)
            </label>
            <input
              type="text"
              value={formData.kpp}
              onChange={(e) => setFormData(prev => ({ ...prev, kpp: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="123456789"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Юридический адрес
            </label>
            <textarea
              value={formData.legalAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, legalAddress: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              rows={2}
              placeholder="г. Москва, ул. Юридическая, д. 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Расчётный счёт
            </label>
            <input
              type="text"
              value={formData.bankAccount}
              onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="40802810000000000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Банк
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="ПАО Сбербанк"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              БИК
            </label>
            <input
              type="text"
              value={formData.bik}
              onChange={(e) => setFormData(prev => ({ ...prev, bik: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="044525225"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Корр. счёт
            </label>
            <input
              type="text"
              value={formData.corrAccount}
              onChange={(e) => setFormData(prev => ({ ...prev, corrAccount: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="30101810400000000225"
            />
          </div>
        </div>
      </div>

      {/* Секция 3: Печать и подпись */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Печать и подпись для документов
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Печать */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Изображение печати
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              {formData.stampUrl ? (
                <div className="space-y-3">
                  <img
                    src={formData.stampUrl}
                    alt="Печать"
                    className="h-24 mx-auto object-contain"
                  />
                  {isEditing && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, stampUrl: undefined }))}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Изображение не загружено</p>
              )}
              {isEditing && (
                <button
                  onClick={() => stampInputRef.current?.click()}
                  className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Загрузить
                </button>
              )}
              <input
                ref={stampInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'stampUrl')}
                className="hidden"
              />
            </div>
          </div>

          {/* Подпись */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Изображение подписи
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              {formData.signatureUrl ? (
                <div className="space-y-3">
                  <img
                    src={formData.signatureUrl}
                    alt="Подпись"
                    className="h-24 mx-auto object-contain"
                  />
                  {isEditing && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, signatureUrl: undefined }))}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mx-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Изображение не загружено</p>
              )}
              {isEditing && (
                <button
                  onClick={() => signatureInputRef.current?.click()}
                  className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Загрузить
                </button>
              )}
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'signatureUrl')}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Секция 4: Шаблоны документов */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Шаблоны документов
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Шаблон номера договора
          </label>
          <input
            type="text"
            value={formData.contractNumberTemplate}
            onChange={(e) => setFormData(prev => ({ ...prev, contractNumberTemplate: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="№ {number} от {date}"
          />
          <p className="text-gray-400 text-sm mt-2">
            Доступные переменные: {'{number}'} — номер документа, {'{date}'} — дата
          </p>
        </div>
      </div>

      {/* Информация о последнем обновлении */}
      <div className="text-center text-gray-400 text-sm">
        Последнее обновление: {new Date(profile.updatedAt).toLocaleString('ru-RU')}
      </div>
    </div>
  );
};
