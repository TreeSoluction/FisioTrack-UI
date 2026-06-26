import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Treatments from './pages/Treatments';
import TreatmentForm from './pages/TreatmentForm';
import TreatmentDetail from './pages/TreatmentDetail';
import SessionForm from './pages/SessionForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ConsentTerms from './pages/ConsentTerms';
import EnterpriseRequest from './pages/EnterpriseRequest';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return !token ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function HomePage() {
  const token = localStorage.getItem('token');
  if (token) {
    return <Layout><Dashboard /></Layout>;
  }
  return <PublicLayout><Landing /></PublicLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/consent-terms" element={<ConsentTerms />} />
          <Route path="/enterprise-request" element={<PrivateRoute><EnterpriseRequest /></PrivateRoute>} />
        </Route>

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="patients/:id/edit" element={<PatientForm />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="treatments/new" element={<TreatmentForm />} />
          <Route path="treatments/:id" element={<TreatmentDetail />} />
          <Route path="treatments/:id/edit" element={<TreatmentForm />} />
          <Route path="sessions/new" element={<SessionForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}