// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwVvFosAuFaY6N0b51ppHaYAmngb1KY10",
    authDomain: "reviewsync-39f23.firebaseapp.com",
    projectId: "reviewsync-39f23",
    storageBucket: "reviewsync-39f23.appspot.com",
    messagingSenderId: "647671062896",
    appId: "1:647671062896:web:ea9cdb4b8900dfe332efb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
