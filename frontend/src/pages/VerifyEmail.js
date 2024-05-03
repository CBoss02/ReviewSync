import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import {sendEmailVerification} from "firebase/auth";
import {useNavigate} from "react-router-dom";

export default function VerifyEmail() {
    const auth = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if(auth.currentUser.emailVerified){
            navigate("/");
        } else {
            console.log("Email not verified");
        }
    }, [auth.currentUser, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen mt-24 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
            <p className="mb-4">We have sent an email to your email address. Please verify your email.</p>
            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md font-semibold" onClick={async () => {
                try{
                await sendEmailVerification(auth.currentUser);
                console.log("Email sent");
                } catch (error){
                    console.log(error);
                }
            }}>Resend email</button>
        </div>
    );
}