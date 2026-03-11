import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM84rbyzgTu1qvmNSf9h_G1q7qAbBjtHA",
  authDomain: "movie-catalog-c9ff3.firebaseapp.com",
  projectId: "movie-catalog-c9ff3",
  storageBucket: "movie-catalog-c9ff3.firebasestorage.app",
  messagingSenderId: "313572896814",
  appId: "1:313572896814:web:331e3150922c8adcedefbf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);