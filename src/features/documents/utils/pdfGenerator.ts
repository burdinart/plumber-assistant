import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document } from '../types';
import { UserProfile } from '../../profile/types';
import { formatDateForDocument, formatAmount } from './documentHelpers';

interface PDFOptions {
  includeSignature?: boolean;
  includeStamp?: boolean;
}

/**
 * Генерация PDF документа
 */
export const generateDocumentPDF = (
  document: Document,
  profile: UserProfile,
  options: PDFOptions = {}
): jsPDF => {
  const pdf = new jsPDF();
  const { includeSignature = true, includeStamp = true } = options;

  // Настройки шрифтов (кириллица требует специальных шрифтов)
  // Используем стандартный шрифт с поддержкой Unicode
  pdf.setFont('helvetica');

  // Заголовок документа
  pdf.setFontSize(16);
  pdf.text(getDocumentTitle(document.type), 105, 20, { align: 'center' });

  // Номер и дата
  pdf.setFontSize(12);
  pdf.text(`№ ${document.number}`, 105, 30, { align: 'center' });
  pdf.text(`от ${formatDateForDocument(document.createdAt)}`, 105, 37, { align: 'center' });

  // Линия разделительная
  pdf.line(20, 45, 190, 45);

  // Стороны документа
  pdf.setFontSize(10);
  let yPos = 55;

  // Исполнитель
  pdf.setFont('helvetica', 'bold');
  pdf.text('ИСПОЛНИТЕЛЬ:', 20, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text(profile.companyName || profile.fullName, 20, yPos);
  yPos += 5;
  if (profile.inn) {
    pdf.text(`ИНН: ${profile.inn}`, 20, yPos);
    yPos += 5;
  }
  if (profile.phone) {
    pdf.text(`Тел: ${profile.phone}`, 20, yPos);
    yPos += 5;
  }
  if (profile.email) {
    pdf.text(`Email: ${profile.email}`, 20, yPos);
    yPos += 5;
  }

  // Заказчик (из контента документа или из клиента)
  yPos += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('ЗАКАЗЧИК:', 20, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  
  const customer = (document as any).content?.customer;
  if (customer) {
    pdf.text(customer.name || 'Клиент', 20, yPos);
    yPos += 5;
    if (customer.phone) {
      pdf.text(`Тел: ${customer.phone}`, 20, yPos);
      yPos += 5;
    }
  }

  // Предмет договора/акта
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  const subject = (document as any).content?.subject || 'Выполненные работы:';
  pdf.text(subject, 20, yPos);
  yPos += 8;

  // Таблица работ/материалов
  const items = (document as any).content?.items || [];
  
  if (items.length > 0) {
    autoTable(pdf, {
      startY: yPos,
      head: [['№', 'Наименование', 'Ед.', 'Кол-во', 'Цена', 'Сумма']],
      body: items.map((item: any, index: number) => [
        String(index + 1),
        item.name,
        item.unit,
        String(item.quantity),
        formatAmount(item.price).replace(' руб.', ''),
        formatAmount(item.total).replace(' руб.', '')
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // Blue header
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      }
    });

    yPos = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Итого
  pdf.setFont('helvetica', 'bold');
  const totalAmount = (document as any).content?.totalAmount || (document as any).total || 0;
  pdf.text(`ИТОГО: ${formatAmount(totalAmount)}`, 150, yPos);
  yPos += 10;

  // Дополнительные условия
  const additionalTerms = (document as any).content?.additionalTerms;
  if (additionalTerms) {
    pdf.setFont('helvetica', 'normal');
    pdf.text('Дополнительные условия:', 20, yPos);
    yPos += 6;
    
    const splitText = pdf.splitTextToSize(additionalTerms, 170);
    pdf.text(splitText, 20, yPos);
    yPos += splitText.length * 5 + 5;
  }

  // Гарантийный срок
  const warrantyPeriod = (document as any).content?.warrantyPeriod;
  if (warrantyPeriod) {
    pdf.text(`Гарантийный срок: ${warrantyPeriod}`, 20, yPos);
    yPos += 10;
  }

  // Подписи сторон
  yPos = Math.max(yPos, 250); //确保在页面底部
  
  // Разделительная линия перед подписями
  pdf.line(20, yPos - 5, 190, yPos - 5);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('ИСПОЛНИТЕЛЬ:', 20, yPos + 10);
  pdf.text('ЗАКАЗЧИК:', 110, yPos + 10);
  
  // Место для подписи
  pdf.setFont('helvetica', 'normal');
  pdf.text('_______________', 20, yPos + 25);
  pdf.text('_______________', 110, yPos + 25);
  
  // Печать и подпись исполнителя
  if (includeStamp && profile.stampUrl) {
    try {
      // Добавляем изображение печати
      pdf.addImage(profile.stampUrl, 'PNG', 20, yPos + 30, 30, 30);
    } catch (e) {
      console.warn('Не удалось добавить изображение печати:', e);
    }
  }
  
  if (includeSignature && profile.signatureUrl) {
    try {
      // Добавляем изображение подписи
      pdf.addImage(profile.signatureUrl, 'PNG', 60, yPos + 30, 40, 20);
    } catch (e) {
      console.warn('Не удалось добавить изображение подписи:', e);
    }
  }

  return pdf;
};

/**
 * Скачать PDF документ
 */
export const downloadDocumentPDF = (
  document: Document,
  profile: UserProfile,
  options: PDFOptions = {}
): void => {
  const pdf = generateDocumentPDF(document, profile, options);
  const filename = `${document.type}_${document.number.replace(/[/\\]/g, '-')}.pdf`;
  pdf.save(filename);
};

/**
 * Получить название документа по типу
 */
const getDocumentTitle = (type: string): string => {
  const titles: Record<string, string> = {
    act: 'Акт выполненных работ',
    contract: 'Договор на оказание услуг',
    warranty: 'Гарантийный талон',
    estimate: 'Смета',
    handover: 'Акт приёмки-передачи'
  };
  return titles[type] || 'Документ';
};

/**
 * Предпросмотр PDF (возвращает Data URL)
 */
export const previewDocumentPDF = (
  document: Document,
  profile: UserProfile,
  options: PDFOptions = {}
): string => {
  const pdf = generateDocumentPDF(document, profile, options);
  return pdf.output('datauristring');
};
