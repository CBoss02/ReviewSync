import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import useIdleTimeout from "../components/idleTimer/idleTimer"

//Caleb's code from index.js used to navigate into the /edit-roles page
import {useNavigate} from "react-router-dom";
import api from "../config/axiosConfig"; // Import useNavigate
//import auth from "../config/firebase";

export default function Home() {

    //Caleb's code from index.js used to navigate into the /edit-roles page
    const navigate = useNavigate(); // Instantiate useNavigate
    const [companyName, setCompanyName] = useState("") ;
    const [companyID, setCompanyID] = useState();
    const [error, setError] = useState("");
    const auth = useAuth();
    const uid = auth.currentUser.uid;

    useIdleTimeout();

    const [state, setState] = useState(0);
    const [isVisible, setIsVisible] = useState(false); // New state to manage visibility for animation

    useEffect(() => {
        if (state === 1 || state === 2) {
            setIsVisible(true); // Show input field with animation
        } else {
            setIsVisible(false); // Hide input field
        }
    }, [state]);

    //Gets the user's company if they have one when the page loads
    useEffect(() => {
        const fetchCompanyName = async () => {
            try {
                const response = await api.get('/api/companies/getCompanyName');
                setCompanyName(response.data.companyName)
            } catch (error) {
                console.error('Failed to fetch company name:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchCompanyName

        const fetchCompanyID = async () => {
            try {
                const response = await api.get('/api/companies/getCompanyID');
                setCompanyID(response.data.companyID)
            } catch (error) {
                console.error('Failed to fetch company id:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchCompanyID

        fetchCompanyName();
        fetchCompanyID();
    }, []);

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


    const submitCompany = async (companyName) => {
        try {
            await api.post("/api/companies/createCompany", {
                owner: uid,
                name: companyName
            });
        } catch (error) {
            console.error('Failed to join the company:', error);
        }//end try catch
    }

    const joinCompany = async () => {
        try {
            await api.put('/api/companies/addEmployeeToCompany', {
                userID: uid, companyName: companyName
            }).then(() => {
                navigate('/dashboard')
            }).catch(error => {
                if(error.response.status === 405)
                    alert(error.response.data.message)
            })
        } catch (error) {
            console.error('Failed to join the company:', error);
            // Handle error
        }//end try catch
    };//end joinCompany

    const handleArrowClick = () => {
        if(state === 1){
            joinCompany();
            //Search for a company with the name and respond accordingly
        }else if(state === 2) {
            //Create a company with the name passed
            submitCompany(companyName).then(() => {
                navigate('/edit-roles');
            }) // Navigate to /edit-roles
        }//end if

    };

    // Conditional class to apply transition effects
    const transitionClass = isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";


    return (

        <div className="flex flex-col items-center justify-center h-screen transition-all duration-500">
            {/*If the user doesn't already have a company, allow them to join or create a company*/}
            {!companyID ? (
                <div className="text-center space-y-3 w-1/4">
                    <button
                        className={`bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500 ${state === 0 ? "block" : "hidden"}`}
                        onClick={() => setState(1)}
                    >
                        Join a Company
                    </button>
                    {state !== 0 && (
                        <div id="inputContainer"
                             className={`flex items-center space-x-5 transition-all duration-500 ${transitionClass}`}>
                            <input
                                type="text"
                                placeholder={state === 1 ? "Search Company" : "Enter New Company Name"}
                                className="w-full border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <button
                                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                                onClick={handleArrowClick}
                            >
                                <ArrowRightIcon className="h-6 w-6"/>
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
                        onClick={() => {
                            setState(2);
                        }}
                    >
                        Create a Company
                    </button>
                </div>
            ) : (
                //When the user already has a company navigate to the dashboard
                navigate("/dashboard")
            )}

        </div>
    );
}