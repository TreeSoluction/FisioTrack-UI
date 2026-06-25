import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import api from '../lib/api';
import type { Paciente, Tratamento } from '../types';

export default function Dashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pacientesRes, tratamentosRes] = await Promise.all([
          api.get('/pacientes'),
          api.get('/tratamentos'),
        ]);
        setPacientes(pacientesRes.data);
        setTratamentos(tratamentosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    {
      label: 'Pacientes Ativos',
      value: pacientes.filter(p => p.status === 'ATIVO').length,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Tratamentos em Andamento',
      value: tratamentos.filter(t => t.status === 'EM_ANDAMENTO').length,
      icon: Activity,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Total de Sessões',
      value: tratamentos.reduce((acc, t) => acc + (t._count?.sessoes || 0), 0),
      icon: Calendar,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Receita Mensal',
      value: 'R$ ' + tratamentos
        .filter(t => t.status === 'EM_ANDAMENTO')
        .reduce((acc, t) => acc + Number(t.valor), 0)
        .toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <Link
          to="/pacientes/novo"
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          + Novo Paciente
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
                <p className="text-sm text-text-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Pacientes Recentes</h2>
          <div className="space-y-3">
            {pacientes.slice(0, 5).map((paciente) => (
              <Link
                key={paciente.id}
                to={`/pacientes/${paciente.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-text">{paciente.nome}</p>
                  <p className="text-sm text-text-muted">{paciente.cpf}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    paciente.status === 'ATIVO'
                      ? 'bg-success/10 text-success'
                      : 'bg-slate-100 text-text-muted'
                  }`}
                >
                  {paciente.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                </span>
              </Link>
            ))}
            {pacientes.length === 0 && (
              <p className="text-center text-text-muted py-4">
                Nenhum paciente cadastrado
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text mb-4">Tratamentos Ativos</h2>
          <div className="space-y-3">
            {tratamentos
              .filter((t) => t.status === 'EM_ANDAMENTO')
              .slice(0, 5)
              .map((tratamento) => (
                <Link
                  key={tratamento.id}
                  to={`/tratamentos/${tratamento.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-text">
                      {tratamento.paciente?.nome || 'Paciente'}
                    </p>
                    <p className="text-sm text-text-muted">
                      {tratamento.tempoEstimado} • {tratamento._count?.sessoes || 0} sessões
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    R$ {Number(tratamento.valor).toLocaleString('pt-BR')}
                  </span>
                </Link>
              ))}
            {tratamentos.filter((t) => t.status === 'EM_ANDAMENTO').length === 0 && (
              <p className="text-center text-text-muted py-4">
                Nenhum tratamento em andamento
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}