import {createContext, useContext, useState, useEffect} from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
} from "firebase/auth";


import auth from "../config/firebase-config";
import api from "../config/axiosConfig";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function register(email, password, first_name, last_name) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential) {
                await api.post("/api/users/createUser", {
                    uid: userCredential.user.uid,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                }).then((response) => {
                    sendEmailVerification(userCredential.user);
                });
            } else {
                setError("Failed to create an account");
                await logout();
                localStorage.removeItem('token');
                await userCredential.user.delete();
            }

            const token = await userCredential.user.getIdToken();
            localStorage.setItem('token', token);
        } catch (error) {
            setError("Failed to create an account");
        }
    }

    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem('token', token);
            const response = await api.get('api/companies/getCompanyID');
            return response.data.companyID;
        } catch (error) {
            setError("Failed to log in");
            localStorage.removeItem('token');
        }
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