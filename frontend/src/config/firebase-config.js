// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfsbFJt1CHK99OV7VFU5lsVDH20g7elu0",
    authDomain: "reviewsync-prod.firebaseapp.com",
    projectId: "reviewsync-prod",
    storageBucket: "reviewsync-prod.appspot.com",
    messagingSenderId: "284679547776",
    appId: "1:284679547776:web:92935bbdf0153fec0b6f65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;