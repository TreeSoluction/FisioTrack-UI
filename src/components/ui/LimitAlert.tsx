import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface LimitAlertProps {
  current: number;
  max: number;
}

export default function LimitAlert({ current, max }: LimitAlertProps) {
  const { t } = useTranslation();
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;

  if (!isNearLimit) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-warning">
            {t('limits.patientsReached')}
          </p>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
            {t('limits.currentUsage')}: {current} {t('limits.of')} {max}
          </p>
          <div className="w-full bg-warning/20 rounded-full h-2 mt-2">
            <div
              className="bg-warning h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark mt-2"
          >
            {t('limits.upgradeToPro')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
