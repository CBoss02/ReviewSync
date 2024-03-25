import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";


export default function Profile() {
    const [showInput, setShowInput] = useState(false);
    const [inputPlaceholder, setInputPlaceholder] = useState("");
    const [companyName, setCompanyName] = useState("");

    const navigate = useNavigate();

    const handleButtonClick = (action) => {
        setShowInput(true);
        setInputPlaceholder(action === 'join' ? "Enter company code" : "Company name");
    };

    const handleNextClick = () => {
        if (inputPlaceholder === "Company name") {
            // Navigate to AddEmployees page with companyName state only if creating a company
            navigate("/add-employees", { state: { companyName } });
        }
        // Add logic for joining a company if 'join' was the action
    };

    const sharedStyle = {
        width: "200px", // Ensures buttons are the same width
        border: "1px solid black",
        backgroundColor: "green", // Sets background color to green
        color: "white", // Sets text color to white for better contrast
        fontWeight: "bold", // Makes text bold
        padding: "10px",
        cursor: "pointer",
        marginTop: "10px",
        textAlign: "center",
    };

    const inputStyle = {
        ...sharedStyle,
        backgroundColor: "white",
        color: "black",
        fontWeight: "normal",
        display: "block",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <h1></h1>
            {!showInput && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button onClick={() => handleButtonClick('join')} style={sharedStyle}>Join Company</button>
                    <button onClick={() => handleButtonClick('create')} style={sharedStyle}>Create a Company</button>
                </div>
            )}
            {showInput && (
                <div>
                    <input
                        type="text"
                        placeholder={inputPlaceholder}
                        style={inputStyle}
                        value={inputPlaceholder === "Company name" ? companyName : undefined}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    {inputPlaceholder === "Company name" && (
                        <button onClick={handleNextClick} style={{ ...sharedStyle, display: "block" }}>Next</button>
                    )}
                </div>
            )}
        </div>
    );
}
