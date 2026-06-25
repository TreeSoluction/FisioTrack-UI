import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import PacienteForm from './pages/PacienteForm';
import PacienteDetail from './pages/PacienteDetail';
import Tratamentos from './pages/Tratamentos';
import TratamentoForm from './pages/TratamentoForm';
import TratamentoDetail from './pages/TratamentoDetail';
import SessaoForm from './pages/SessaoForm';
import Login from './pages/Login';
import Registro from './pages/Registro';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return !token ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="pacientes/novo" element={<PacienteForm />} />
          <Route path="pacientes/:id" element={<PacienteDetail />} />
          <Route path="pacientes/:id/editar" element={<PacienteForm />} />
          <Route path="tratamentos" element={<Tratamentos />} />
          <Route path="tratamentos/novo" element={<TratamentoForm />} />
          <Route path="tratamentos/:id" element={<TratamentoDetail />} />
          <Route path="tratamentos/:id/editar" element={<TratamentoForm />} />
          <Route path="sessoes/novo" element={<SessaoForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}