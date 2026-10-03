import { X, Download } from 'lucide-react';
import type { Document } from '../../types';
import type { UserProfile } from '../../../profile/types';

interface DocumentPreviewModalProps {
  document: Partial<Document>;
  profile: UserProfile;
  selectedClient: any;
  onClose: () => void;
  onExportPDF: () => void;
}

/** Модальное окно предпросмотра документа (упрощённая печатная версия). */
export const DocumentPreviewModal = ({
  document,
  profile,
  selectedClient,
  onClose,
  onExportPDF,
}: DocumentPreviewModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] landscape:max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Предпросмотр документа</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
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
            <p>
              <strong>Исполнитель:</strong> {profile?.companyName || 'Не указан'}
            </p>
            <p>
              <strong>Заказчик:</strong> {selectedClient?.name || 'Не выбран'}
            </p>
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
                  <tr key={item.id || i}>
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
              {profile?.stampUrl && <img src={profile.stampUrl} alt="Печать" className="mt-4 h-20" />}
            </div>
            <div>
              <p className="font-bold mb-8">Заказчик:</p>
              <p className="text-sm text-gray-600">_________________</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
            Закрыть
          </button>
          <button
            onClick={onExportPDF}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Скачать PDF
          </button>
        </div>
      </div>
    </div>
  );
};
