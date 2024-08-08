// import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import { getFirestore, collection  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import the 'getAuth' function from the 'firebase/auth' module


import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyA-Ikx5SmMTS8bvIlTN3USVdLHwF521Qdc",
  authDomain: "buybusy-1-5fa77.firebaseapp.com",
  projectId: "buybusy-1-5fa77",
  storageBucket: "buybusy-1-5fa77.appspot.com",
  messagingSenderId: "334776959546",
  appId: "1:334776959546:web:50ea206a787af28d006b03",
  measurementId: "G-7QHNMLS82G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app); 
const db = getFirestore(app);


export { db, collection };