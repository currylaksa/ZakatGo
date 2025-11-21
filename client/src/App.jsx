import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar, Footer, AdminNavbar } from "./components";
import { 
  DonationDashboard,
  DonationFormPage,
  DonationSuccessPage,
  DonationPage,
  HomePage, 
  ProfilePage, 
  TransactionsPage, 
  ReviewSummaryPage, 
  PremiumPage, 
  LenderReportsPage,
  FundingReviewPage,
  ZakatCalculator,
  BlockchainLedgerPage,
  ImpactDashboardPage,
  TransparencyPage,
  HelpPage,
  CreateCampaignsPage,
  LoginPage,
  AdminZakatPage,
  // Onboarding pages
  OnboardingWelcome,
  PersonalInfoPage,
  JobInfoPage,
  SelfiePage,
  UploadPayslipPage,
  OnboardingSuccessPage,
  NotFoundPage,
  WithdrawTutorialPage,
  AdminProfilePage,
  AdminDashboardPage,
  AdminMonthlyDeductionPage,
} from "./pages";
import {ZakatPaymentPage} from "./pages/zakat"
import {ZakatAssistPage} from "./pages/zakatAssist"
import ApprovalReportPage from "./pages/zakatAssist/ApprovalReportPage"; // Import the new ApprovalReportPage
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from './contexts/LanguageContext';
import ZakatExplorer from "./pages/zakat/ZakatExplorer";
import ZakatContractOverview from "./pages/zakat/ZakatContractOverview";

// Component to conditionally render Navbar based on route
const AppContent = () => {
  const location = useLocation();
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const RequireAuth = ({ children }) => {
    const authed = localStorage.getItem('isUserAuthed') === 'true';
    const path = location.pathname + location.search;
    return authed ? children : <Navigate to={`/login?redirect=${encodeURIComponent(path)}`} replace />;
  };
  
  const showThemeSwitcher = false;
  
  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-neutral">
        {!isOnboardingRoute && (isAdminRoute ? <AdminNavbar /> : <Navbar />)}
        <div className={!isOnboardingRoute ? "pt-16" : ""}>
          <Routes>
            <Route path="/" element={<Navigate to="/HomePage" replace />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/donation-history" element={<DonationDashboard />} />
            <Route path="/campaigns" element={<DonationPage />} />
            <Route path="/donate/:id" element={<DonationFormPage />} />
            <Route path="/donation-success" element={<DonationSuccessPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/funding-review/:loanId" element={<FundingReviewPage />} />
            <Route path="/review-summary/:loanId" element={<ReviewSummaryPage />} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/lender-reports" element={<LenderReportsPage />} />
            <Route path="/withdraw-tutorial" element={<WithdrawTutorialPage />} />
            <Route path="/calculator" element={<ZakatCalculator />} />
            <Route path="/ledger" element={<BlockchainLedgerPage />} />
            <Route path="/dashboard" element={<RequireAuth><ImpactDashboardPage /></RequireAuth>} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/create-campaign" element={<CreateCampaignsPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Zakat payment & assist */}
            <Route path="/zakat-payment" element={<RequireAuth><ZakatPaymentPage /></RequireAuth>} />
            <Route path="/zakat/explorer/:hash" element={<ZakatExplorer />} />
            <Route path="/zakat/explorer/contract/:address" element={<ZakatContractOverview />} />
            <Route path="/zakat-assist" element={<RequireAuth><ZakatAssistPage /></RequireAuth>} />
            <Route path="/zakat-assist/approval-report" element={<ApprovalReportPage />} />
            
            {/* Onboarding routes */}
            <Route path="/onboarding" element={<Navigate to="/onboarding/welcome" replace />} />
            <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
            <Route path="/onboarding/personal-info" element={<PersonalInfoPage />} />
            <Route path="/onboarding/job-info" element={<JobInfoPage />} />
            <Route path="/onboarding/selfie" element={<SelfiePage />} />
            <Route path="/onboarding/upload-payslip" element={<UploadPayslipPage />} />
            <Route path="/onboarding/success" element={<OnboardingSuccessPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/deduction" element={<AdminMonthlyDeductionPage />} />
            <Route path="/admin/zakat" element={<AdminZakatPage />} />
            
            {/* Not found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <LanguageProvider>
    <ThemeProvider>
      <Router>
        <AppContent />
        <Footer />
      </Router>
    </ThemeProvider>
  </LanguageProvider>
);

export default App;
