import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Activity, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import api from '../lib/api';
import type { Patient, Treatment, DashboardData } from '../types';

export default function PacienteDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [tratamentos, setTratamentos] = useState<Treatment[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setError(null);
      setLoading(true);
      const [pacienteRes, tratamentosRes, dashboardRes] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get('/treatments'),
        api.get(`/sessions/dashboard/${id}`),
      ]);
      setPaciente(pacienteRes.data);
      setTratamentos(
        tratamentosRes.data.filter((t: Treatment) => t.patient?.id === id)
      );
      setDashboardData(dashboardRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do paciente.');
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/patients" className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="p-2"><ArrowLeft className="w-5 h-5 text-text-muted" /></div>
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonText className="w-48 h-8" />
            <SkeletonText className="w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted dark:text-text-muted-dark">{t('patients.notFound')}</p>
      </div>
    );
  }

  const stats = [
    {
      label: t('treatments.sessions'),
      value: dashboardData.length,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      label: t('treatments.pain'),
      value: dashboardData.length
        ? (dashboardData.reduce((acc, d) => acc + d.painScale, 0) / dashboardData.length).toFixed(1)
        : '-',
      icon: Activity,
      color: 'text-secondary',
    },
    {
      label: t('treatments.weight'),
      value: dashboardData.length
        ? `${dashboardData[dashboardData.length - 1].weight || '-'} kg`
        : '-',
      icon: TrendingUp,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/patients"
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-text dark:text-slate-100 truncate">{paciente.name}</h1>
          <p className="text-text-muted dark:text-text-muted-dark">{paciente.cpf}</p>
        </div>
        <Link to={`/treatments/new?patientId=${id}`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('patients.newTreatment')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">{stat.label}</p>
                <p className="text-xl font-bold text-text dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('patients.info')}</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('patients.phoneLabel')}</dt>
              <dd className="text-text dark:text-slate-100">{paciente.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('patients.emailLabel')}</dt>
              <dd className="text-text dark:text-slate-100">{paciente.email || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('patients.addressLabel')}</dt>
              <dd className="text-text dark:text-slate-100">{paciente.address || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('patients.status')}</dt>
              <dd>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    paciente.status === 'ACTIVE'
                      ? 'bg-success/10 text-success'
                      : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark'
                  }`}
                >
                  {paciente.status === 'ACTIVE' ? t('patients.active') : t('patients.inactive')}
                </span>
              </dd>
            </div>
          </dl>
          {paciente.medicalHistory && (
            <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
              <p className="text-sm text-text-muted dark:text-text-muted-dark mb-1">{t('patients.history')}</p>
              <p className="text-text dark:text-slate-100">{paciente.medicalHistory}</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('nav.treatments')}</h2>
          <div className="space-y-3">
            {tratamentos.map((tratamento) => (
              <Link
                key={tratamento.id}
                to={`/treatments/${tratamento.id}`}
                className="block p-3 rounded-lg border border-border dark:border-border-dark hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text dark:text-slate-100">{tratamento.estimatedTime}</p>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">
                      {tratamento._count?.sessions || 0} {t('dashboard.sessions')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      R$ {Number(tratamento.value).toLocaleString('pt-BR')}
                    </p>
                    <span
                      className={`text-xs ${
                        tratamento.status === 'IN_PROGRESS'
                          ? 'text-success'
                          : tratamento.status === 'PAUSED'
                          ? 'text-warning'
                          : 'text-text-muted dark:text-text-muted-dark'
                      }`}
                    >
                      {tratamento.status === 'IN_PROGRESS'
                        ? t('treatments.inProgress')
                        : tratamento.status === 'PAUSED'
                        ? t('treatments.paused')
                        : t('treatments.completed')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {tratamentos.length === 0 && (
              <p className="text-center text-text-muted dark:text-text-muted-dark py-4">
                {t('treatments.noData')}
              </p>
            )}
          </div>
        </Card>
      </div>

      {dashboardData.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">Evolução da Dor</h2>
          <div className="h-64 flex items-end gap-2">
            {dashboardData.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-secondary/20 rounded-t"
                  style={{ height: `${(data.painScale / 10) * 200}px` }}
                >
                  <div
                    className="w-full bg-secondary rounded-t"
                    style={{ height: `${(data.painScale / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
