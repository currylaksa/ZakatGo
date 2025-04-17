import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

/**
 * Upload a payslip document and store its extracted information
 * @param {File} file - The payslip file to upload
 * @param {Object} extractedData - Data extracted from the document
 * @param {string} userId - User ID (optional)
 * @returns {Promise<string>} - Document ID of the created record
 */
export const uploadPayslip = async (file, extractedData, userId = null) => {
  try {
    const payslipData = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      userId: userId || 'anonymous',
      name: extractedData.name || null,
      monthlySalary: extractedData.salary ? Number(extractedData.salary) : null,
      monthlyDeductions: extractedData.deductions ? Number(extractedData.deductions) : 0,
      totalZakatableAssets: extractedData.assets ? Number(extractedData.assets) : null,
      status: 'processing'
    };
    
    const docRef = await addDoc(collection(db, 'payslips'), payslipData);
    
    try {
      const timestamp = new Date().getTime();
      const fileName = `payslips/${userId || 'anonymous'}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'payslips'), {
        ...payslipData,
        fileUrl: downloadURL,
        status: 'processed',
        processingDate: new Date().toISOString()
      });
      
      return docRef.id;
    } catch (storageError) {
      console.error('Storage error, but continuing with document creation:', storageError);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error uploading payslip:', error);
    throw error;
  }
};

/**
 * Get all payslips for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of payslip documents
 */
export const getUserPayslips = async (userId) => {
  try {
    if (!userId) {
      console.warn('No user ID provided to getUserPayslips');
      return [];
    }
    
    const q = query(collection(db, 'payslips'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadDate: doc.data().uploadDate ? new Date(doc.data().uploadDate) : null,
      processingDate: doc.data().processingDate ? new Date(doc.data().processingDate) : null
    }));
  } catch (error) {
    console.error('Error getting user payslips:', error);
    throw error;
  }
};

/**
 * Save a payslip document after payment
 * @param {Object} userData - User data containing personal and document information
 * @returns {Promise<string>} - Document ID of the created record
 */
export const savePayslipAfterPayment = async (userData) => {
  try {
    console.log('userData for payslip:', userData);
    console.log('documentData structure:', userData.documentData);
    const payslipData = {
      userId: userData.userId || 'anonymous',
      name: userData.personalInfo?.name || 
            userData.documentData?.name || 
            null,
      monthlySalary: userData.personalInfo?.salary ? Number(userData.personalInfo.salary) : 
                    (userData.documentData?.salary ? Number(userData.documentData.salary) : null),
                    
      monthlyDeductions: userData.personalInfo?.deductions ? Number(userData.personalInfo.deductions) : 
                         (userData.documentData?.deductions ? Number(userData.documentData.deductions) : 0),
                         
      totalZakatableAssets: userData.personalInfo?.assets ? Number(userData.personalInfo.assets) : 
                           (userData.documentData?.assets ? Number(userData.documentData.assets) : null),
      
      zakatAmount: userData.zakatAmount ? Number(userData.zakatAmount) : null,
      fileName: userData.documentData?.fileName || null,
      fileType: userData.documentData?.fileType || null,
      fileSize: userData.documentData?.fileSize || null,
      uploadDate: userData.documentData?.uploadDate || new Date().toISOString(),
      status: 'completed',
      paymentDate: new Date().toISOString()
    };
    console.log('Saving payslip data:', payslipData);
    const docRef = await addDoc(collection(db, 'payslips'), payslipData);
    console.log('Payslip saved successfully after payment:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving payslip after payment:', error);
    throw error;
  }
};