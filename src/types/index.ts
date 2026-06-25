export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'FISIOTERAPEUTA';
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email?: string;
  endereco?: string;
  historico?: string;
  status: 'ATIVO' | 'INATIVO';
  createdAt: string;
}

export interface Tratamento {
  id: string;
  tempoEstimado: string;
  exercicios: string;
  valor: number;
  status: 'EM_ANDAMENTO' | 'PAUSADO' | 'CONCLUIDO';
  dataInicio: string;
  dataFim?: string;
  paciente?: Paciente;
  _count?: { sessoes: number };
}

export interface Sessao {
  id: string;
  data: string;
  peso?: number;
  escalaDor: number;
  medidas?: Record<string, number>;
  observacoes?: string;
}

export interface DashboardData {
  data: string;
  peso?: number;
  escalaDor: number;
  medidas?: Record<string, number>;
}