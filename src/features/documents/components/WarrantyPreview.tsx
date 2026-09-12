import { useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { generateWarrantyHtml } from '../templates/warrantyTemplate';

export function WarrantyPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getWarranty } = useDocuments();
  const { getClient } = useClients();

  const warranty = id ? getWarranty(id) : undefined;
  const client = warranty ? getClient(warranty.clientId) : undefined;
  const shouldPrint = searchParams.get('print') === 'true';

  useEffect(() => {
    if (shouldPrint && warranty && client) {
      const html = generateWarrantyHtml(warranty, client.name, client.address, client.phone);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      navigate(`/documents/warranties/${id}`, { replace: true });
    }
  }, [shouldPrint, warranty, client, id, navigate]);

  const handlePrint = () => {
    if (warranty && client) {
      const html = generateWarrantyHtml(warranty, client.name, client.address, client.phone);
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
  };

  if (!warranty || !client) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Гарантийный талон не найден</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const getMonthWord = (months: number): string => {
    const lastDigit = months % 10;
    const lastTwoDigits = months % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'месяцев';
    }

    if (lastDigit === 1) {
      return 'месяц';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'месяца';
    }

    return 'месяцев';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <Link
            to="/documents"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к документам
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="w-4 h-4" />
            Печать
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-6 border-b-4 border-double border-gray-300 dark:border-gray-600 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 uppercase">
            Гарантийный талон
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">№ {warranty.number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            от {new Date(warranty.issueDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
            Информация о заказчике
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">ФИО / Наименование:</p>
              <p className="text-gray-800 dark:text-white font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Адрес:</p>
              <p className="text-gray-800 dark:text-white font-medium">{client.address}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Телефон:</p>
              <p className="text-gray-800 dark:text-white font-medium">{client.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
            Описание выполненных работ
          </h2>
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[80px]">
            <p className="text-gray-800 dark:text-white">{warranty.workDescription}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
            Гарантийный период
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Дата начала гарантии:</p>
              <p className="text-gray-800 dark:text-white font-medium">
                {new Date(warranty.issueDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Срок гарантии:</p>
              <p className="text-gray-800 dark:text-white font-medium">
                {warranty.warrantyMonths} {getMonthWord(warranty.warrantyMonths)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Дата окончания гарантии:</p>
              <p className="text-gray-800 dark:text-white font-bold">
                {new Date(warranty.expiryDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-bold text-gray-800 dark:text-white mb-2">
            УСЛОВИЯ ГАРАНТИИ:
          </p>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>1. Гарантия распространяется на выполненные работы и установленные материалы.</p>
            <p>2. Гарантия не распространяется на defects, возникшие в результате:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>неправильной эксплуатации оборудования;</li>
              <li>механических повреждений;</li>
              <li>вмешательства третьих лиц;</li>
              <li>форс-мажорных обстоятельств.</li>
            </ul>
            <p>3. Для получения гарантийного обслуживания необходимо предъявить данный талон.</p>
            <p>4. Гарантийное обслуживание осуществляется бесплатно в течение всего гарантийного срока.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Исполнитель:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Помощник Сантехника</p>
            <div className="border-b border-gray-400 dark:border-gray-500 mt-8 mb-1"></div>
            <p className="text-xs text-gray-500 dark:text-gray-500">М.П. / Подпись</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Заказчик:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{client.name}</p>
            <div className="border-b border-gray-400 dark:border-gray-500 mt-8 mb-1"></div>
            <p className="text-xs text-gray-500 dark:text-gray-500">Подпись</p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>Документ действителен без печати при наличии подписи исполнителя</p>
          <p className="mt-1">Дата выдачи: {new Date(warranty.createdAt).toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </div>
  );
}
