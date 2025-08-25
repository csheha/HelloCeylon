import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//my firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAUadTXuGJJu6OPwZRQsfNG3qfEBQZOHw",
  authDomain: "authentication-6d9c1.firebaseapp.com",
  projectId: "authentication-6d9c1",
  storageBucket: "authentication-6d9c1.firebasestorage.app",
  messagingSenderId: "989455933217",
  appId: "1:989455933217:web:ef54420b5537a0a820e860"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();