import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Activity, TrendingUp, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Treatment, Session } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TratamentoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tratamento, setTratamento] = useState<Treatment | null>(null);
  const [sessoes, setSessoes] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const response = await api.get(`/treatments/${id}`);
      setTratamento(response.data);
      setSessoes(response.data.sessions || []);
    } catch (error) {
      console.error('Error loading treatment:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted dark:text-text-muted-dark">{t('common.loading')}</div>
      </div>
    );
  }

  if (!tratamento) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted dark:text-text-muted-dark">{t('treatments.notFound')}</p>
      </div>
    );
  }

  const statusColors = {
    IN_PROGRESS: 'bg-success/10 text-success',
    PAUSED: 'bg-warning/10 text-warning',
    COMPLETED: 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark',
  };

  const statusLabels = {
    IN_PROGRESS: t('treatments.inProgress'),
    PAUSED: t('treatments.paused'),
    COMPLETED: t('treatments.completed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-text dark:text-slate-100 truncate">
            {t('nav.treatments')} - {tratamento.patient?.name || t('treatments.patient')}
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark">{tratamento.estimatedTime}</p>
        </div>
        <Link to={`/sessions/new?treatmentId=${id}`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('treatments.newSession')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('treatments.sessions')}</p>
              <p className="text-xl font-bold text-text dark:text-slate-100">{sessoes.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('treatments.pain')}</p>
              <p className="text-xl font-bold text-text dark:text-slate-100">
                {sessoes.length
                  ? (sessoes.reduce((acc, s) => acc + s.painScale, 0) / sessoes.length).toFixed(1)
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('treatments.weight')}</p>
              <p className="text-xl font-bold text-text dark:text-slate-100">
                {sessoes.length && sessoes[sessoes.length - 1].weight
                  ? `${sessoes[sessoes.length - 1].weight} kg`
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{t('treatments.valueLabel')}</p>
              <p className="text-xl font-bold text-text dark:text-slate-100">
                R$ {Number(tratamento.value).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">{t('treatments.info')}</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('treatments.patient')}</dt>
              <dd className="text-text dark:text-slate-100">{tratamento.patient?.name || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('treatments.estimatedTime')}</dt>
              <dd className="text-text dark:text-slate-100">{tratamento.estimatedTime}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('treatments.startDate')}</dt>
              <dd className="text-text dark:text-slate-100">
                {tratamento.startDate
                  ? format(new Date(tratamento.startDate), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted dark:text-text-muted-dark">{t('treatments.status')}</dt>
              <dd>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[tratamento.status]
                  }`}
                >
                  {statusLabels[tratamento.status]}
                </span>
              </dd>
            </div>
          </dl>
          <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-1">{t('treatments.exercises')}</p>
            <p className="text-text dark:text-slate-100 whitespace-pre-wrap">{tratamento.exercises}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text dark:text-slate-100">{t('treatments.sessions')}</h2>
            <Link to={`/sessions/new?treatmentId=${id}`}>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                {t('treatments.newSession')}
              </Button>
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessoes.map((sessao) => (
              <div
                key={sessao.id}
                className="p-3 rounded-lg border border-border dark:border-border-dark hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text dark:text-slate-100">
                    {format(new Date(sessao.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sessao.painScale <= 3
                        ? 'bg-success/10 text-success'
                        : sessao.painScale <= 6
                        ? 'bg-warning/10 text-warning'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {t('treatments.pain')}: {sessao.painScale}/10
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-text-muted dark:text-text-muted-dark">
                  {sessao.weight && <span>{t('sessions.weight')}: {sessao.weight} kg</span>}
                  {sessao.measurements && (
                    <span>
                      {t('treatments.measures')}:{' '}
                      {Object.entries(sessao.measurements)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </span>
                  )}
                </div>
                {sessao.notes && (
                  <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark">{sessao.notes}</p>
                )}
              </div>
            ))}
            {sessoes.length === 0 && (
              <p className="text-center text-text-muted dark:text-text-muted-dark py-4">
                {t('sessions.noSession')}
              </p>
            )}
          </div>
        </Card>
      </div>

      {sessoes.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text dark:text-slate-100 mb-4">Evolução da Dor</h2>
          <div className="h-64 flex items-end gap-2">
            {sessoes.map((sessao) => (
              <div
                key={sessao.id}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-secondary/20 rounded-t"
                  style={{ height: `${(sessao.painScale / 10) * 200}px` }}
                >
                  <div
                    className="w-full bg-secondary rounded-t"
                    style={{ height: `${(sessao.painScale / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {format(new Date(sessao.date), 'dd/MM')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
