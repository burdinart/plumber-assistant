import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Обёртка виджета главной страницы, поддерживающая drag-and-drop (@dnd-kit).
// Перетаскивание — за иконку-ручку (чтобы не ломать клики по ссылкам внутри
// виджетов) либо за весь контейнер в «режиме перемещения» (isMoveMode).
// ---------------------------------------------------------------------------

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  /** true — весь блок можно тянуть (мобильный режим), ручка остаётся подсказкой. */
  isMoveMode?: boolean;
}

export function DraggableWidget({ id, children, isMoveMode = false }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.35)' : undefined,
  };

  const gripButton = (
    <button
      type="button"
      {...attributes}
      {...(isMoveMode ? undefined : listeners)}
      aria-label="Перетащить виджет"
      title="Перетащите, чтобы изменить порядок"
      className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing touch-none transition-colors"
    >
      <GripVertical className="w-5 h-5" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${
        isDragging ? 'ring-2 ring-blue-400/60' : ''
      } ${isMoveMode ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
      {...(isMoveMode ? attributes : {})}
      {...(isMoveMode ? listeners : {})}
    >
      {/* Ручка ⋮⋮ в правом верхнем углу виджета */}
      <div className="absolute top-1.5 right-1.5 z-10">{gripButton}</div>
      {children}
    </div>
  );
}
