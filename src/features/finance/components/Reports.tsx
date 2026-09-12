import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { formatCurrency, formatPercent, getMonthName } from '../utils/formatters';

type Period = 'day' | 'week' | 'month' | 'year';

export function Reports() {
  const { getDailyReport, getWeeklyReport, getMonthlyReport, getYearlyReport } = useReports();
  const [period, setPeriod] = useState<Period>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const dailyReport = useMemo(() => period === 'day' ? getDailyReport(selectedDate.toISOString().split('T')[0]) : null, [period, selectedDate]);
  const weeklyReport = useMemo(() => period === 'week' ? getWeeklyReport(selectedDate) : null, [period, selectedDate]);
  const monthlyReport = useMemo(() => period === 'month' ? getMonthlyReport(year, month) : null, [period, year, month]);
  const yearlyReport = useMemo(() => period === 'year' ? getYearlyReport(year) : null, [period, year]);

  const getPeriodTitle = () => {
    switch (period) {
      case 'day':
        return selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      case 'week': {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
      case 'month':
        return `${getMonthName(month)} ${year}`;
      case 'year':
        return `${year} год`;
      default:
        return '';
    }
  };

  // Общие данные для отображения
  const income = dailyReport?.income ?? weeklyReport?.income ?? monthlyReport?.income ?? yearlyReport?.income ?? 0;
  const expense = dailyReport?.expense ?? weeklyReport?.expense ?? monthlyReport?.expense ?? yearlyReport?.expense ?? 0;
  const balance = dailyReport?.balance ?? weeklyReport?.balance ?? monthlyReport?.balance ?? yearlyReport?.balance ?? 0;
  const count = dailyReport?.count ?? weeklyReport?.count ?? monthlyReport?.count ?? 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Отчёты</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Финансовая аналитика
          </p>
        </div>
      </div>

      {/* Period selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {p === 'day' ? 'День' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type={period === 'year' ? 'number' : period === 'month' ? 'month' : 'date'}
              value={
                period === 'year'
                  ? year
                  : period === 'month'
                  ? `${year}-${String(month + 1).padStart(2, '0')}`
                  : selectedDate.toISOString().split('T')[0]
              }
              onChange={(e) => {
                if (period === 'year') {
                  setSelectedDate(new Date(Number(e.target.value), 0, 1));
                } else {
                  setSelectedDate(new Date(e.target.value));
                }
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            />
          </div>
        </div>
        <div className="mt-3 text-lg font-semibold text-gray-800 dark:text-white">
          {getPeriodTitle()}
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Доходы</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {formatCurrency(income)}
          </div>
          {weeklyReport && (
            <div className={`text-sm ${weeklyReport.incomeChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercent(weeklyReport.incomeChange)} к прошлому периоду
            </div>
          )}
          {monthlyReport && (
            <div className={`text-sm ${monthlyReport.incomeChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercent(monthlyReport.incomeChange)} к прошлому месяцу
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Расходы</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
            {formatCurrency(expense)}
          </div>
          {weeklyReport && (
            <div className={`text-sm ${weeklyReport.expenseChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercent(weeklyReport.expenseChange)} к прошлому периоду
            </div>
          )}
          {monthlyReport && (
            <div className={`text-sm ${monthlyReport.expenseChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatPercent(monthlyReport.expenseChange)} к прошлому месяцу
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Прибыль</span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(balance)}
          </div>
          {period !== 'year' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {count} транзакций
            </div>
          )}
        </div>
      </div>

      {/* Top clients (для месячного отчёта) */}
      {monthlyReport && monthlyReport.topClients.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Топ-5 клиентов
          </h2>
          <div className="space-y-3">
            {monthlyReport.topClients.map((client, index) => (
              <div key={client.clientId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 dark:text-white">{client.clientName}</span>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(client.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly chart (для годового отчёта) */}
      {yearlyReport && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Помесячная динамика
          </h2>
          <div className="space-y-2">
            {yearlyReport.monthlyData.map((monthData) => {
              const maxIncome = Math.max(...yearlyReport.monthlyData.map(m => m.income), 1);
              const maxExpense = Math.max(...yearlyReport.monthlyData.map(m => m.expense), 1);
              return (
                <div key={monthData.month} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                    {getMonthName(monthData.month).slice(0, 3)}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <div
                      className="h-6 bg-green-500 dark:bg-green-600 rounded"
                      style={{ width: `${(monthData.income / maxIncome) * 100}%` }}
                      title={`Доходы: ${formatCurrency(monthData.income)}`}
                    />
                    <div
                      className="h-6 bg-red-500 dark:bg-red-600 rounded"
                      style={{ width: `${(monthData.expense / maxExpense) * 100}%` }}
                      title={`Расходы: ${formatCurrency(monthData.expense)}`}
                    />
                  </div>
                  <div className="w-32 text-right text-sm font-medium text-gray-800 dark:text-white">
                    {formatCurrency(monthData.balance)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Доходы</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Расходы</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
