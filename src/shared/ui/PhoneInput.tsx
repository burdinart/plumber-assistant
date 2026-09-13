import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, error, label, required }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(formatPhoneValue(value));
  }, [value]);

  const formatPhoneValue = (phone: string): string => {
    // Убираем все кроме цифр
    let digits = phone.replace(/\D/g, '');

    // Если начинается с 8, заменяем на 7
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }

    // Если не начинается с 7, добавляем 7
    if (!digits.startsWith('7') && digits.length > 0) {
      digits = '7' + digits;
    }

    // Ограничиваем до 11 цифр
    digits = digits.slice(0, 11);

    // Форматируем
    let formatted = '+7';
    if (digits.length > 1) {
      formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 5) {
      formatted += `) ${digits.slice(4, 7)}`;
    }
    if (digits.length >= 8) {
      formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length >= 10) {
      formatted += `-${digits.slice(9, 11)}`;
    }

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Убираем все кроме цифр и +
    let digits = inputValue.replace(/[^\d+]/g, '');
    
    // Убираем + если он не в начале
    if (digits.indexOf('+') > 0) {
      digits = digits.replace(/\+/g, '');
    }

    // Если начинается с +, убираем его для обработки
    if (digits.startsWith('+')) {
      digits = digits.slice(1);
    }

    // Форматируем и устанавливаем значение
    const formatted = formatPhoneValue(digits);
    setDisplayValue(formatted);
    
    // Передаем в onChange только цифры
    const cleanDigits = formatted.replace(/\D/g, '');
    onChange(cleanDigits.length > 0 ? '+' + cleanDigits : '');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="+7 (___) ___-__-__"
          className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
}
