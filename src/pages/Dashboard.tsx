import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import api from '../lib/api';
import type { Patient, Treatment } from '../types';

export default function Dashboard() {
  const { t } = useTranslation();
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [tratamentos, setTratamentos] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pacientesRes, tratamentosRes] = await Promise.all([
          api.get('/patients'),
          api.get('/treatments'),
        ]);
        setPacientes(pacientesRes.data);
        setTratamentos(tratamentosRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    {
      label: t('dashboard.activePatients'),
      value: pacientes.filter(p => p.status === 'ACTIVE').length,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: t('dashboard.activeTreatments'),
      value: tratamentos.filter(t => t.status === 'IN_PROGRESS').length,
      icon: Activity,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: t('dashboard.totalSessions'),
      value: tratamentos.reduce((acc, t) => acc + (t._count?.sessions || 0), 0),
      icon: Calendar,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: t('dashboard.monthlyRevenue'),
      value: 'R$ ' + tratamentos
        .filter(t => t.status === 'IN_PROGRESS')
        .reduce((acc, t) => acc + Number(t.value), 0)
        .toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted dark:text-text-muted-dark">{t('common.loading')}</div>
      </div>
    );
  }

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
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('dashboard.recentPatients')}</h2>
          <div className="space-y-3">
            {pacientes.slice(0, 5).map((paciente) => (
              <Link
                key={paciente.id}
                to={`/patients/${paciente.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-text dark:text-slate-100">{paciente.name}</p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">{paciente.cpf}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    paciente.status === 'ACTIVE'
                      ? 'bg-success/10 text-success'
                      : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark'
                  }`}
                >
                  {paciente.status === 'ACTIVE' ? t('patients.active') : t('patients.inactive')}
                </span>
              </Link>
            ))}
            {pacientes.length === 0 && (
              <p className="text-center text-text-muted dark:text-text-muted-dark py-4">
                {t('dashboard.noData')}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('dashboard.activeTreatmentsTitle')}</h2>
          <div className="space-y-3">
            {tratamentos
              .filter((t) => t.status === 'IN_PROGRESS')
              .slice(0, 5)
              .map((tratamento) => (
                <Link
                  key={tratamento.id}
                  to={`/treatments/${tratamento.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div>
                    <p className="font-medium text-text dark:text-slate-100">
                      {tratamento.patient?.name || t('dashboard.patient')}
                    </p>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">
                      {tratamento.estimatedTime} • {tratamento._count?.sessions || 0} {t('dashboard.sessions')}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    R$ {Number(tratamento.value).toLocaleString('pt-BR')}
                  </span>
                </Link>
              ))}
            {tratamentos.filter((t) => t.status === 'IN_PROGRESS').length === 0 && (
              <p className="text-center text-text-muted dark:text-text-muted-dark py-4">
                {t('dashboard.noActiveTreatments')}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
