import { Link } from 'react-router-dom';
import { Crown, Zap } from 'lucide-react';

interface SubscriptionBadgeProps {
  plan: string;
}

export default function SubscriptionBadge({ plan }: SubscriptionBadgeProps) {
  const isPro = plan === 'PRO';

  return (
    <Link
      to={isPro ? '/settings' : '/pricing'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        isPro
          ? 'bg-gradient-to-r from-primary to-secondary text-white'
          : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}
    >
      {isPro ? (
        <>
          <Crown className="w-3 h-3" />
          PRO
        </>
      ) : (
        <>
          <Zap className="w-3 h-3" />
          Upgrade
        </>
      )}
    </Link>
  );
}
