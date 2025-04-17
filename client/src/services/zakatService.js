import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Calculate Zakat based on the provided formula
export const calculateZakat = (annualIncome = 0, assets = 0, relief = 0, previousZakat = 0, nisab = 23000) => {
  // Convert all inputs to numbers to ensure proper calculation
  const incomeNum = Number(annualIncome);
  const assetsNum = Number(assets);
  const reliefNum = Number(relief);
  const prevZakatNum = Number(previousZakat);
  const nisabNum = Number(nisab);

  // Calculate the zakatable amount using the formula: 
  // (Total Annual Income + Total Zakatable Assets Value - Total Relief - Zakat & Fitrah Paid)
  const zakatableAmount = incomeNum + assetsNum - reliefNum - prevZakatNum;
  
  // Only calculate Zakat if the zakatable amount is above Nisab
  let calculatedZakat = 0;
  
  if (zakatableAmount >= nisabNum) {
    calculatedZakat = zakatableAmount * 0.025; // 2.5%
  } else if (zakatableAmount > 0) {
    // For amounts below Nisab but above 0, calculate anyway
    // In a real implementation, this could be optional
    calculatedZakat = zakatableAmount * 0.025;
  }

  // Ensure calculated value is not negative
  calculatedZakat = Math.max(0, calculatedZakat);

  return {
    zakatAmount: calculatedZakat,
    calculationSummary: {
      annualIncome: incomeNum,
      totalAssets: assetsNum,
      totalRelief: reliefNum,
      previousZakatPaid: prevZakatNum,
      zakatableWealth: zakatableAmount,
      nisab: nisabNum,
      isAboveNisab: zakatableAmount >= nisabNum
    }
  };
};

// Update Zakat calculation in Firebase
export const updateZakatInFirebase = async (userId, zakatData) => {
  try {
    if (!userId) {
      console.warn('No user ID provided for Zakat update');
      return false;
    }

    // Update user document with Zakat calculation
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      zakatCalculation: zakatData,
      lastCalculated: new Date().toISOString()
    }, { merge: true });

    // Also add to zakat_history collection for record keeping
    const zakatHistoryRef = collection(db, 'zakat_history');
    await addDoc(zakatHistoryRef, {
      userId,
      ...zakatData,
      timestamp: new Date().toISOString(),
      status: 'calculated' // can be 'calculated', 'paid', etc.
    });
    
    console.log('Zakat calculation saved to Firebase');
    return true;
  } catch (error) {
    console.error('Error updating Zakat in Firebase:', error);
    return false;
  }
};

// Record Zakat payment in Firebase
export const recordZakatPayment = async (userId, paymentData) => {
  try {
    if (!userId) {
      console.warn('No user ID provided for Zakat payment');
      return false;
    }

    // Update user's payment history
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      zakatPayments: paymentData,
      lastPayment: new Date().toISOString()
    }, { merge: true });

    // Also add to payments collection
    const paymentsRef = collection(db, 'payments');
    const paymentRef = await addDoc(paymentsRef, {
      userId,
      ...paymentData,
      type: 'zakat',
      status: 'completed',
      timestamp: new Date().toISOString()
    });
    
    console.log('Zakat payment recorded in Firebase');
    return paymentRef.id;
  } catch (error) {
    console.error('Error recording Zakat payment:', error);
    return false;
  }
};