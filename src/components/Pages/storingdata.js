import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import { items } from '../../data';

export const initializeFirestoreDataIfNeeded = async () => {
  try {
    const collectionRef = collection(db, 'products');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      await Promise.all(items.map(async item => {
        await setDoc(doc(collection(db, "products")), {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price
        });
      }));
      console.log("Firestore data initialized successfully.");
    } else {
      console.log("Firestore data already initialized.");
    }
  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
};
