import db from '../data/db.json';

// Helper function to simulate async database operations
const simulateAsync = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// User Services
export const getUserById = async (userId) => {
  const user = db.users.find(user => user.id === userId);
  return simulateAsync(user);
};

export const getUserByAddress = async (address) => {
  const user = db.users.find(user => user.address.toLowerCase() === address.toLowerCase());
  return simulateAsync(user);
};

// Loan Services
export const getLoansByBorrowerId = async (borrowerId) => {
  const loans = db.loans.filter(loan => loan.borrowerId === borrowerId);
  return simulateAsync(loans);
};

export const getLoansByLenderId = async (lenderId) => {
  const loans = db.loans.filter(loan => loan.lenderId === lenderId);
  return simulateAsync(loans);
};

export const getLoanById = async (loanId) => {
  const loan = db.loans.find(loan => loan.id === loanId);
  return simulateAsync(loan);
};

export const getLoanByLoanId = async (loanId) => {
  const loan = db.loans.find(loan => loan.loanId === loanId);
  return simulateAsync(loan);
};

// Payment Services
export const getPaymentsByLoanId = async (loanId) => {
  const payments = db.payments.filter(payment => payment.loanId === loanId);
  return simulateAsync(payments);
};

export const getPaymentsByBorrowerId = async (borrowerId) => {
  const payments = db.payments.filter(payment => payment.borrowerId === borrowerId);
  return simulateAsync(payments);
};

// Transaction Services
export const getTransactionsByAddress = async (address) => {
  const transactions = db.transactions.filter(
    tx => tx.fromAddress.toLowerCase() === address.toLowerCase() || 
          tx.toAddress.toLowerCase() === address.toLowerCase()
  );
  return simulateAsync(transactions);
};

export const getTransactionsByLoanId = async (loanId) => {
  const transactions = db.transactions.filter(tx => tx.loanId === loanId);
  return simulateAsync(transactions);
};

// Notification Services
export const getNotificationsByUserId = async (userId) => {
  const notifications = db.notifications.filter(notification => notification.userId === userId);
  return simulateAsync(notifications);
};

export const markNotificationAsRead = async (notificationId) => {
  // In a real app, this would update the database
  // Here we're just simulating the update
  const notification = db.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return simulateAsync({ success: true });
};

// Credit Score Services
export const getCreditScoreByUserId = async (userId) => {
  const creditScore = db.creditScores.find(cs => cs.userId === userId);
  return simulateAsync(creditScore);
};

// Loan Request Services
export const getLoanRequestsByBorrowerId = async (borrowerId) => {
  const requests = db.loanRequests.filter(request => request.borrowerId === borrowerId);
  return simulateAsync(requests);
};

export const getPendingLoanRequests = async () => {
  const pendingRequests = db.loanRequests.filter(request => request.status === 'pending');
  return simulateAsync(pendingRequests);
};

// Loan Conditions Services
export const getLoanConditionsByBorrowerId = async (borrowerId) => {
  const conditions = db.loanConditions.filter(condition => condition.borrowerId === borrowerId);
  return simulateAsync(conditions);
};

// Pending Loans Services
export const getPendingLoansByBorrowerId = async (borrowerId) => {
  const pendingLoans = db.pendingLoans.filter(loan => loan.borrowerId === borrowerId);
  return simulateAsync(pendingLoans);
};

export const getAvailablePendingLoans = async () => {
  const availableLoans = db.pendingLoans.filter(loan => loan.status === 'awaiting_lender');
  return simulateAsync(availableLoans);
};

// Search Services
export const searchLoans = async (query) => {
  const searchTerm = query.toLowerCase();
  const results = db.loans.filter(
    loan => loan.title.toLowerCase().includes(searchTerm) || 
            loan.loanId.includes(query)
  );
  return simulateAsync(results);
};

// Combined Data Services
export const getUserDashboardData = async (userId) => {
  const user = await getUserById(userId);
  const loans = await getLoansByBorrowerId(userId);
  const pendingLoans = await getPendingLoansByBorrowerId(userId);
  const notifications = await getNotificationsByUserId(userId);
  const unreadNotifications = notifications.filter(n => !n.read);
  
  return {
    user,
    loans,
    pendingLoans,
    notificationsCount: unreadNotifications.length,
    totalLoansBalance: user.totalLoansBalance,
    nextPaymentDate: user.nextPaymentDate
  };
};

export const getLoanDetails = async (loanId) => {
  const loan = await getLoanById(loanId);
  if (!loan) return null;
  
  const payments = await getPaymentsByLoanId(loanId);
  const transactions = await getTransactionsByLoanId(loanId);
  const borrower = await getUserById(loan.borrowerId);
  const lender = await getUserById(loan.lenderId);
  
  return {
    loan,
    payments,
    transactions,
    borrower,
    lender
  };
}; 