// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCnqLgda3eBV18SPINBBSasxmOzo-WcxtA",
  authDomain: "dbsti-tambola.firebaseapp.com",
  projectId: "dbsti-tambola",
  storageBucket: "dbsti-tambola.firebasestorage.app",
  messagingSenderId: "718014633580",
  appId: "1:718014633580:web:7480b01a13bebf44856a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);