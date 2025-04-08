import React from 'react';
import { LoanApplicationForm, HalfCircleBackground } from '../components';

const LoanPage = () => {
  return (
    <HalfCircleBackground title="Apply for Loan">
      <LoanApplicationForm />
    </HalfCircleBackground>
  );
};

export default LoanPage; 