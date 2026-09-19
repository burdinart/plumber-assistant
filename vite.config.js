import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Версия кэша - обновляется при каждом релизе
const CACHE_VERSION = 'v1.0.2';

export default defineConfig({
  base: "/plumber-assistant/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192x192.svg", "icon-512x512.svg"],
      manifest: {
        name: "Помощник Сантехника",
        short_name: "Сантехник",
        description:
          "Профессиональные инструменты для сантехников: калькуляторы, справочники, CRM",
        theme_color: "#1e293b",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: "/plumber-assistant/",
        start_url: "/plumber-assistant/",
        icons: [
          {
            src: "icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // Добавляем версию в имя кэша для принудительного обновления
        cacheId: `plumber-assistant-${CACHE_VERSION.replace(/\./g, '-')}`,
        // Очищаем старые кэши при активации
        cleanupOutdatedCaches: true,
        // Используем networkFirst для навигации
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: `plumber-assistant-runtime-${CACHE_VERSION.replace(/\./g, '-')}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      // Принудительная перерегистрация SW при изменении
      devOptions: {
        enabled: false,
        type: 'module'
      }
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
