import { useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { generateActHtml } from '../templates/actTemplate';

export function ActPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getAct } = useDocuments();
  const { getClient } = useClients();

  const act = id ? getAct(id) : undefined;
  const client = act ? getClient(act.clientId) : undefined;
  const shouldPrint = searchParams.get('print') === 'true';

  useEffect(() => {
    if (shouldPrint && act && client) {
      const html = generateActHtml(act, client.name, client.address);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      // Убираем параметр print из URL
      navigate(`/documents/acts/${id}`, { replace: true });
    }
  }, [shouldPrint, act, client, id, navigate]);

  const handlePrint = () => {
    if (act && client) {
      const html = generateActHtml(act, client.name, client.address);
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

  if (!act || !client) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Акт не найден</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            АКТ ВЫПОЛНЕННЫХ РАБОТ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">№ {act.number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            от {new Date(act.completionDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Исполнитель:</p>
          <p className="text-gray-800 dark:text-white">Помощник Сантехника</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Заказчик:</p>
          <p className="text-gray-800 dark:text-white">{client.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{client.address}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Настоящий акт составлен о том, что следующие работы выполнены, а материалы использованы:
          </p>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">№</th>
                <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">Наименование</th>
                <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Ед.</th>
                <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Кол-во</th>
                <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400">Цена</th>
                <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {act.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-2 text-gray-800 dark:text-white">{index + 1}</td>
                  <td className="py-2 px-2 text-gray-800 dark:text-white">{item.name}</td>
                  <td className="py-2 px-2 text-center text-gray-800 dark:text-white">{item.unit}</td>
                  <td className="py-2 px-2 text-center text-gray-800 dark:text-white">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-gray-800 dark:text-white">
                    {item.price.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="py-2 px-2 text-right text-gray-800 dark:text-white">
                    {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                <td colSpan={5} className="py-2 px-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Итого работы:
                </td>
                <td className="py-2 px-2 text-right font-semibold text-gray-800 dark:text-white">
                  {act.totalWork.toLocaleString('ru-RU')} ₽
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="py-2 px-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Итого материалы:
                </td>
                <td className="py-2 px-2 text-right font-semibold text-gray-800 dark:text-white">
                  {act.totalMaterials.toLocaleString('ru-RU')} ₽
                </td>
              </tr>
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td colSpan={5} className="py-2 px-2 text-right font-bold text-gray-800 dark:text-white">
                  ВСЕГО К ОПЛАТЕ:
                </td>
                <td className="py-2 px-2 text-right font-bold text-blue-600 dark:text-blue-400">
                  {act.total.toLocaleString('ru-RU')} ₽
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {act.complaints && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Претензии и замечания:
            </p>
            <p className="text-sm text-gray-800 dark:text-white">{act.complaints}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Заказчик претензий по объёму, качеству и срокам выполнения работ не имеет.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Исполнитель:</p>
            <div className="border-b border-gray-400 dark:border-gray-500 pb-2 mb-1">
              <p className="text-gray-800 dark:text-white">{act.performerSignature}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">(подпись / ФИО)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Заказчик:</p>
            <div className="border-b border-gray-400 dark:border-gray-500 pb-2 mb-1">
              <p className="text-gray-800 dark:text-white">{act.customerSignature}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">(подпись / ФИО)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
