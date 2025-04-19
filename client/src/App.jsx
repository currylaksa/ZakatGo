import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar, Footer, Transactions, Services, ThemeSwitcher } from "./components";
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
  // Onboarding pages
  OnboardingWelcome,
  PersonalInfoPage,
  JobInfoPage,
  SelfiePage,
  UploadPayslipPage,
  OnboardingSuccessPage,
  NotFoundPage,
  WithdrawTutorialPage,
} from "./pages";
import {ZakatPaymentPage} from "./pages/zakat"
import {ZakatAssistPage} from "./pages/zakatAssist"
import ApprovalReportPage from "./pages/zakatAssist/ApprovalReportPage"; // Import the new ApprovalReportPage
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from './contexts/LanguageContext';

// Component to conditionally render Navbar based on route
const AppContent = () => {
  const location = useLocation();
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  
  // Set to true to enable theme switcher for development/testing
  const showThemeSwitcher = false;
  
  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-neutral">
        {!isOnboardingRoute && <Navbar />}
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/lender-reports" element={<LenderReportsPage />} />
            <Route path="/withdraw-tutorial" element={<WithdrawTutorialPage />} />
            <Route path="/calculator" element={<ZakatCalculator />} />
            <Route path="/blockchain-ledger" element={<BlockchainLedgerPage />} />
            <Route path="/dashboard" element={<ImpactDashboardPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/zakat-payment" element={<ZakatPaymentPage />} />
            <Route path="/zakat-assist" element={<ZakatAssistPage />} />
            <Route path="/zakat-assist/approval/:applicationId" element={<ApprovalReportPage />} /> {/* Add new route for approval reports */}
            <Route path="/create-campaigns" element={<CreateCampaignsPage />} />
            {/* Onboarding routes */}
            <Route path="/onboarding" element={<Navigate to="/onboarding/welcome" replace />} />
            <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
            <Route path="/onboarding/personal-info" element={<PersonalInfoPage />} />
            <Route path="/onboarding/job-info" element={<JobInfoPage />} />
            <Route path="/onboarding/selfie" element={<SelfiePage />} />
            <Route path="/onboarding/upload-payslip" element={<UploadPayslipPage />} />;
            <Route path="/onboarding/success" element={<OnboardingSuccessPage />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        {!isOnboardingRoute && <Footer />}
        {showThemeSwitcher && <ThemeSwitcher />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
