import { Contract } from '../types';
import { formatDocumentDate, formatDocumentAmount } from '../utils/documentHelpers';

/**
 * Генерация HTML для печати договора
 * @param contract - данные договора
 * @param clientName - имя клиента
 * @param clientAddress - адрес клиента
 * @param clientPhone - телефон клиента
 * @returns HTML строка для печати
 */
export function generateContractHtml(
  contract: Contract,
  clientName: string,
  clientAddress: string,
  clientPhone: string
): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Договор ${contract.number}</title>
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
    }
    .header h1 {
      font-size: 16pt;
      margin: 0 0 10px 0;
    }
    .header p {
      margin: 5px 0;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      font-size: 13pt;
      margin-bottom: 10px;
    }
    .section p {
      margin: 8px 0;
      text-align: justify;
    }
    .info-block {
      margin: 15px 0;
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
    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ДОГОВОР ПОДРЯДА</h1>
    <h1>на выполнение сантехнических работ</h1>
    <p><strong>№ ${contract.number}</strong></p>
    <p>г. Москва &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${formatDocumentDate(contract.createdAt)}</p>
  </div>

  <div class="info-block">
    <p><strong>Исполнитель:</strong> Помощник Сантехника, ИНН 7712345678, тел: +7 (999) 123-45-67</p>
    <p><strong>Заказчик:</strong> ${clientName}, тел: ${clientPhone}</p>
    <p><strong>Адрес объекта:</strong> ${clientAddress}</p>
  </div>

  <div class="section">
    <h2>1. ПРЕДМЕТ ДОГОВОРА</h2>
    <p>1.1. Исполнитель обязуется выполнить по заданию Заказчика сантехнические работы, а Заказчик обязуется принять и оплатить выполненную работу.</p>
    <p>1.2. Перечень работ, их объём и стоимость определяются в смете, которая является неотъемлемой частью настоящего договора.</p>
  </div>

  <div class="section">
    <h2>2. СРОКИ ВЫПОЛНЕНИЯ РАБОТ</h2>
    <p>2.1. Начало работ: ${formatDocumentDate(contract.startDate)}</p>
    <p>2.2. Окончание работ: ${formatDocumentDate(contract.endDate)}</p>
    <p>2.3. Сроки могут быть изменены по соглашению сторон в случае возникновения непредвиденных обстоятельств.</p>
  </div>

  <div class="section">
    <h2>3. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЁТОВ</h2>
    <p>3.1. Общая стоимость работ составляет: <strong>${formatDocumentAmount(contract.cost)}</strong></p>
    <p>3.2. Порядок оплаты: ${contract.paymentTerms}</p>
    <p>3.3. Оплата производится в рублях Российской Федерации.</p>
  </div>

  <div class="section">
    <h2>4. ГАРАНТИЙНЫЕ ОБЯЗАТЕЛЬСТВА</h2>
    <p>4.1. ${contract.warrantyTerms}</p>
    <p>4.2. Гарантия не распространяется на defects, возникшие по вине Заказчика или в результате неправильной эксплуатации.</p>
  </div>

  ${contract.additionalTerms ? `
    <div class="section">
      <h2>5. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ</h2>
      <p>${contract.additionalTerms}</p>
    </div>
  ` : ''}

  <div class="section">
    <h2>${contract.additionalTerms ? '6' : '5'}. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
    <p>${contract.additionalTerms ? '6' : '5'}.1. В случае невыполнения или ненадлежащего выполнения обязательств по настоящему договору стороны несут ответственность в соответствии с действующим законодательством РФ.</p>
    <p>${contract.additionalTerms ? '6' : '5'}.2. Все споры решаются путём переговоров, а при недостижении согласия — в судебном порядке.</p>
  </div>

  <div class="section">
    <h2>${contract.additionalTerms ? '7' : '6'}. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
    <p>${contract.additionalTerms ? '7' : '6'}.1. Настоящий договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.</p>
    <p>${contract.additionalTerms ? '7' : '6'}.2. Договор вступает в силу с момента его подписания и действует до полного исполнения сторонами своих обязательств.</p>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <p><strong>ИСПОЛНИТЕЛЬ:</strong></p>
      <p>Помощник Сантехника</p>
      <p>ИНН: 7712345678</p>
      <p>Тел: +7 (999) 123-45-67</p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись)</p>
    </div>
    <div class="signature-block">
      <p><strong>ЗАКАЗЧИК:</strong></p>
      <p>${clientName}</p>
      <p>Адрес: ${clientAddress}</p>
      <p>Тел: ${clientPhone}</p>
      <div class="signature-line"></div>
      <p style="font-size: 10pt; margin-top: 5px;">(подпись)</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
