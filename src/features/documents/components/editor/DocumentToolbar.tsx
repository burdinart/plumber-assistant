import { useNavigate } from 'react-router-dom';
import { FileText, Save, Download, X, Eye, Maximize2, RotateCcw } from 'lucide-react';

interface DocumentToolbarProps {
  isEditMode: boolean;
  lockSupported: boolean;
  isLandscape: boolean;
  onLockOrientation: () => void;
  onUnlockOrientation: () => void;
  onShowPreview: () => void;
  onExportPDF: () => void;
  onSave: () => void;
}

const TOOLBAR_BTN =
  'px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 min-h-[44px]';
const ACTION_BTN =
  'px-4 py-2 text-white rounded-lg flex items-center gap-2 min-h-[44px]';

/** Шапка редактора документов: заголовок + действия (ориентация, предпросмотр, PDF, сохранение). */
export const DocumentToolbar = ({
  isEditMode,
  lockSupported,
  isLandscape,
  onLockOrientation,
  onUnlockOrientation,
  onShowPreview,
  onExportPDF,
  onSave,
}: DocumentToolbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-400 shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {isEditMode ? 'Редактирование документа' : 'Новый документ'}
        </h1>
      </div>
      <div className="flex gap-2 flex-wrap">
        {/* Блокировка альбомной ориентации — доступна только в установленной PWA;
            в обычном браузере кнопка скрывается, lockOrientation безопасно no-op. */}
        {lockSupported && !isLandscape && (
          <button
            onClick={onLockOrientation}
            className={TOOLBAR_BTN}
            title="Развернуть в альбомный режим для удобного редактирования таблицы"
          >
            <Maximize2 className="w-4 h-4" />
            Альбомно
          </button>
        )}
        {lockSupported && isLandscape && (
          <button onClick={onUnlockOrientation} className={TOOLBAR_BTN} title="Вернуть свободную ориентацию">
            <RotateCcw className="w-4 h-4" />
            Сброс ориентации
          </button>
        )}
        <button
          onClick={onShowPreview}
          className={`${ACTION_BTN} bg-gray-700 hover:bg-gray-600`}
        >
          <Eye className="w-4 h-4" />
          Предпросмотр
        </button>
        <button
          onClick={onExportPDF}
          className={`${ACTION_BTN} bg-green-600 hover:bg-green-700`}
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button
          onClick={onSave}
          className={`${ACTION_BTN} bg-blue-600 hover:bg-blue-700`}
        >
          <Save className="w-4 h-4" />
          Сохранить
        </button>
        <button
          onClick={() => navigate('/documents')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
