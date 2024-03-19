import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
} from "firebase/auth";


import auth from "../config/firebase";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function register(email, password, first_name, last_name) {
        try {
            await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
                const user = userCredential.user;
                await axios.post("/api/users/createUser", {
                    uid: user.uid,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                }).then((response) => {
                    sendEmailVerification(user);
                });
            });
        } catch (error) {
            setError("Failed to create an account");
        }
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        try {
            return signOut(auth);
        } catch (e) {
            setError("Failed to log out");
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        register,
        error,
        setError,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}