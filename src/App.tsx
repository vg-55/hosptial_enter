import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardOverview from './pages/DashboardOverview';
import PatientFlowDashboard from './pages/PatientFlowDashboard';
import OccupancyDashboard from './pages/OccupancyDashboard';
import ResourceUtilizationDashboard from './pages/ResourceUtilizationDashboard';
import MedicineUsageDashboard from './pages/MedicineUsageDashboard';
import FinanceKPIDashboard from './pages/FinanceKPIDashboard';
import StaffPerformanceDashboard from './pages/StaffPerformanceDashboard';
import CustomReportBuilder from './pages/CustomReportBuilder';
import BillingDashboard from './pages/billing/BillingDashboard';
import InvoiceList from './pages/billing/InvoiceList';
import InvoiceDetail from './pages/billing/InvoiceDetail';
import InsuranceClaims from './pages/billing/InsuranceClaims';
import ClinicalDashboard from './pages/clinical/ClinicalDashboard';
import ClinicalNotesList from './pages/clinical/ClinicalNotesList';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffList from './pages/staff/StaffList';
import ShiftScheduler from './pages/staff/ShiftScheduler';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/patient-flow" element={<PatientFlowDashboard />} />
                  <Route path="/occupancy" element={<OccupancyDashboard />} />
                  <Route path="/resource-utilization" element={<ResourceUtilizationDashboard />} />
                  <Route path="/medicine-usage" element={<MedicineUsageDashboard />} />
                  <Route path="/finance-kpi" element={<FinanceKPIDashboard />} />
                  <Route path="/staff-performance" element={<StaffPerformanceDashboard />} />
                  <Route path="/custom-reports" element={<CustomReportBuilder />} />
                  <Route path="/billing" element={<BillingDashboard />} />
                  <Route path="/billing/invoices" element={<InvoiceList />} />
                  <Route path="/billing/invoices/:id" element={<InvoiceDetail />} />
                  <Route path="/billing/claims" element={<InsuranceClaims />} />
                  <Route path="/clinical" element={<ClinicalDashboard />} />
                  <Route path="/clinical/notes" element={<ClinicalNotesList />} />
                  <Route path="/clinical/documents" element={<ClinicalNotesList />} />
                  <Route path="/staff" element={<StaffDashboard />} />
                  <Route path="/staff/list" element={<StaffList />} />
                  <Route path="/staff/schedule" element={<ShiftScheduler />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
