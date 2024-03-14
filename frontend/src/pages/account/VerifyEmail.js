import {useAuth} from "../../contexts/AuthContext";
import {useEffect, useState} from "react";
import { sendEmailVerification} from "firebase/auth";

export default function VerifyEmail() {
    const auth = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(auth.currentUser);
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
            <p className="mb-4">We have sent an email to your email address. Please verify your email.</p>
            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md font-semibold" onClick={async () => {
                try{
                await sendEmailVerification(user);
                console.log("Email sent");
                } catch (error){
                    console.log(error);
                }
            }}>Resend email</button>
        </div>
    );
}