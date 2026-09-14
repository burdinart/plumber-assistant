import { APP_VERSION } from '../../version';
import { Info } from 'lucide-react';

/**
 * Компонент для отображения версии приложения
 * Используется в футере или хедере
 */
export const VersionBadge = () => {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <Info className="w-3 h-3" />
      <span>v{APP_VERSION.version}</span>
      <span className="text-gray-600">•</span>
      <span>{APP_VERSION.buildDate}</span>
    </div>
  );
};
