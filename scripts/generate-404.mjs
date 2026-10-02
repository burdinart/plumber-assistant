// Vite-плагин: после сборки копирует dist/index.html -> dist/404.html.
//
// Зачем: GitHub Pages не знает про SPA-роуты (createBrowserRouter).
// Прямое открытие https://burdinart.github.io/plumber-assistant/about
// отдаёт 404, и GitHub Pages показывает файл 404.html из корня репозитория.
// Если положить туда копию собранного index.html (с корректными абсолютными
// путями к хэшированным ассетам), приложение загрузится, React Router
// увидит путь /about и отрендерит нужную страницу — «умная» ссылка работает.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function spa404Plugin() {
  let resolvedOutDir = '';
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      resolvedOutDir = join(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = join(resolvedOutDir, 'index.html');
      try {
        const html = readFileSync(index, 'utf8');
        writeFileSync(join(resolvedOutDir, '404.html'), html);
        console.log('[spa-404-fallback] dist/404.html создан из index.html');
      } catch (e) {
        console.warn('[spa-404-fallback] пропущен:', e.message);
      }
    },
  };
}
