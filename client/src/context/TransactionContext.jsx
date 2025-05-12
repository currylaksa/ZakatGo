import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

// Define FIXED_FINAL_RECEIVER_ADDRESS here
const FIXED_FINAL_RECEIVER_ADDRESS = "0x227fff9c413Ff12fB82448e75B37876B584186FC";

const createEthereumContract = async () => {
  try {
    if (!ethereum) {
      alert("Please install MetaMask!");
      console.error("createEthereumContract: MetaMask not found.");
      return null;
    }

    // Explicitly log the values from constants.js as they are seen by this function
    console.log("createEthereumContract: contractAddress from import:", contractAddress);
    console.log("createEthereumContract: contractABI from import (first few entries):", contractABI ? JSON.stringify(contractABI.slice(0, 2), null, 2) : "ABI is null/undefined");
    console.log("createEthereumContract: contractABI length:", contractABI ? contractABI.length : "ABI is null/undefined");

    if (!contractAddress || typeof contractAddress !== 'string' || !contractAddress.startsWith('0x')) {
        console.error("createEthereumContract: Invalid contractAddress:", contractAddress);
        alert("Contract address is invalid. Please check configuration.");
        return null;
    }

    if (!contractABI || !Array.isArray(contractABI) || contractABI.length === 0) {
        console.error("createEthereumContract: Invalid or empty contractABI:", contractABI);
        alert("Contract ABI is invalid or empty. Please check constants.js.");
        return null;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(
      contractAddress, // Using the imported variable directly
      contractABI,     // Using the imported variable directly
      signer
    );

    console.log("createEthereumContract: transactionsContract object created.");
    // Check for specific functions that should exist
    console.log("createEthereumContract: typeof transactionsContract.addToBlockchain:", typeof transactionsContract.addToBlockchain);
    console.log("createEthereumContract: typeof transactionsContract.getAllTransactionCount:", typeof transactionsContract.getAllTransactionCount);
    console.log("createEthereumContract: typeof transactionsContract.getZakatTransactions:", typeof transactionsContract.getZakatTransactions);
    console.log("createEthereumContract: typeof transactionsContract.FIXED_RECEIVER (view method):", typeof transactionsContract.FIXED_RECEIVER);

    // Log all keys found on the contract instance AND its interface
    console.log("createEthereumContract: All keys on contract instance:", Object.keys(transactionsContract));
    if (transactionsContract.interface) {
        console.log("createEthereumContract: Interface fragments (should show your methods):");
        transactionsContract.interface.forEachFunction((funcFragment) => {
            console.log(`  - ${funcFragment.name}(${funcFragment.inputs.map(i => i.type).join(',')})`);
        });
        transactionsContract.interface.forEachEvent((eventFragment) => {
            console.log(`  - event ${eventFragment.name}(${eventFragment.inputs.map(i => i.type).join(',')})`);
        });
    }

    return transactionsContract;
  } catch (error) {
    console.error("Error creating Ethereum contract instance in createEthereumContract:", error);
    if (error.message && error.message.includes("Invalid ABI")) {
        alert("The contract ABI is invalid. Please check constants.js.");
    }
    return null;
  }
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount"),
  );
  const [transactions, setTransactions] = useState([]);
  const [zakatTransactions, setZakatTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");

      const contract = await createEthereumContract();
      if (!contract) return;

      console.log("Fetching transactions from contract...");
      if (typeof contract.getAllTransactions !== "function") {
        console.error(
          "getAllTransactions method doesn't exist on the contract",
        );
        return;
      }

      const availableTransactions = await contract.getAllTransactions();
      console.log("Contract:", contract);
      console.log("Raw transactions:", availableTransactions);

      if (!availableTransactions || availableTransactions.length === 0) {
        console.log("No transactions returned");
        setTransactions([]);
        return;
      }
      const txArray = Array.from(availableTransactions);

      const structuredTransactions = txArray.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(
          Number(transaction.timestamp) * 1000,
        ).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: ethers.formatEther(transaction.amount),
      }));

      console.log("Structured transactions:", structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.error("Error getting transactions:", error?.message || error);
      setTransactions([]);
    }
  };

  const getZakatTransactions = async () => {
    try {
        if (!ethereum) return alert("Please install MetaMask!");

        const contract = await createEthereumContract();
        if (!contract) return;
        if (typeof contract.getZakatTransactions !== "function") {
            console.error("getZakatTransactions method not found on contract");
            console.log("Available methods:", Object.keys(contract));
            
            // Fallback to getAllTransactions if getZakatTransactions doesn't exist
            const allTransactions = await contract.getAllTransactions();
            if (allTransactions && allTransactions.length > 0) {
                console.log("Using getAllTransactions as fallback");
                const structuredTransactions = allTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                    message: transaction.message,
                    amount: ethers.formatEther(transaction.amount),
                    keyword: transaction.keyword,
                    transactionHash: transaction.transactionHash || null
                }));
                
                setZakatTransactions(structuredTransactions);
                return;
            }
            
            return;
        }

        console.log("Fetching Zakat transactions...");
        
        const availableTransactions = await contract.getZakatTransactions();
        
        if (!availableTransactions || availableTransactions.length === 0) {
            console.log("No Zakat transactions found");
            setZakatTransactions([]);
            return;
        }

        console.log("Raw Zakat transactions:", availableTransactions);
        
        const structuredTransactions = availableTransactions.map((transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
            message: transaction.message,
            amount: ethers.formatEther(transaction.amount),
            keyword: transaction.keyword,
            transactionHash: transaction.transactionHash || null
        }));

        console.log("Structured Zakat transactions:", structuredTransactions);
        setZakatTransactions(structuredTransactions);
    } catch (error) {
        console.error("Error getting Zakat transactions:", error);
        // Log more details about the error
        console.log("Error details:", {
            message: error.message,
            code: error.code,
            data: error.data
        });
        setZakatTransactions([]);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) {
        console.log("No MetaMask detected");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Connected accounts:", accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("Fetching transactions...");
        await getAllTransactions();
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");

      const contract = await createEthereumContract();
      if (!contract) return;

      console.log("Available contract methods:", Object.keys(contract));

      const count = await contract.getAllTransactionCount();

      if (count) {
        window.localStorage.setItem("transactionCount", count.toString());
        setTransactionCount(count.toString());
      }
    } catch (error) {
      console.log("Error checking transactions:", error?.message || error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const { addressTo, amount, keyword, message } = formData;
      
      if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      const transactionsContract = await createEthereumContract();
      if (!transactionsContract) {
        throw new Error("Failed to initialize smart contract connection.");
      }

      const parsedAmount = ethers.parseUnits(amount.toString(), 18); 
      
      console.log("Frontend: formData.amount:", amount);
      console.log("Frontend: parsedAmount (for contract 'amount' arg AND for 'value' option):", parsedAmount.toString());

      console.log(
        `Attempting to call addToBlockchain on contract ${contractAddress}. ` +
        `sETH will be sent to the contract and then forwarded to ${FIXED_FINAL_RECEIVER_ADDRESS}.`
      );
      
      const transactionResponse = await transactionsContract.addToBlockchain(
        addressTo, 
        parsedAmount,
        message,
        keyword,
        {
          value: parsedAmount,
          gasLimit: 300000 // Manually set gas limit
        }
      );

      setIsLoading(true);
      console.log(`Transaction sent to smart contract, waiting for confirmation... Hash: ${transactionResponse.hash}`);
      await transactionResponse.wait();
      console.log(`Transaction confirmed: ${transactionResponse.hash}`);
      setIsLoading(false);

      // Update transaction count in state and localStorage
      const transactionsCount = await transactionsContract.getAllTransactionCount();
      setTransactionCount(transactionsCount.toString());
      window.localStorage.setItem("transactionCount", transactionsCount.toString());

      // Optionally, refresh the transaction list
      await getAllTransactions();
    } catch (error) {
      console.error("Transaction error:", error); // Matched user's error line for context
      setIsLoading(false);
      throw error;
    }
  };

  const fundLoan = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      setIsLoading(true);
      const addressTo = RECEIVER_ADDRESS;
      const addressFrom = currentAccount; 
      const amount = LOAN_AMOUNT;
      
      const transactionsContract = await createEthereumContract();
      if (!transactionsContract) {
        setIsLoading(false);
        return;
      }
      
      const parsedAmount = ethers.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: addressFrom,
            to: addressTo,
            gas: "0x5208", 
            value: parsedAmount.toString(),
          },
        ],
      });
      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        parsedAmount,
        "Loan Funding", 
        "loan", 
      );

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      
      setIsLoading(false);
      const transactionsCount = await transactionsContract.getAllTransactionCount();
      setTransactionCount(transactionsCount.toString());
      
      return transactionHash;
    } catch (error) {
      console.error("Loan funding error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkIfWalletIsConnect();
      await checkIfTransactionsExists();
    };
    init();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getAllTransactions();
      getZakatTransactions();
    }
  }, [currentAccount, transactionCount]);

  useEffect(() => {
    console.log("Transactions updated:", transactions);
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        fundLoan,
        zakatTransactions,
        getZakatTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
