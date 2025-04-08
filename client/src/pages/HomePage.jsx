import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { 
  Loader, 
  HalfCircleBackground, 
  Button, 
  WalletCard,
  ActionButtons 
} from '../components';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { getUserDashboardData } from '../services/databaseService';

const HomePage = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [userLoans, setUserLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState('0');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [userName, setUserName] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    // Fetch user data from our database service
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!currentAccount) {
          setIsLoading(false);
          return;
        }

        // For demo purposes, using a fixed user ID - in a real app, 
        // we would match the wallet address to find the user
        const dashboardData = await getUserDashboardData("1");
        
        if (dashboardData && dashboardData.user) {
          setUserName(dashboardData.user.name);
          setTotalBalance(dashboardData.totalLoansBalance);
          setNextPaymentDate(dashboardData.nextPaymentDate);
          setUserLoans(dashboardData.loans);
          setNotificationsCount(dashboardData.notificationsCount);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentAccount]);

  const handleRequestLoan = () => {
    navigate('/loan');
  };

  const handleRepayLoan = (loanId) => {
    // Navigate to the loan repayment page with the specified loan ID
    navigate(`/repay/${loanId || 'all'}`);
  };

  const handleNotificationsClick = () => {
    // Navigate to notifications page in a real app
    alert('Notifications feature will open here');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral">
        <Loader />
      </div>
    );
  }

  return (
    !currentAccount ? (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-neutral">
        <h1 className="text-3xl font-bold mb-6">Welcome to MicroLoanChain</h1>
        <p className="text-gray-600 mb-8 text-center">
          Connect your wallet to see your loan details and manage your microloans.
        </p>
        <Button 
          onClick={connectWallet}
          variant="primary"
          size="lg"
        >
          Connect Wallet
        </Button>
      </div>
    ) : (
      <HalfCircleBackground title="Dashboard">
        <div className="max-w-lg mx-auto pt-1 w-full">
          {/* Header with Welcome and Notification */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white text-opacity-80 text-lg">Welcome,</p>
              <h1 className="text-white text-3xl font-bold">{userName}</h1>
            </div>
            <div className="relative">
              <button onClick={handleNotificationsClick} className="focus:outline-none">
                <IoIosNotificationsOutline size={28} className="text-white" />
                {notificationsCount > 0 && (
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></div>
                )}
              </button>
            </div>
          </div>
          
          {/* Wallet Card */}
          <div className="mb-6">
            <WalletCard 
              userName={userName}
              balance={totalBalance}
              walletAddress={currentAccount}
              walletType="Metamask"
              currencySymbol="RM"
            />
          </div>
          
          {/* Action Buttons */}
          <ActionButtons 
            onRepay={() => handleRepayLoan()}
            onRequest={handleRequestLoan}
          />
          
          {/* User Loans Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
            
            {userLoans.length > 0 ? (
              <div className="space-y-4">
                {userLoans.map(loan => (
                  <div key={loan.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{loan.title}</h3>
                        <p className="text-sm text-gray-500">
                          Due Date: <span className={loan.isOverdue ? "text-red-500 font-medium" : ""}>{loan.dueDate}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRepayLoan(loan.id)}
                        className="bg-primary hover:bg-primaryHover text-white px-5 py-2 rounded-full text-sm font-medium"
                      >
                        Repay
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Loan Balance</p>
                        <p className="text-lg font-semibold text-secondary">RM {loan.balance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Amount</p>
                        <p className="text-lg font-semibold text-secondary">RM {loan.paymentAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any active loans yet.</p>
                <button 
                  onClick={handleRequestLoan}
                  className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-full text-sm font-medium"
                >
                  Apply for a Loan
                </button>
              </div>
            )}
          </div>
        </div>
      </HalfCircleBackground>
    )
  );
};

export default HomePage; 