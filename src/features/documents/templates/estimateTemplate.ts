import { Estimate } from '../../finance/types';
import { UserProfile } from '../../profile/types';
import { formatDocumentDate, formatDocumentAmount } from '../utils/documentHelpers';
import { getContractorHeaderLine } from '../utils/autoFillProfile';

/**
 * Генерация HTML для печати сметы (тот же подход, что и в actTemplate/contractTemplate:
 * отдельное окно с самодостаточным документом формата A4).
 *
 * Мобильная адаптация:
 * - таблица на 100% ширины листа, фиксированные проценты колонок — ничего не обрезается;
 * - длинные наименования переносятся (word-wrap), а не вылезают за границы;
 * - при печати все колонки (включая Цену и Сумму) видны на листе A4.
 *
 * @param estimate - данные сметы
 * @param clientName - имя клиента
 * @param profile - профиль исполнителя (Настройки → Профиль)
 */
export function generateEstimateHtml(
  estimate: Estimate,
  clientName: string,
  profile?: UserProfile | null
): string {
  const workItems = estimate.items.filter(item => item.type === 'work');
  const materialItems = estimate.items.filter(item => item.type === 'material');

  const discountValue =
    estimate.discountType === 'percent'
      ? ((estimate.totalWork + estimate.totalMaterials) * estimate.discount) / 100
      : estimate.discount;

  const row = (item: (typeof estimate.items)[number], index: number) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.name}</td>
          <td class="text-center">${item.unit || 'шт'}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">${formatDocumentAmount(item.price)}</td>
          <td class="text-right">${formatDocumentAmount(item.quantity * item.price)}</td>
        </tr>`;

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Смета ${estimate.number}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 16pt;
      margin: 0 0 10px 0;
    }
    .header p {
      margin: 5px 0;
    }
    .info {
      margin-bottom: 20px;
    }
    .info p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      table-layout: fixed;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .total-row {
      font-weight: bold;
      background-color: #f9f9f9;
    }
    .totals-table td {
      border: none;
      padding: 4px 8px;
    }
    .notes {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
    }
    .signatures {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature-block {
      width: 45%;
    }
    .signature-line {
      border-bottom: 1px solid #000;
      margin-top: 30px;
      padding-top: 5px;
    }
    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>СМЕТА № ${estimate.number}</h1>
    <p><strong>от:</strong> ${formatDocumentDate(estimate.createdAt)}</p>
    <p><strong>Срок действия:</strong> до ${formatDocumentDate(estimate.validUntil)}</p>
  </div>

  <div class="info">
    <p><strong>Исполнитель:</strong> ${getContractorHeaderLine(profile)}</p>
    <p><strong>Заказчик:</strong> ${clientName}</p>
    <p><strong>Адрес объекта:</strong> ${estimate.address || '—'}</p>
  </div>

  <p>Перечень работ и материалов:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;" class="text-center">№</th>
        <th style="width: 47%;">Наименование</th>
        <th style="width: 8%;" class="text-center">Ед.</th>
        <th style="width: 10%;" class="text-center">Кол-во</th>
        <th style="width: 15%;" class="text-right">Цена</th>
        <th style="width: 15%;" class="text-right">Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${workItems.map(row).join('')}
      ${materialItems.length > 0 ? `
        <tr>
          <td colspan="6" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">
            Материалы
          </td>
        </tr>
        ${materialItems.map((item, index) => row(item, workItems.length + index)).join('')}
      ` : ''}
    </tbody>
  </table>

  <table class="totals-table" style="margin-left:auto; width: 60%;">
    <tr>
      <td>Итого работы:</td>
      <td class="text-right">${formatDocumentAmount(estimate.totalWork)}</td>
    </tr>
    <tr>
      <td>Итого материалы:</td>
      <td class="text-right">${formatDocumentAmount(estimate.totalMaterials)}</td>
    </tr>
    <tr>
      <td>Подытог:</td>
      <td class="text-right">${formatDocumentAmount(estimate.totalWork + estimate.totalMaterials)}</td>
    </tr>
    ${estimate.discount > 0 ? `
    <tr>
      <td>Скидка${estimate.discountType === 'percent' ? ` (${estimate.discount}%)` : ''}:</td>
      <td class="text-right">-${formatDocumentAmount(discountValue)}</td>
    </tr>
    ` : ''}
    <tr class="total-row">
      <td style="border-top: 2px solid #000;"><strong>ИТОГО К ОПЛАТЕ:</strong></td>
      <td class="text-right" style="border-top: 2px solid #000;"><strong>${formatDocumentAmount(estimate.total)}</strong></td>
    </tr>
  </table>

  ${estimate.notes ? `
    <div class="notes">
      <strong>Примечания:</strong><br>
      ${estimate.notes}
    </div>
  ` : ''}

  <div class="signatures">
    <div class="signature-block">
      <p><strong>Исполнитель:</strong></p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись / ФИО)</p>
    </div>
    <div class="signature-block">
      <p><strong>Заказчик:</strong></p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись / ФИО)</p>
    </div>
  </div>
</body>
</html>`;
}
