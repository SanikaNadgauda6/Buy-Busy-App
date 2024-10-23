import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import { items } from '../../data';

export const initializeFirestoreDataIfNeeded = async () => {
  try {
    const collectionRef = collection(db, 'products');
    const querySnapshot = await getDocs(collectionRef);
    console.log(querySnapshot);
    
    if (querySnapshot.empty) {
      console.log('Initializing Firestore data...');
      
      await Promise.all(items.map(async (item) => {
        try {
          await setDoc(doc(db, 'products', item.id), {
            name: item.name,
            image: item.image,
            price: item.price,
            category: item.category
          });
          console.log(`Item ${item.id} added successfully.`);
        } catch (error) {
          console.error(`Error adding item ${item.id}:`, error.message);
        }
      }));
      console.log("Firestore data initialized successfully.");
    } else {
      console.log("Firestore data already initialized.");
    }
  } catch (error) {
    console.error("Error initializing Firestore data:", error.message);
  }
};
