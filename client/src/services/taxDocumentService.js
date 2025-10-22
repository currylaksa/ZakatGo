import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

export const saveTaxDocument = async ({ file, hash, meta = {} }) => {
  const storageRef = ref(storage, `tax_documents/${Date.now()}_${file.name}`);
  const metadata = { contentType: file.type || 'application/octet-stream' };
  const task = uploadBytesResumable(storageRef, file, metadata);
  await new Promise((resolve, reject) => {
    task.on('state_changed', null, reject, resolve);
  });
  const fileUrl = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, 'taxDocuments'), {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    hash,
    fileUrl,
    ...meta,
  });

  return { id: docRef.id, fileUrl };
};