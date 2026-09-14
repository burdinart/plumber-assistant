import { APP_VERSION, CHANGELOG, ChangelogEntry } from '../../../version';
import { Wrench, Calendar, Clock, GitBranch, Github, ExternalLink } from 'lucide-react';

/**
 * Страница "О приложении" с информацией о версии и историей изменений
 */
export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Помощник Сантехника</h1>
          <p className="text-gray-400">Профессиональные инструменты для сантехников</p>
        </div>

        {/* Информация о версии */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            Текущая версия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Версия</div>
              <div className="text-2xl font-bold text-blue-400">v{APP_VERSION.version}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Дата сборки
              </div>
              <div className="text-lg font-semibold">{APP_VERSION.buildDate}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Время
              </div>
              <div className="text-lg font-semibold">{APP_VERSION.buildTime}</div>
            </div>
          </div>
        </div>

        {/* Ссылки */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ссылки</h2>
          <div className="space-y-3">
            <a
              href="https://github.com/burdinart/plumber-assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub репозиторий</span>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>
            <a
              href="https://burdinart.github.io/plumber-assistant/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>GitHub Pages (опубликованная версия)</span>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>
          </div>
        </div>

        {/* История изменений */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">История изменений</h2>
          <div className="space-y-6">
            {CHANGELOG.map((release: ChangelogEntry) => (
              <div key={release.version} className="border-l-2 border-blue-500 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    v{release.version}
                  </span>
                  <span className="text-gray-400 text-sm">{release.date}</span>
                </div>
                <ul className="space-y-2">
                  {release.changes.map((change: string, i: number) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Футер */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Сделано с ❤️ для сантехников</p>
          <p className="mt-1">© 2026 Помощник Сантехника</p>
        </div>
      </div>
    </div>
  );
};
