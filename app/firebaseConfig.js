
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyD7CArSWqKILuFmWeTDYwiBT0Tlwk3O-Ic",
  authDomain: "attendance-system-a5b05.firebaseapp.com",
  databaseURL: "https://attendance-system-a5b05-default-rtdb.firebaseio.com",
  projectId: "attendance-system-a5b05",
  storageBucket: "attendance-system-a5b05.appspot.com",
  messagingSenderId: "181128713083",
  appId: "1:181128713083:web:38026a583e52ddc9d6e3de",
  measurementId: "G-FWBSW3R45R"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export{db};