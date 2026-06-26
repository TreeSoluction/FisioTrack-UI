import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './Footer';

export default function PublicLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: t('auth.login'), href: '/login' },
    { name: t('auth.register'), href: '/register' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark">
      <header className="bg-white dark:bg-slate-800 border-b border-border dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">FisioTrack</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
