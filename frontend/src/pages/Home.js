import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {sendEmailVerification} from "firebase/auth";

export default function Home() {
    const [state, setState] = useState(0);
    const [isVisible, setIsVisible] = useState(false); // New state to manage visibility for animation

    useEffect(() => {
        if (state === 1 || state === 2) {
            setIsVisible(true); // Show input field with animation
        } else {
            setIsVisible(false); // Hide input field
        }
    }, [state]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const element = document.getElementById("inputContainer");
            if ((state === 1 || state === 2) && element && !element.contains(event.target)) {
                setState(0);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [state]);

    // Conditional class to apply transition effects
    const transitionClass = isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";

   const auth = useAuth();
   console.log(auth.currentUser.uid);

    return (
        <div className="flex flex-col items-center justify-center h-screen transition-all duration-500">
            <div className="text-center space-y-3 w-1/4">
                <button
                    className={`bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500 ${state === 0 ? "block" : "hidden"}`}
                    onClick={() => setState(1)}
                >
                    Join a Company
                </button>
                {state !== 0 && (
                    <div id="inputContainer" className={`flex items-center space-x-5 transition-all duration-500 ${transitionClass}`}>
                        <input
                            type="text"
                            placeholder={state === 1 ? "Search Company" : "Enter New Company Name"}
                            className="w-full border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                        />
                        <button
                            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => setState(0)}
                        >
                            <ArrowRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                )}
                {state === 0 && (
                    <p className="text-gray-500 text-sm">
                        or
                    </p>
                )}
                <button
                    className={`bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500 ${state === 0 ? "block" : "hidden"}`}
                    onClick={(async () => {
                        setState(2);
                        try {
                            await sendEmailVerification(auth.currentUser);
                            console.log("Email sent");
                        } catch (error) {
                            console.log(error);
                        }
                    })}
                >
                    Create a Company
                </button>
            </div>
        </div>
    );
}