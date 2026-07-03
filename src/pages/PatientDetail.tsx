import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Activity, Calendar, TrendingUp, Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import api from '../lib/api';
import type { Patient, Treatment, SessionWithTreatment, MetricDefinition } from '../types';

export default function PacienteDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [tratamentos, setTratamentos] = useState<Treatment[]>([]);
  const [sessions, setSessions] = useState<SessionWithTreatment[]>([]);
  const [metricDefinitions, setMetricDefinitions] = useState<MetricDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setError(null);
      setLoading(true);
      const [pacienteRes, tratamentosRes, historyRes] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get('/treatments'),
        api.get(`/patients/${id}/history`),
      ]);
      setPaciente(pacienteRes.data);
      setTratamentos(
        tratamentosRes.data.items.filter((t: Treatment) => t.patient?.id === id)
      );
      setSessions(historyRes.data.sessions);
      setMetricDefinitions(historyRes.data.metricDefinitions);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.errorLoadingPatientData'));
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(format: 'csv' | 'pdf') {
    setExporting(true);
    try {
      if (format === 'csv') {
        const response = await api.get(`/patients/${id}/export?format=csv`, { responseType: 'blob' });
        const blob = new Blob([response.data.csv || response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.data.filename || `historico-${paciente?.name}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t('history.exportCsv') + ' OK');
      } else {
        generatePdf();
      }
    } catch (err) {
      toast.error(t('common.error'));
    } finally {
      setExporting(false);
    }
  }

  function generatePdf() {
    const rows = sessions.map((s) => {
      const measurements = (s.measurements as Record<string, any>) || {};
      return {
        date: new Date(s.date).toLocaleDateString('pt-BR'),
        pain: s.painScale,
        weight: s.weight ?? '-',
        notes: s.notes ?? '',
        metrics: metricDefinitions.map((m) => ({
          name: m.name,
          value: measurements[m.id]?.value ?? '-',
        })),
      };
    });

    const metricHeaders = metricDefinitions.map((m) => m.name).join(' | ');
    const header = `Data | Dor | Peso${metricHeaders ? ' | ' + metricHeaders : ''} | Notas`;
    const lines = rows.map((r) =>
      `${r.date} | ${r.pain} | ${r.weight}${r.metrics.length ? ' | ' + r.metrics.map((m) => m.value).join(' | ') : ''} | ${r.notes}`
    );

    const content = `${t('history.title')}: ${paciente?.name}\n${'='.repeat(60)}\n\n${header}\n${'-'.repeat(60)}\n${lines.join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-${paciente?.name?.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      value: sessions.length,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      label: t('treatments.pain'),
      value: sessions.length
        ? (sessions.reduce((acc, s) => acc + s.painScale, 0) / sessions.length).toFixed(1)
        : '-',
      icon: Activity,
      color: 'text-secondary',
    },
    {
      label: t('treatments.weight'),
      value: sessions.length
        ? `${sessions.find((s) => s.weight)?.weight || '-'} kg`
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => handleExport('csv')}
            disabled={exporting || sessions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('history.exportCsv')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleExport('pdf')}
            disabled={exporting || sessions.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('history.exportPdf')}
          </Button>
          <Link to={`/treatments/new?patientId=${id}`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('patients.newTreatment')}
            </Button>
          </Link>
        </div>
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

      {/* Patient Info + Treatments */}
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

      {/* Session History Timeline */}
      {sessions.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('history.title')}</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {sessions.map((session) => {
              const measurements = (session.measurements as Record<string, any>) || {};
              return (
                <div key={session.id} className="flex gap-4 p-4 rounded-lg border border-border dark:border-border-dark">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-lg font-bold text-secondary">{session.painScale}</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark">{t('history.pain')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text dark:text-slate-100">
                        {new Date(session.date).toLocaleDateString('pt-BR')}
                      </span>
                      {session.weight && (
                        <span className="text-xs text-text-muted dark:text-text-muted-dark">
                          · {session.weight} kg
                        </span>
                      )}
                      <span className="text-xs text-text-muted dark:text-text-muted-dark">
                        · {session.treatment.estimatedTime}
                      </span>
                    </div>
                    {metricDefinitions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {metricDefinitions.map((m) => {
                          const entry = measurements[m.id];
                          if (!entry) return null;
                          return (
                            <span key={m.id} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-text dark:text-slate-300">
                              {m.name}: {entry.value}{m.unit ? ` ${m.unit}` : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {session.notes && (
                      <p className="text-sm text-text-muted dark:text-text-muted-dark mt-2">{session.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {sessions.length === 0 && !loading && (
        <Card>
          <p className="text-center text-text-muted dark:text-text-muted-dark py-8">
            {t('history.noHistory')}
          </p>
        </Card>
      )}
    </div>
  );
}
