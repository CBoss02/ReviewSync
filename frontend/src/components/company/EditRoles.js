import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";

export default function EditRoles() {
    // Sample roles for initial state
    const [roles, setRoles] = useState([{
        id: 0,
        name: 'Manager',
        upload: 1,
        notify: 1,
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 1,
        close: 1,
    }, {
        id: 1,
        name: 'Author',
        upload: 1,
        notify: 1,
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 1,
        close: 0,
    }, {
        id: 2,
        name: 'QA',
        upload: 0,
        notify: 0,
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 0,
        close: 1,
    }, {
        id: 3,
        name: 'Consultant',
        upload: 0,
        notify: 0,
        comment: 1,
        respond: 1,
        resolve: 0,
        revise: 0,
        close: 0,
    }]);

    const [selectedRole, selectRole] = useState(0);
    const navigate = useNavigate();

    // Function to navigate to the add-employees page
    const navigateToAddEmployees = () => {
        navigate('/add-employees');
    };

    function handleAddRoleClick() {
        alert("You clicked me!");
        {/*
        let tempNum = {roles.length};
        let tempObj = {
            id: {roles.length}, // Used in JSX as a key
            name: 'New Role',
            upload: 1,
            notify: 1,
            comment: 1,
            respond: 1,
            resolve: 1,
            revise: 1,
            close: 1,
        };
        */}
        //roles.push(tempObj);
    }

    {/*
    const handleRoleClick = (roleID) => {
        alert(`You clicked on button ${roleID}`);
        selectRole(roleID);
    }//end add role button functionality
    */}

    // Maps roles to buttons for UI
    const listRoles = roles.map(role =>
        <li className="py-1" key={role.id}>
            <button
                type="button"
                onClick={() => selectRole(role.id)}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                {role.name}
            </button>
        </li>
    );

    return (
        <div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Edit your company's roles
            </h2>
            <div className="flex min-h-full flex-1 flex-row justify-around px-6 py-4 lg:px-12">
                <div className="flex flex-col justify-end overflow-y">
                    <div className="flex flex-row justify-end py-1">
                        <button
                            onClick={handleAddRoleClick}
                            type="button"
                            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add
                        </button>
                        <h1 className="flex justify-end px-2">Roles: {roles.length}/50</h1>
                    </div>
                    <ul>{listRoles}</ul>
                </div>
                <div className="flex flex-1 flex-column justify-start px-6 py-1">
                    <div className="flex flex-row overflow-y">
                        <h1 className="justify-start min-w-40">{roles[selectedRole].name}</h1>
                        <img src={saveIcon} alt="Save Changes" className="justify-end mx-auto h-8 w-auto px-2" />
                        <img src={deleteIcon} alt="Delete Role" className="justify-end mx-auto h-8 w-auto" />
                    </div>
                </div>
            </div>
            {/* "Next →" button */}
            <button onClick={navigateToAddEmployees} style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'green',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
            }}>
                Next →
            </button>
        </div>
    );
}
