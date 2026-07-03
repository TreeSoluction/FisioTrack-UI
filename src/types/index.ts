export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'THERAPIST';
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Treatment {
  id: string;
  estimatedTime: string;
  exercises: string;
  value: number;
  status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  endDate?: string;
  patient?: Patient;
  _count?: { sessions: number };
}

export interface Session {
  id: string;
  date: string;
  weight?: number;
  painScale: number;
  measurements?: Record<string, number>;
  notes?: string;
}

export interface DashboardData {
  date: string;
  weight?: number;
  painScale: number;
  measurements?: Record<string, number>;
}

export interface MetricDefinition {
  id: string;
  name: string;
  type: 'NUMBER' | 'TEXT';
  unit?: string;
  min?: number;
  max?: number;
}

export interface SessionWithTreatment extends Session {
  treatment: { id: string; estimatedTime: string };
  notes?: string;
}

export interface PatientHistory {
  patient: Patient;
  sessions: SessionWithTreatment[];
  metricDefinitions: MetricDefinition[];
}