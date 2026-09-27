import { Link } from 'react-router-dom';
import { UserProfile } from '../../profile/types';
import { getContractorLines, hasContractorData } from '../utils/autoFillProfile';

interface ContractorBlockProps {
  profile: UserProfile | null | undefined;
  /** Дополнительный текст после строки с названием (например " — Заказчик выполняет монтаж") */
  suffix?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * Блок «Исполнитель» для предпросмотра документов.
 * Данные берутся из профиля пользователя (Настройки → Профиль):
 * companyName, inn, position, fullName, phone, address.
 * Пустые поля отображаются прочерками "_______".
 */
export function ContractorBlock({ profile, suffix, className = '', titleClassName = 'text-sm text-gray-600 dark:text-gray-400 mb-1' }: ContractorBlockProps) {
  const lines = getContractorLines(profile);
  return (
    <div className={className}>
      <p className={titleClassName}>Исполнитель:</p>
      <p className="text-gray-800 dark:text-white">
        {lines[0]}
        {suffix ? <span className="text-gray-600 dark:text-gray-400"> {suffix}</span> : null}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lines[1]}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{lines[2]}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{lines[3]}</p>
    </div>
  );
}

/**
 * Плашка-предупреждение: профиль не заполнен — данные не подставятся в документы.
 */
export function ProfileWarningBanner() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg mb-4 print:hidden">
      <p className="text-sm text-yellow-800 dark:text-yellow-300">
        💡 Заполните данные в разделе{' '}
        <Link to="/settings" className="font-semibold underline hover:text-yellow-900 dark:hover:text-yellow-200">
          Настройки → Профиль
        </Link>
        , чтобы они автоматически подставлялись в документы (блок «Исполнитель»).
      </p>
    </div>
  );
}

/** Показывать предупреждение, если профиль пуст */
export const shouldShowProfileWarning = (profile: UserProfile | null | undefined): boolean =>
  !hasContractorData(profile) && !(profile?.companyName || profile?.inn);
