import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut, Settings, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import api from '../lib/api';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './Footer';
import ReviewModal from './ReviewModal';
import SubscriptionBadge from './SubscriptionBadge';
import { useReview } from '../hooks/useReview';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    showModal,
    canReview,
    submitReview,
    dismissReview,
    closeLater,
    openModal,
  } = useReview();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const plan = user.plan || 'FREE';

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.patients'), href: '/patients', icon: Users },
    { name: t('nav.treatments'), href: '/treatments', icon: Activity },
  ];

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue with local logout even if API call fails
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
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

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white dark:bg-slate-800 border-b border-border dark:border-border-dark px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100"
          aria-label={t('navigation.main')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/images/logo-icon.svg" alt="" className="w-8 h-8" aria-hidden="true" />
          <span className="text-lg font-bold text-primary">FisioTrack</span>
        </Link>
        <div className="w-10" />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label={t('navigation.main')}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-border dark:border-border-dark transition-transform duration-300',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo-icon.svg" alt="" className="w-10 h-10" aria-hidden="true" />
              <div>
                <span className="text-xl font-bold text-primary">FisioTrack</span>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">Gestão para Fisioterapia</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100"
              aria-label={t('navigation.closeMenu')}
            >
              <X className="w-5 h-5" />
            </button>
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

          <div className="mx-4 mb-4">
            <SubscriptionBadge plan={plan} />
          </div>

          <div className="p-4 border-t border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link
              to="/settings"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-text dark:hover:text-slate-100 transition-colors mb-2"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              {t('nav.settings')}
            </Link>
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

      {/* Main content */}
      <main id="main-content" className="pt-14 px-4 pb-8 md:ml-64 md:px-8 md:pt-0 md:pb-8">
        {children || <Outlet />}
      </main>

      <div className="md:ml-64">
        <Footer onReviewClick={openModal} canReview={canReview} />
      </div>

      {showModal && (
        <ReviewModal
          onSubmit={submitReview}
          onDismiss={dismissReview}
          onLater={closeLater}
        />
      )}
    </div>
  );
}
