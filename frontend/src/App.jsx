import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { History } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Loading Component
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#161b22] text-blue-600 font-bold uppercase tracking-widest animate-pulse">
    Loading GLOBAL money Network...
  </div>
);

// Public screens (No lazy to show login fast)
import LoginScreen    from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OtpVerifyScreen from './screens/OtpVerifyScreen';

// Layouts - Lazy Load
const AdminLayout    = lazy(() => import('./layouts/AdminLayout'));
const BorrowerLayout = lazy(() => import('./layouts/BorrowerLayout'));
const StaffLayout    = lazy(() => import('./layouts/StaffLayout'));
const AgentLayout    = lazy(() => import('./layouts/AgentLayout'));

// Staff screens
const StaffDashboard      = lazy(() => import('./screens/staff/LenderDashboard'));
const StaffLoans          = lazy(() => import('./screens/staff/LenderLoans'));
const StaffBorrowers      = lazy(() => import('./screens/staff/LenderBorrowers'));
const StaffPayments       = lazy(() => import('./screens/staff/StaffPayments'));
const StaffNotifications  = lazy(() => import('./screens/staff/StaffNotifications'));
const StaffProfile        = lazy(() => import('./screens/staff/LenderProfile'));

// Admin screens
const AdminDashboard   = lazy(() => import('./screens/admin/AdminDashboard'));
const AdminStaff       = lazy(() => import('./screens/admin/AdminLenders'));
const AdminBorrowers   = lazy(() => import('./screens/admin/AdminBorrowers'));
const AdminAgents      = lazy(() => import('./screens/admin/AdminAgents'));
const AdminAdmins      = lazy(() => import('./screens/admin/AdminAdmins'));
const AdminPayments    = lazy(() => import('./screens/admin/AdminPayments'));
const AdminLoans       = lazy(() => import('./screens/admin/AdminLoans'));
const AdminDefaults    = lazy(() => import('./screens/admin/AdminDefaults'));
const AdminSettings    = lazy(() => import('./screens/admin/AdminSettings'));
const AdminAudit       = lazy(() => import('./screens/admin/AdminAudit'));
const AdminNotifications = lazy(() => import('./screens/admin/AdminNotifications'));
const AdminUsers         = lazy(() => import('./screens/admin/AdminUsers'));
const AdminProfile       = lazy(() => import('./screens/admin/AdminProfile'));
const AdminCollateral    = lazy(() => import('./screens/admin/AdminCollateral'));

// Borrower screens
const BorrowerDashboard = lazy(() => import('./screens/borrower/BorrowerDashboard'));
const BorrowerLoans     = lazy(() => import('./screens/borrower/BorrowerLoans'));
const BorrowerProfile   = lazy(() => import('./screens/borrower/BorrowerProfile'));
const BorrowerReferrals = lazy(() => import('./screens/borrower/BorrowerReferrals'));
const BorrowerCollateral = lazy(() => import('./screens/borrower/BorrowerCollateral'));
const BorrowerPayments   = lazy(() => import('./screens/borrower/BorrowerPayments'));
const BorrowerNotifications = lazy(() => import('./screens/borrower/BorrowerNotifications'));
const LoanApplyForm     = lazy(() => import('./screens/borrower/LoanApplyForm'));

// Agent screens
const AgentDashboard    = lazy(() => import('./screens/agent/AgentDashboard'));
const AgentClients      = lazy(() => import('./screens/agent/AgentClients'));
const CommissionTracker = lazy(() => import('./screens/agent/CommissionTracker'));
const AgentPayments     = lazy(() => import('./screens/agent/AgentPayments'));
const AgentNotifications = lazy(() => import('./screens/agent/AgentNotifications'));

// Shared components/Placeholders
import PaymentCalendar from './screens/shared/PaymentCalendar';
const AgentHistory = () => <div className="p-8 bg-[#161b22] m-8 rounded-[40px] border border-[#30363d] shadow-sm flex flex-col items-center justify-center min-h-[400px]">
  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
    <History size={32} />
  </div>
  <h2 className="text-xl font-bold text-white uppercase tracking-tight">No Payout History</h2>
  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 max-w-[200px] text-center">Your referral bonus history will appear here once processed.</p>
</div>;

// ── Route Guards (Simplified) ──────────────────────────────────────────────────────────────
function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const roles = ['admin', 'staff', 'borrower', 'agent'];
  if (roles.includes(user.role)) {
    const route = user.role === 'borrower' ? 'app' : user.role;
    return <Navigate to={`/${route}/dashboard`} replace />;
  }

  return <Navigate to="/login" replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
        <Route path="/login"    element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/register/borrower" element={<RegisterScreen fixedRole="BORROWER" />} />
        <Route path="/register/agent" element={<RegisterScreen fixedRole="AGENT" />} />
        <Route path="/otp"      element={<OtpVerifyScreen />} />

        {/* Staff */}
        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffLayout /></ProtectedRoute>}>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<StaffDashboard />} />
          <Route path="loans"             element={<StaffLoans />} />
          <Route path="borrowers"         element={<StaffBorrowers />} />
          <Route path="payments"          element={<StaffPayments />} />
          <Route path="calendar"          element={<PaymentCalendar />} />
          <Route path="notifications"     element={<StaffNotifications />} />
          <Route path="profile"           element={<StaffProfile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<AdminDashboard />} />
          <Route path="users"             element={<AdminUsers />} />
          <Route path="staff"             element={<AdminStaff />} />
          <Route path="borrowers"         element={<AdminBorrowers />} />
          <Route path="agents"            element={<AdminAgents />} />
          <Route path="admins"            element={<AdminAdmins />} />
          <Route path="loans"             element={<AdminLoans />} />
          <Route path="payments"          element={<AdminPayments />} />
          <Route path="calendar"          element={<PaymentCalendar />} />
          <Route path="commission"        element={<CommissionTracker />} />
          <Route path="defaults"          element={<AdminDefaults />} />
          <Route path="collateral"        element={<AdminCollateral />} />
          <Route path="settings"          element={<AdminSettings />} />
          <Route path="audit"             element={<AdminAudit />} />
          <Route path="notifications"     element={<AdminNotifications />} />
          <Route path="profile"           element={<AdminProfile />} />
        </Route>

        {/* Borrower / App Portal */}
        <Route path="/app" element={<ProtectedRoute allowedRoles={['borrower']}><BorrowerLayout /></ProtectedRoute>}>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<BorrowerDashboard />} />
          <Route path="apply"             element={<LoanApplyForm />} />
          <Route path="loans"             element={<BorrowerLoans />} />
          <Route path="payments"          element={<BorrowerPayments />} />
          <Route path="calendar"          element={<PaymentCalendar />} />
          <Route path="notifications"     element={<BorrowerNotifications />} />
          <Route path="collateral"        element={<BorrowerCollateral />} />
          <Route path="profile"           element={<BorrowerProfile />} />
          <Route path="referrals"         element={<BorrowerReferrals />} />
        </Route>

        {/* Agent */}
        <Route path="/agent" element={<ProtectedRoute allowedRoles={['agent']}><AgentLayout /></ProtectedRoute>}>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<AgentDashboard />} />
          <Route path="clients"           element={<AgentClients />} />
          <Route path="earnings"          element={<CommissionTracker />} />
          <Route path="payments"          element={<AgentPayments />} />
          <Route path="notifications"     element={<AgentNotifications />} />
          <Route path="profile"           element={<BorrowerProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <ConfigProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ConfigProvider>
    </Router>
  );
}
