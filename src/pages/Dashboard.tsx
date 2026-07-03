import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';

const Chart = lazy(() => import('../components/ui/Chart'));

const CHART_COLORS = {
  primary: '#0891B2',
  secondary: '#7C3AED',
};

interface DashboardData {
  activePatients: number;
  activeTreatments: number;
  totalSessions: number;
  monthlyRevenue: number;
  sessionsChartData: Array<{ name: string; value: number }>;
  treatmentChartData: Array<{ name: string; value: number }>;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/sessions/summary');
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('dashboard.title')}</h1>
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-2xl font-bold text-text dark:text-slate-100">{t('dashboard.title')}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border dark:border-border-dark p-6 space-y-3">
            <SkeletonText className="w-1/3 h-5" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText key={i} className="w-full" />
            ))}
          </div>
          <div className="rounded-xl border border-border dark:border-border-dark p-6 space-y-3">
            <SkeletonText className="w-1/3 h-5" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText key={i} className="w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: t('dashboard.activePatients'),
      value: data.activePatients,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: t('dashboard.activeTreatments'),
      value: data.activeTreatments,
      icon: Activity,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: t('dashboard.totalSessions'),
      value: data.totalSessions,
      icon: Calendar,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: t('dashboard.monthlyRevenue'),
      value: 'R$ ' + data.monthlyRevenue.toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">{t('dashboard.title')}</h1>
        <Link
          to="/patients/new"
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          {t('dashboard.newPatient')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">{stat.label}</p>
                <p className="text-2xl font-bold text-text dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('dashboard.sessionsPerMonth')}</h2>
          <Suspense fallback={<SkeletonCard />}>
            {data.sessionsChartData.length > 0 ? (
              <Chart data={data.sessionsChartData} type="line" color={CHART_COLORS.primary} />
            ) : (
              <EmptyState
                icon={Calendar}
                title={t('dashboard.noSessions')}
                description={t('dashboard.noSessionsDescription')}
              />
            )}
          </Suspense>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('dashboard.valuePerTreatment')}</h2>
          <Suspense fallback={<SkeletonCard />}>
            {data.treatmentChartData.length > 0 ? (
              <Chart data={data.treatmentChartData} type="bar" color={CHART_COLORS.secondary} />
            ) : (
              <EmptyState
                icon={Activity}
                title={t('dashboard.noActiveTreatments')}
                description={t('dashboard.noActiveTreatmentsDescription')}
              />
            )}
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
