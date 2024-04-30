import React, {useState, useEffect} from "react";
import {sendPasswordResetEmail} from "firebase/auth";
import auth from "../../config/firebase-config";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import api from "../../config/axiosConfig";
import useIdleTimeout from "../../components/idleTimer/idleTimer"

export default function Profile() {
    const [fNameInput, setFNameInput] = useState("");
    const [lNameInput, setLNameInput] = useState("");

    useIdleTimeout();

    const handleFNameChange = (event) => {
        setFNameInput(event.target.value);
    };

    const handleLNameChange = (event) => {
        setLNameInput(event.target.value);
    };

    useEffect(() => {
        const fetchName = async () => {
            try {
                await api.get("/api/users/getName").then((response) => {
                    setFNameInput(response.data.first_name);
                    setLNameInput(response.data.last_name);
                });
            } catch (error) {
                console.error('Failed to fetch name:', error);
            }
        }
        fetchName()
    }, []);

    const updateFName = async () => {
        try {
            await api.put("/api/users/updateFName", {
                first_name: fNameInput
            })
        } catch (error) {
            console.error('Failed to fetch name:', error);
        }
    }

    const updateLName = async () => {
        try {
            await api.put("/api/users/updateLName", {
                last_name: lNameInput
            })
        } catch (error) {
            console.error('Failed to fetch name:', error);
        }
    }

    const inputStates = [fNameInput, lNameInput]
    const updateNameFunctions = [updateFName, updateLName]
    const updateInputFunctions = [handleFNameChange, handleLNameChange]

    const renderNameSlot = (index) => {
        return (
            <div id="inputContainer"
                 className={`flex items-center space-x-5 transition-all duration-500`}
                 style={{marginTop: "5px", marginBottom: "20px"}}>
                <input
                    type="text"
                    className="flex min-w-80 p-2 transition-all duration-500 rounded-lg
                                    shadow-sm sm:text-md sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                    defaultValue={inputStates[index]}
                    value={inputStates[index]}
                    onChange={updateInputFunctions[index]}
                />
                <button className="justify-end h-8 w-auto"
                >
                    <img
                        className="justify-end h-8 w-auto"
                        onClick={() => updateNameFunctions[index]()}
                        src={saveIcon}
                        alt="Save Role">
                    </img>
                </button>
            </div>
        )
    }


    return (
        <div className="flex flex-col justify-center items-center w-full my-10 ">
            <label className="justify-start w-96 -mr-6 text-md dark:text-white">
                First Name
            </label>
            {renderNameSlot(0)}
            <label className="justify-start w-96 -mr-6 text-md dark:text-white">
                Last Name
            </label>
            {renderNameSlot(1)}
            <button
                className="w-96 h-10
                bg-blue-700 hover:bg-blue-500 text-white font-bold px-4 rounded transition-all duration-500"
                style={{marginTop: "10px"}}
                onClick={() => {
                    sendPasswordResetEmail(auth, auth.currentUser.email)
                    alert("We have sent you an email to reset your password. Please check your email.")
                }}
            >
                Change Password
            </button>
        </div>
    );
}
