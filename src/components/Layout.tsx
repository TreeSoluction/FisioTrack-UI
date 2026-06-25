import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Tratamentos', href: '/tratamentos', icon: Activity },
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary">FisioTrack</h1>
            <p className="text-xs text-text-muted">Gestão para Fisioterapia</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-slate-50 hover:text-text'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-slate-50 hover:text-text transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}