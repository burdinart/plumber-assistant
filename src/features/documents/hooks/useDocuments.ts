import { useState, useEffect } from 'react';
import {
  Act,
  Contract,
  Warranty,
  PhotoReport,
  Documents,
  DocumentType,
} from '../types';
import { storage, generateId } from '../../../shared/utils/storage';
import { generateDocumentNumber } from '../utils/documentHelpers';

const STORAGE_KEY = 'plumber-assistant-documents';

// Демо-данные документов
const DEMO_DOCUMENTS: Documents = {
  acts: [
    {
      id: 'act-1',
      type: 'act',
      number: 'АКТ-001',
      clientId: 'client-1',
      estimateId: 'estimate-1',
      completionDate: '2026-09-15',
      performerSignature: 'Иванов И.И.',
      customerSignature: 'Петров П.П.',
      items: [
        { id: '1', name: 'Замена смесителя', unit: 'шт', quantity: 1, price: 1500, type: 'work' },
        { id: '2', name: 'Смеситель Grohe', unit: 'шт', quantity: 1, price: 5000, type: 'material' },
      ],
      totalWork: 1500,
      totalMaterials: 5000,
      total: 6500,
      createdAt: '2026-09-15T10:00:00Z',
    },
    {
      id: 'act-2',
      type: 'act',
      number: 'АКТ-002',
      clientId: 'client-4',
      estimateId: 'estimate-2',
      completionDate: '2026-09-18',
      performerSignature: 'Иванов И.И.',
      customerSignature: 'Сидоров А.В.',
      items: [
        { id: '3', name: 'Монтаж радиатора', unit: 'шт', quantity: 2, price: 2500, type: 'work' },
        { id: '4', name: 'Радиатор стальной', unit: 'шт', quantity: 2, price: 8000, type: 'material' },
      ],
      totalWork: 5000,
      totalMaterials: 16000,
      total: 21000,
      createdAt: '2026-09-18T14:30:00Z',
    },
  ],
  contracts: [
    {
      id: 'contract-1',
      type: 'contract',
      number: 'ДОГ-001',
      clientId: 'client-4',
      orderId: 'order-1',
      startDate: '2026-09-10',
      endDate: '2026-09-20',
      cost: 45000,
      paymentTerms: '50% предоплата, 50% по факту выполнения',
      warrantyTerms: 'Гарантия на выполненные работы — 12 месяцев',
      createdAt: '2026-09-10T09:00:00Z',
    },
  ],
  warranties: [
    {
      id: 'warranty-1',
      type: 'warranty',
      number: 'ГАТ-001',
      clientId: 'client-1',
      orderId: 'order-1',
      issueDate: '2026-09-15',
      expiryDate: '2027-09-15',
      warrantyMonths: 12,
      workDescription: 'Замена смесителя в ванной комнате с гарантией на работы и материалы',
      createdAt: '2026-09-15T12:00:00Z',
    },
  ],
  photoReports: [],
};

/**
 * Загрузка документов из LocalStorage
 */
function loadDocuments(): Documents {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.acts && parsed.contracts && parsed.warranties && parsed.photoReports) {
        return parsed;
      }
    }
    // Если данных нет — загружаем демо-данные
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DOCUMENTS));
    return DEMO_DOCUMENTS;
  } catch (error) {
    console.error('Error loading documents:', error);
    return DEMO_DOCUMENTS;
  }
}

/**
 * Сохранение документов в LocalStorage
 */
function saveDocuments(documents: Documents): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error('Error saving documents:', error);
  }
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Documents>(() => loadDocuments());

  /**
   * Получить все номера документов
   */
  const getAllDocumentNumbers = (): string[] => {
    return [
      ...documents.acts.map(a => a.number),
      ...documents.contracts.map(c => c.number),
      ...documents.warranties.map(w => w.number),
      ...documents.photoReports.map(p => p.number),
    ];
  };

  /**
   * Создать акт
   */
  const createAct = (data: Omit<Act, 'id' | 'number' | 'createdAt' | 'type'>): Act => {
    const newAct: Act = {
      ...data,
      id: generateId(),
      type: 'act',
      number: generateDocumentNumber('act', getAllDocumentNumbers()),
      createdAt: new Date().toISOString(),
    };

    setDocuments(prev => {
      const updated = { ...prev, acts: [...prev.acts, newAct] };
      saveDocuments(updated);
      return updated;
    });

    return newAct;
  };

  /**
   * Создать договор
   */
  const createContract = (data: Omit<Contract, 'id' | 'number' | 'createdAt' | 'type'>): Contract => {
    const newContract: Contract = {
      ...data,
      id: generateId(),
      type: 'contract',
      number: generateDocumentNumber('contract', getAllDocumentNumbers()),
      createdAt: new Date().toISOString(),
    };

    setDocuments(prev => {
      const updated = { ...prev, contracts: [...prev.contracts, newContract] };
      saveDocuments(updated);
      return updated;
    });

    return newContract;
  };

  /**
   * Создать гарантийный талон
   */
  const createWarranty = (data: Omit<Warranty, 'id' | 'number' | 'createdAt' | 'type'>): Warranty => {
    const newWarranty: Warranty = {
      ...data,
      id: generateId(),
      type: 'warranty',
      number: generateDocumentNumber('warranty', getAllDocumentNumbers()),
      createdAt: new Date().toISOString(),
    };

    setDocuments(prev => {
      const updated = { ...prev, warranties: [...prev.warranties, newWarranty] };
      saveDocuments(updated);
      return updated;
    });

    return newWarranty;
  };

  /**
   * Создать фотоотчёт
   */
  const createPhotoReport = (data: Omit<PhotoReport, 'id' | 'number' | 'createdAt' | 'type'>): PhotoReport => {
    const newPhotoReport: PhotoReport = {
      ...data,
      id: generateId(),
      type: 'photo_report',
      number: generateDocumentNumber('photo_report', getAllDocumentNumbers()),
      createdAt: new Date().toISOString(),
    };

    setDocuments(prev => {
      const updated = { ...prev, photoReports: [...prev.photoReports, newPhotoReport] };
      saveDocuments(updated);
      return updated;
    });

    return newPhotoReport;
  };

  /**
   * Обновить документ
   */
  const updateDocument = (id: string, type: DocumentType, data: Partial<Act | Contract | Warranty | PhotoReport>): void => {
    setDocuments(prev => {
      const updated = { ...prev };

      switch (type) {
        case 'act':
          updated.acts = prev.acts.map(act => act.id === id ? { ...act, ...data } as Act : act);
          break;
        case 'contract':
          updated.contracts = prev.contracts.map(contract => contract.id === id ? { ...contract, ...data } as Contract : contract);
          break;
        case 'warranty':
          updated.warranties = prev.warranties.map(warranty => warranty.id === id ? { ...warranty, ...data } as Warranty : warranty);
          break;
        case 'photo_report':
          updated.photoReports = prev.photoReports.map(report => report.id === id ? { ...report, ...data } as PhotoReport : report);
          break;
      }

      saveDocuments(updated);
      return updated;
    });
  };

  /**
   * Удалить документ
   */
  const deleteDocument = (id: string, type: DocumentType): void => {
    setDocuments(prev => {
      const updated = { ...prev };

      switch (type) {
        case 'act':
          updated.acts = prev.acts.filter(act => act.id !== id);
          break;
        case 'contract':
          updated.contracts = prev.contracts.filter(contract => contract.id !== id);
          break;
        case 'warranty':
          updated.warranties = prev.warranties.filter(warranty => warranty.id !== id);
          break;
        case 'photo_report':
          updated.photoReports = prev.photoReports.filter(report => report.id !== id);
          break;
      }

      saveDocuments(updated);
      return updated;
    });
  };

  /**
   * Получить документы клиента
   */
  const getByClient = (clientId: string): { acts: Act[]; contracts: Contract[]; warranties: Warranty[]; photoReports: PhotoReport[] } => {
    return {
      acts: documents.acts.filter(a => a.clientId === clientId),
      contracts: documents.contracts.filter(c => c.clientId === clientId),
      warranties: documents.warranties.filter(w => w.clientId === clientId),
      photoReports: documents.photoReports.filter(p => p.clientId === clientId),
    };
  };

  /**
   * Получить документы заявки
   */
  const getByOrder = (orderId: string): { acts: Act[]; contracts: Contract[]; warranties: Warranty[]; photoReports: PhotoReport[] } => {
    return {
      acts: documents.acts.filter(a => a.orderId === orderId),
      contracts: documents.contracts.filter(c => c.orderId === orderId),
      warranties: documents.warranties.filter(w => w.orderId === orderId),
      photoReports: documents.photoReports.filter(p => p.orderId === orderId),
    };
  };

  /**
   * Получить документы сметы
   */
  const getByEstimate = (estimateId: string): Act[] => {
    return documents.acts.filter(a => a.estimateId === estimateId);
  };

  /**
   * Получить акт по ID
   */
  const getAct = (id: string): Act | undefined => {
    return documents.acts.find(a => a.id === id);
  };

  /**
   * Получить договор по ID
   */
  const getContract = (id: string): Contract | undefined => {
    return documents.contracts.find(c => c.id === id);
  };

  /**
   * Получить гарантийный талон по ID
   */
  const getWarranty = (id: string): Warranty | undefined => {
    return documents.warranties.find(w => w.id === id);
  };

  /**
   * Получить фотоотчёт по ID
   */
  const getPhotoReport = (id: string): PhotoReport | undefined => {
    return documents.photoReports.find(p => p.id === id);
  };

  return {
    documents,
    createAct,
    createContract,
    createWarranty,
    createPhotoReport,
    updateDocument,
    deleteDocument,
    getByClient,
    getByOrder,
    getByEstimate,
    getAct,
    getContract,
    getWarranty,
    getPhotoReport,
  };
}
