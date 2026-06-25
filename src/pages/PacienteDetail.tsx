import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Activity, Calendar, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../lib/api';
import type { Paciente, Tratamento, DashboardData } from '../types';

export default function PacienteDetail() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [pacienteRes, tratamentosRes, dashboardRes] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get('/tratamentos'),
        api.get(`/sessoes/dashboard/${id}`),
      ]);
      setPaciente(pacienteRes.data);
      setTratamentos(
        tratamentosRes.data.filter((t: Tratamento) => t.paciente?.id === id)
      );
      setDashboardData(dashboardRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  if (!paciente) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted">Paciente não encontrado</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Sessões',
      value: dashboardData.length,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      label: 'Dor Média',
      value: dashboardData.length
        ? (dashboardData.reduce((acc, d) => acc + d.escalaDor, 0) / dashboardData.length).toFixed(1)
        : '-',
      icon: Activity,
      color: 'text-secondary',
    },
    {
      label: 'Peso Atual',
      value: dashboardData.length
        ? `${dashboardData[dashboardData.length - 1].peso || '-'} kg`
        : '-',
      icon: TrendingUp,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/pacientes"
          className="p-2 text-text-muted hover:text-text hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">{paciente.nome}</h1>
          <p className="text-text-muted">{paciente.cpf}</p>
        </div>
        <Link to={`/tratamentos/novo?pacienteId=${id}`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tratamento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-sm text-text-muted">{stat.label}</p>
                <p className="text-xl font-bold text-text">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Informações</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-text-muted">Telefone</dt>
              <dd className="text-text">{paciente.telefone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Email</dt>
              <dd className="text-text">{paciente.email || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Endereço</dt>
              <dd className="text-text">{paciente.endereco || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Status</dt>
              <dd>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    paciente.status === 'ATIVO'
                      ? 'bg-success/10 text-success'
                      : 'bg-slate-100 text-text-muted'
                  }`}
                >
                  {paciente.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                </span>
              </dd>
            </div>
          </dl>
          {paciente.historico && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-text-muted mb-1">Histórico</p>
              <p className="text-text">{paciente.historico}</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Tratamentos</h2>
          <div className="space-y-3">
            {tratamentos.map((tratamento) => (
              <Link
                key={tratamento.id}
                to={`/tratamentos/${tratamento.id}`}
                className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">{tratamento.tempoEstimado}</p>
                    <p className="text-sm text-text-muted">
                      {tratamento._count?.sessoes || 0} sessões
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      R$ {Number(tratamento.valor).toLocaleString('pt-BR')}
                    </p>
                    <span
                      className={`text-xs ${
                        tratamento.status === 'EM_ANDAMENTO'
                          ? 'text-success'
                          : tratamento.status === 'PAUSADO'
                          ? 'text-warning'
                          : 'text-text-muted'
                      }`}
                    >
                      {tratamento.status === 'EM_ANDAMENTO'
                        ? 'Em andamento'
                        : tratamento.status === 'PAUSADO'
                        ? 'Pausado'
                        : 'Concluído'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {tratamentos.length === 0 && (
              <p className="text-center text-text-muted py-4">
                Nenhum tratamento registrado
              </p>
            )}
          </div>
        </Card>
      </div>

      {dashboardData.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Evolução da Dor</h2>
          <div className="h-64 flex items-end gap-2">
            {dashboardData.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-secondary/20 rounded-t"
                  style={{ height: `${(data.escalaDor / 10) * 200}px` }}
                >
                  <div
                    className="w-full bg-secondary rounded-t"
                    style={{ height: `${(data.escalaDor / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {new Date(data.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}