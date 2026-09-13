import { useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { generateContractHtml } from '../templates/contractTemplate';

export function ContractPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getContract } = useDocuments();
  const { getClient } = useClients();

  const contract = id ? getContract(id) : undefined;
  const client = contract ? getClient(contract.clientId) : undefined;
  const shouldPrint = searchParams.get('print') === 'true';

  useEffect(() => {
    if (shouldPrint && contract && client) {
      const html = generateContractHtml(contract, client.name, client.address, client.phone);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      navigate(`/documents/contracts/${id}`, { replace: true });
    }
  }, [shouldPrint, contract, client, id, navigate]);

  const handlePrint = () => {
    if (contract && client) {
      const html = generateContractHtml(contract, client.name, client.address, client.phone);
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

  if (!contract || !client) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Договор не найден</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

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
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Printer className="w-4 h-4" />
            Печать
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            ДОГОВОР ПОДРЯДА
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            на выполнение сантехнических работ
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">№ {contract.number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            г. Москва &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {new Date(contract.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Исполнитель:</p>
          <p className="text-gray-800 dark:text-white">Помощник Сантехника, ИНН 7712345678</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">Заказчик:</p>
          <p className="text-gray-800 dark:text-white">{client.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Тел: {client.phone}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Адрес: {client.address}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            1. ПРЕДМЕТ ДОГОВОРА
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            1.1. Исполнитель обязуется выполнить по заданию Заказчика сантехнические работы, а Заказчик обязуется принять и оплатить выполненную работу.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            1.2. Перечень работ, их объём и стоимость определяются в смете, которая является неотъемлемой частью настоящего договора.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            2. СРОКИ ВЫПОЛНЕНИЯ РАБОТ
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            2.1. Начало работ: {new Date(contract.startDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            2.2. Окончание работ: {new Date(contract.endDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            2.3. Сроки могут быть изменены по соглашению сторон в случае возникновения непредвиденных обстоятельств.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            3. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЁТОВ
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            3.1. Общая стоимость работ составляет: <strong className="text-gray-800 dark:text-white">{contract.cost.toLocaleString('ru-RU')} ₽</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            3.2. Порядок оплаты: {contract.paymentTerms}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            3.3. Оплата производится в рублях Российской Федерации.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            4. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            4.1. {contract.warrantyTerms}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            4.2. Гарантия не распространяется на defects, возникшие по вине Заказчика или в результате неправильной эксплуатации.
          </p>
        </div>

        {contract.additionalTerms && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              5. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contract.additionalTerms}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ИСПОЛНИТЕЛЬ:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Помощник Сантехника</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ИНН: 7712345678</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Тел: +7 (999) 123-45-67</p>
            <div className="border-b border-gray-400 dark:border-gray-500 mt-8 mb-1"></div>
            <p className="text-xs text-gray-500 dark:text-gray-500">(подпись)</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ЗАКАЗЧИК:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{client.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Адрес: {client.address}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Тел: {client.phone}</p>
            <div className="border-b border-gray-400 dark:border-gray-500 mt-8 mb-1"></div>
            <p className="text-xs text-gray-500 dark:text-gray-500">(подпись)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
