import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './Footer';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
              <img src="/images/logo-full.svg" alt="FisioTrack" className="h-10" />
            </Link>

            {/* Desktop nav */}
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
              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 -mr-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          {menuOpen && (
            <nav className="md:hidden pb-4 border-t border-border dark:border-border-dark pt-3">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
}
