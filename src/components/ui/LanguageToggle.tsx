import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isPtBr = i18n.language === 'pt-BR';

  function toggle() {
    i18n.changeLanguage(isPtBr ? 'en' : 'pt-BR');
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      title={isPtBr ? 'Switch to English' : 'Mudar para Português'}
    >
      <Globe className="w-4 h-4" />
      {isPtBr ? 'PT-BR' : 'EN'}
    </button>
  );
}
