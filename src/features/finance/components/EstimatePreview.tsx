import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useEstimates } from '../hooks/useEstimates';
import { useClients } from '../../clients/hooks/useClients';
import { useProfile } from '../../profile/hooks/useProfile';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateEstimateHtml } from '../../documents/templates/estimateTemplate';
import { ContractorBlock, ProfileWarningBanner, shouldShowProfileWarning } from '../../documents/components/ContractorBlock';
import type { Estimate } from '../types';
import type { UserProfile } from '../../profile/types';

/** Открытие отдельного окна печати (тот же механизм, что в ActPreview/ContractPreview) */
function openPrintWindow(estimate: Estimate, clientName: string, profile: UserProfile | null) {
  const html = generateEstimateHtml(estimate, clientName, profile);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export function EstimatePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getEstimate } = useEstimates();
  const { getClient } = useClients();
  const { profile } = useProfile();

  const estimate = id ? getEstimate(id) : undefined;
  const client = estimate ? getClient(estimate.clientId) : undefined;
  const shouldPrint = searchParams.get('print') === 'true';

  // Печать через самодостаточный A4-документ (как в Акте/Договоре),
  // а не window.print() интерфейса — иначе на телефоне печатается обрезанная таблица.
  useEffect(() => {
    if (shouldPrint && estimate) {
      openPrintWindow(estimate, client?.name || 'Не указан', profile);
      navigate(`/finance/estimates/${id}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPrint]);

  if (!estimate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Смета не найдена</p>
          <button
            onClick={() => navigate('/finance/estimates')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    openPrintWindow(estimate, client?.name || 'Не указан', profile);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Кнопки управления (скрываются при печати) */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/finance/estimates')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Printer className="w-4 h-4" />
            Печать
          </button>
        </div>
      </div>

      {/* Содержимое сметы (область печати — см. @media print в index.css) */}
      <div className="print-area bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-8 landscape:p-4 print:border-0 print:rounded-none print:shadow-none">
        {/* Шапка */}
        <div className="mb-8 pb-6 border-b-2 border-gray-300 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                СМЕТА {estimate.number}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                от {formatDate(estimate.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Срок действия</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                до {formatDate(estimate.validUntil)}
              </div>
            </div>
          </div>

          {/* Информация о клиенте */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 landscape:grid-cols-2">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Клиент</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {client?.name || 'Не указан'}
              </div>
              {client?.phone && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {client.phone}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Адрес объекта</div>
              <div className="text-base text-gray-800 dark:text-white">
                {estimate.address}
              </div>
            </div>
          </div>
        </div>

        {/* Таблица позиций */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Перечень работ и материалов
          </h2>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-sm print:text-xs border-collapse table-fixed">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold w-8">№</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold">Наименование</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold w-12">Ед.</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold w-16">Кол-во</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold w-24">Цена</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-300 font-semibold w-28">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {estimate.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 break-inside-avoid">
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{index + 1}</td>
                    <td className="py-3 px-2 text-gray-800 dark:text-white break-words">
                      {item.name}
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({item.type === 'work' ? 'работа' : 'материал'})
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{item.unit || 'шт'}</td>
                    <td className="py-3 px-2 text-center text-gray-800 dark:text-white">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-800 dark:text-white whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-gray-800 dark:text-white whitespace-nowrap">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Итоги */}
        <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-6">
          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-600 dark:text-gray-300">Работы:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(estimate.totalWork)}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-600 dark:text-gray-300">Материалы:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(estimate.totalMaterials)}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">Подытог:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(estimate.totalWork + estimate.totalMaterials)}
              </span>
            </div>
            {estimate.discount > 0 && (
              <div className="flex justify-between text-base">
                <span className="text-gray-600 dark:text-gray-300">
                  Скидка ({estimate.discountType === 'percent' ? `${estimate.discount}%` : 'фикс.'}):
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(
                    estimate.discountType === 'percent'
                      ? ((estimate.totalWork + estimate.totalMaterials) * estimate.discount) / 100
                      : estimate.discount
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xl pt-3 border-t-2 border-gray-300 dark:border-gray-600">
              <span className="font-bold text-gray-800 dark:text-white">ИТОГО К ОПЛАТЕ:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(estimate.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Примечания */}
        {estimate.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Примечания
            </h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {estimate.notes}
            </p>
          </div>
        )}

        {/* Подписи */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          {shouldShowProfileWarning(profile) && <ProfileWarningBanner />}
          <div className="mb-6">
            <ContractorBlock profile={profile} />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">Исполнитель</div>
              <div className="border-b border-gray-400 dark:border-gray-500 pb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">подпись / ФИО</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">Заказчик</div>
              <div className="border-b border-gray-400 dark:border-gray-500 pb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">подпись / ФИО</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
