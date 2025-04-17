import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const submitApplication = async (applicationData) => {
  try {
    const applicationsRef = collection(db, 'applications');
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};