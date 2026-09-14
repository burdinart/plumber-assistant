import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useVersionCheck } from './shared/hooks/useVersionCheck';

export default function App() {
  useVersionCheck();
  return <RouterProvider router={router} />;
}
