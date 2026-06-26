import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
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
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-border dark:border-border-dark">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary">FisioTrack</h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">Gestão para Fisioterapia</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-text dark:hover:text-slate-100'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-text dark:hover:text-slate-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8 pb-32">
        <Outlet />
      </main>

      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
