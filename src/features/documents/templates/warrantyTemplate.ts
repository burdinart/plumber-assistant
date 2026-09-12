import { Warranty } from '../types';
import { formatDocumentDate } from '../utils/documentHelpers';

/**
 * Генерация HTML для печати гарантийного талона
 * @param warranty - данные гарантийного талона
 * @param clientName - имя клиента
 * @param clientAddress - адрес клиента
 * @param clientPhone - телефон клиента
 * @returns HTML строка для печати
 */
export function generateWarrantyHtml(
  warranty: Warranty,
  clientName: string,
  clientAddress: string,
  clientPhone: string
): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Гарантийный талон ${warranty.number}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px double #000;
      padding-bottom: 20px;
    }
    .header h1 {
      font-size: 18pt;
      margin: 0 0 10px 0;
      text-transform: uppercase;
    }
    .header h2 {
      font-size: 14pt;
      margin: 0 0 10px 0;
    }
    .header p {
      margin: 5px 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h3 {
      font-size: 13pt;
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .info-table td {
      padding: 8px;
      border: 1px solid #000;
      vertical-align: top;
    }
    .info-table .label {
      width: 30%;
      font-weight: bold;
      background-color: #f0f0f0;
    }
    .warranty-period {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin: 20px 0;
      padding: 15px;
      border: 2px solid #000;
      background-color: #f9f9f9;
    }
    .warning {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #000;
      background-color: #fff3cd;
      font-size: 11pt;
    }
    .warning strong {
      display: block;
      margin-bottom: 10px;
      font-size: 12pt;
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
    .stamp {
      margin-top: 20px;
      text-align: center;
      font-size: 10pt;
      color: #666;
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
    <h1>Гарантийный талон</h1>
    <h2>№ ${warranty.number}</h2>
    <p>от ${formatDocumentDate(warranty.issueDate)}</p>
  </div>

  <div class="section">
    <h3>Информация о заказчике</h3>
    <table class="info-table">
      <tr>
        <td class="label">ФИО / Наименование:</td>
        <td>${clientName}</td>
      </tr>
      <tr>
        <td class="label">Адрес:</td>
        <td>${clientAddress}</td>
      </tr>
      <tr>
        <td class="label">Телефон:</td>
        <td>${clientPhone}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h3>Описание выполненных работ</h3>
    <p style="padding: 10px; border: 1px solid #000; min-height: 60px;">
      ${warranty.workDescription}
    </p>
  </div>

  <div class="section">
    <h3>Гарантийный период</h3>
    <table class="info-table">
      <tr>
        <td class="label">Дата начала гарантии:</td>
        <td>${formatDocumentDate(warranty.issueDate)}</td>
      </tr>
      <tr>
        <td class="label">Срок гарантии:</td>
        <td>${warranty.warrantyMonths} ${getMonthWord(warranty.warrantyMonths)}</td>
      </tr>
      <tr>
        <td class="label">Дата окончания гарантии:</td>
        <td><strong>${formatDocumentDate(warranty.expiryDate)}</strong></td>
      </tr>
    </table>
  </div>

  <div class="warning">
    <strong>УСЛОВИЯ ГАРАНТИИ:</strong>
    <p>1. Гарантия распространяется на выполненные работы и установленные материалы.</p>
    <p>2. Гарантия не распространяется на defects, возникшие в результате:</p>
    <p style="margin-left: 20px;">- неправильной эксплуатации оборудования;</p>
    <p style="margin-left: 20px;">- механических повреждений;</p>
    <p style="margin-left: 20px;">- вмешательства третьих лиц;</p>
    <p style="margin-left: 20px;">- форс-мажорных обстоятельств.</p>
    <p>3. Для получения гарантийного обслуживания необходимо предъявить данный талон.</p>
    <p>4. Гарантийное обслуживание осуществляется бесплатно в течение всего гарантийного срока.</p>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <p><strong>Исполнитель:</strong></p>
      <p>Помощник Сантехника</p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">М.П. / Подпись</p>
    </div>
    <div class="signature-block">
      <p><strong>Заказчик:</strong></p>
      <p>${clientName}</p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">Подпись</p>
    </div>
  </div>

  <div class="stamp">
    <p>Документ действителен без печати при наличии подписи исполнителя</p>
    <p>Дата выдачи: ${formatDocumentDate(warranty.createdAt)}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Получение правильного склонения слова "месяц"
 */
function getMonthWord(months: number): string {
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
}
