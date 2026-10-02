import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useVersionCheck } from './shared/hooks/useVersionCheck';
import { UpdatePrompt } from './shared/ui/UpdatePrompt';

export default function App() {
  useVersionCheck();
  return (
    <>
      <RouterProvider router={router} />
      {/* Баннер «Доступно обновление» — поверх роутера, виден на всех экранах
          (и в браузере, и в установленном PWA/TWA). */}
      <UpdatePrompt />
    </>
  );
}
