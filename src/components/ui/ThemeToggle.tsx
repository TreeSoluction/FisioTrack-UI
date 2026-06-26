import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
      aria-pressed={theme === 'dark'}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
