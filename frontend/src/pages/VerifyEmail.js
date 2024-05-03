import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (auth.currentUser.emailVerified) {
            navigate("/");
        } else {
            console.log("Email not verified");
        }
    }, [auth.currentUser, navigate]);

    useEffect(() => {
        let interval;
        if (isButtonDisabled) {
            interval = setInterval(() => {
                setTimer(t => {
                    if (t === 1) {
                        clearInterval(interval);
                        setIsButtonDisabled(false);
                        return 60;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isButtonDisabled]);

    const handleResendEmail = async () => {
        try {
            setIsButtonDisabled(true);
            await sendEmailVerification(auth.currentUser);
            console.log("Email sent");
        } catch (error) {
            console.log(error);
            setIsButtonDisabled(false); // Re-enable the button if there is an error
            setTimer(60); // Reset timer
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen mt-24 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
            <p className="mb-4">We have sent an email to your email address. Please verify your email.</p>
            <button
                className={`${isButtonDisabled ? 'bg-gray-500' : 'bg-indigo-600'} text-white px-3 py-1.5 rounded-md font-semibold`}
                onClick={handleResendEmail}
                disabled={isButtonDisabled}
            >
                {isButtonDisabled ? `Resend in ${timer}s` : 'Resend email'}
            </button>
        </div>
    );
}
