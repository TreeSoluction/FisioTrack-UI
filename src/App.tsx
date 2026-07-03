import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientForm = lazy(() => import('./pages/PatientForm'));
const PatientDetail = lazy(() => import('./pages/PatientDetail'));
const Treatments = lazy(() => import('./pages/Treatments'));
const TreatmentForm = lazy(() => import('./pages/TreatmentForm'));
const TreatmentDetail = lazy(() => import('./pages/TreatmentDetail'));
const SessionForm = lazy(() => import('./pages/SessionForm'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const ConsentTerms = lazy(() => import('./pages/ConsentTerms'));
const EnterpriseRequest = lazy(() => import('./pages/EnterpriseRequest'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Settings = lazy(() => import('./pages/Settings'));

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

function PricingPage() {
  const token = localStorage.getItem('token');
  if (token) {
    return <Layout><Pricing /></Layout>;
  }
  return <PublicLayout><Pricing /></PublicLayout>;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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

          <Route path="/pricing" element={<PricingPage />} />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
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
      </Suspense>
    </BrowserRouter>
  );
}