import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 md:bottom-4">
      <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Нет подключения к интернету</span>
      </div>
    </div>
  );
};
