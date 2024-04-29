import React, {useState, useEffect, useRef} from "react";
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
                 style={{marginTop: "5px", marginBottom: "30px"}}>
                <input
                    type="text"
                    className="w-full border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                    defaultValue={inputStates[index]}
                    value={inputStates[index]}
                    onChange={updateInputFunctions[index]}
                />
                <button className="justify-end mx-auto h-8 w-auto px-2"
                >
                    <img
                        className="justify-end mx-auto h-8 w-auto"
                        onClick={() => updateNameFunctions[index]()}
                        src={saveIcon}
                        alt="Save Role">
                    </img>
                </button>
            </div>
        )
    }


    return (
        <div
            style={{marginTop: "60px", marginRight: "450px", marginLeft: "450px"}}>
            <label>
                First Name
            </label>
            {renderNameSlot(0)}
            <label>
                Last Name
            </label>
            {renderNameSlot(1)}
            <button
                className={`bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500`}
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
