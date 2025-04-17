import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const submitContactForm = async (contactData) => {
  try {
    const dataToSubmit = {
      ...contactData,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
 
    const docRef = await addDoc(collection(db, 'contacts'), dataToSubmit);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};