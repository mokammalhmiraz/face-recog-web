// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFm8JE3lfoQfnayLdTNq_oykWyksBoZKo",
  authDomain: "attendancesystem-40d99.firebaseapp.com",
  databaseURL: "https://attendancesystem-40d99-default-rtdb.firebaseio.com",
  projectId: "attendancesystem-40d99",
  storageBucket: "attendancesystem-40d99.appspot.com",
  messagingSenderId: "907762410633",
  appId: "1:907762410633:web:f942b6f36666e341519258",
  measurementId: "G-X2BGN8LFTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export{db};