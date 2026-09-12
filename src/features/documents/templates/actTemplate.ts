import { Act } from '../types';
import { formatDocumentDate, formatDocumentAmount } from '../utils/documentHelpers';

/**
 * Генерация HTML для печати акта выполненных работ
 * @param act - данные акта
 * @param clientName - имя клиента
 * @param clientAddress - адрес клиента
 * @returns HTML строка для печати
 */
export function generateActHtml(
  act: Act,
  clientName: string,
  clientAddress: string
): string {
  const workItems = act.items.filter(item => item.type === 'work');
  const materialItems = act.items.filter(item => item.type === 'material');

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Акт ${act.number}</title>
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
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
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
    .complaints {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
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
    <h1>АКТ ВЫПОЛНЕННЫХ РАБОТ</h1>
    <p><strong>№ ${act.number}</strong></p>
    <p>от ${formatDocumentDate(act.completionDate)}</p>
  </div>

  <div class="info">
    <p><strong>Исполнитель:</strong> Помощник Сантехника</p>
    <p><strong>Заказчик:</strong> ${clientName}</p>
    <p><strong>Адрес объекта:</strong> ${clientAddress}</p>
  </div>

  <p>Настоящий акт составлен о том, что следующие работы выполнены, а материалы использованы:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;" class="text-center">№</th>
        <th style="width: 50%;">Наименование</th>
        <th style="width: 10%;" class="text-center">Ед.</th>
        <th style="width: 10%;" class="text-center">Кол-во</th>
        <th style="width: 12%;" class="text-right">Цена</th>
        <th style="width: 13%;" class="text-right">Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${workItems.map((item, index) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.name}</td>
          <td class="text-center">${item.unit}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">${formatDocumentAmount(item.price)}</td>
          <td class="text-right">${formatDocumentAmount(item.quantity * item.price)}</td>
        </tr>
      `).join('')}
      ${materialItems.length > 0 ? `
        <tr>
          <td colspan="6" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">
            Материалы
          </td>
        </tr>
        ${materialItems.map((item, index) => `
          <tr>
            <td class="text-center">${workItems.length + index + 1}</td>
            <td>${item.name}</td>
            <td class="text-center">${item.unit}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">${formatDocumentAmount(item.price)}</td>
            <td class="text-right">${formatDocumentAmount(item.quantity * item.price)}</td>
          </tr>
        `).join('')}
      ` : ''}
      <tr class="total-row">
        <td colspan="5" class="text-right">Итого работы:</td>
        <td class="text-right">${formatDocumentAmount(act.totalWork)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="5" class="text-right">Итого материалы:</td>
        <td class="text-right">${formatDocumentAmount(act.totalMaterials)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="5" class="text-right">ВСЕГО К ОПЛАТЕ:</td>
        <td class="text-right">${formatDocumentAmount(act.total)}</td>
      </tr>
    </tbody>
  </table>

  ${act.complaints ? `
    <div class="complaints">
      <strong>Претензии и замечания:</strong><br>
      ${act.complaints}
    </div>
  ` : ''}

  <p style="margin-top: 20px;">
    Заказчик претензий по объёму, качеству и срокам выполнения работ не имеет.
  </p>

  <div class="signatures">
    <div class="signature-block">
      <p><strong>Исполнитель:</strong></p>
      <div class="signature-line">
        ${act.performerSignature}
      </div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись / ФИО)</p>
    </div>
    <div class="signature-block">
      <p><strong>Заказчик:</strong></p>
      <div class="signature-line">
        ${act.customerSignature}
      </div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись / ФИО)</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
