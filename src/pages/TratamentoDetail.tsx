import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Activity, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Tratamento, Sessao } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TratamentoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tratamento, setTratamento] = useState<Tratamento | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const response = await api.get(`/tratamentos/${id}`);
      setTratamento(response.data);
      setSessoes(response.data.sessoes || []);
    } catch (error) {
      console.error('Erro ao carregar tratamento:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Carregando...</div>
      </div>
    );
  }

  if (!tratamento) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted">Tratamento não encontrado</p>
      </div>
    );
  }

  const statusColors = {
    EM_ANDAMENTO: 'bg-success/10 text-success',
    PAUSADO: 'bg-warning/10 text-warning',
    CONCLUIDO: 'bg-slate-100 text-text-muted',
  };

  const statusLabels = {
    EM_ANDAMENTO: 'Em andamento',
    PAUSADO: 'Pausado',
    CONCLUIDO: 'Concluído',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-text-muted hover:text-text hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">
            Tratamento - {tratamento.paciente?.nome || 'Paciente'}
          </h1>
          <p className="text-text-muted">{tratamento.tempoEstimado}</p>
        </div>
        <Link to={`/sessoes/novo?tratamentoId=${id}`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Sessão
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-muted">Sessões</p>
              <p className="text-xl font-bold text-text">{sessoes.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-text-muted">Dor Média</p>
              <p className="text-xl font-bold text-text">
                {sessoes.length
                  ? (sessoes.reduce((acc, s) => acc + s.escalaDor, 0) / sessoes.length).toFixed(1)
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-text-muted">Peso Atual</p>
              <p className="text-xl font-bold text-text">
                {sessoes.length && sessoes[sessoes.length - 1].peso
                  ? `${sessoes[sessoes.length - 1].peso} kg`
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-text-muted">Valor</p>
              <p className="text-xl font-bold text-text">
                R$ {Number(tratamento.valor).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Informações</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-text-muted">Paciente</dt>
              <dd className="text-text">{tratamento.paciente?.nome || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Tempo Estimado</dt>
              <dd className="text-text">{tratamento.tempoEstimado}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Data de Início</dt>
              <dd className="text-text">
                {tratamento.dataInicio
                  ? format(new Date(tratamento.dataInicio), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Status</dt>
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
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-text-muted mb-1">Exercícios</p>
            <p className="text-text whitespace-pre-wrap">{tratamento.exercicios}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Sessões</h2>
            <Link to={`/sessoes/novo?tratamentoId=${id}`}>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nova
              </Button>
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessoes.map((sessao) => (
              <div
                key={sessao.id}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text">
                    {format(new Date(sessao.data), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sessao.escalaDor <= 3
                        ? 'bg-success/10 text-success'
                        : sessao.escalaDor <= 6
                        ? 'bg-warning/10 text-warning'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    Dor: {sessao.escalaDor}/10
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-text-muted">
                  {sessao.peso && <span>Peso: {sessao.peso} kg</span>}
                  {sessao.medidas && (
                    <span>
                      Medidas:{' '}
                      {Object.entries(sessao.medidas)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </span>
                  )}
                </div>
                {sessao.observacoes && (
                  <p className="mt-2 text-sm text-text-muted">{sessao.observacoes}</p>
                )}
              </div>
            ))}
            {sessoes.length === 0 && (
              <p className="text-center text-text-muted py-4">
                Nenhuma sessão registrada
              </p>
            )}
          </div>
        </Card>
      </div>

      {sessoes.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Evolução da Dor</h2>
          <div className="h-64 flex items-end gap-2">
            {sessoes.map((sessao) => (
              <div
                key={sessao.id}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-secondary/20 rounded-t"
                  style={{ height: `${(sessao.escalaDor / 10) * 200}px` }}
                >
                  <div
                    className="w-full bg-secondary rounded-t"
                    style={{ height: `${(sessao.escalaDor / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {format(new Date(sessao.data), 'dd/MM')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}