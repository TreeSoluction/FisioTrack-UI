import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut, Crown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isFreePlan = user.plan === 'FREE' || !user.plan;

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.patients'), href: '/patients', icon: Users },
    { name: t('nav.treatments'), href: '/treatments', icon: Activity },
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        {t('common.skipToContent')}
      </a>

      <aside
        aria-label={t('navigation.main')}
        className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-border dark:border-border-dark"
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <span className="text-xl font-bold text-primary">FisioTrack</span>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">Gestão para Fisioterapia</p>
          </div>

          <nav aria-label={t('navigation.main')}>
            <ul className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-text dark:hover:text-slate-100'
                      )}
                    >
                      <item.icon className="w-5 h-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {isFreePlan && (
            <div className="mx-4 mb-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-text dark:text-slate-100">Plano Gratuito</span>
              </div>
              <Link
                to="/"
                className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-medium"
              >
                Upgrade para PRO
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="p-4 border-t border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-text dark:hover:text-slate-100 transition-colors"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      <main id="main-content" className="ml-64 p-8 pb-32">
        {children || <Outlet />}
      </main>

      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
