
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyD3rNGK8R7ezlKLr56LlxnYRR6j2vAjZUA",
  authDomain: "attendance-system-b93d3.firebaseapp.com",
  databaseURL: "https://attendance-system-b93d3-default-rtdb.firebaseio.com",
  projectId: "attendance-system-b93d3",
  storageBucket: "attendance-system-b93d3.appspot.com",
  messagingSenderId: "300129700218",
  appId: "1:300129700218:web:23acfa52cc2cc73b442ec3",
  measurementId: "G-HYKVL9EXXK"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export{db};