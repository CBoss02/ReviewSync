import React, {useEffect} from "react";
import {useState} from "react";
//import { useAuth } from "../../contexts/AuthContext";
//import { useNavigate} from "react-router-dom";
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";

export default function EditRoles() {

    //Roles object for testing that holds its name, permissions and an id
    let roles = [{
        id: 0, // Used in JSX as a key
        name: 'Manager',
        upload: 1,
        notify: 1,
        /* read: 0 Since the visibility of a file will determine whether*/
        /* it can be read or not*/
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 1,
        close: 1,
    }, {
        id: 1, // Used in JSX as a key
        name: 'Author',
        upload: 1,
        notify: 1,
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 1,
        close: 0,
    }, {
        id: 2, // Used in JSX as a key
        name: 'QA',
        upload: 0,
        notify: 0,
        comment: 1,
        respond: 1,
        resolve: 1,
        revise: 0,
        close: 1,
    }, {
        id: 3, // Used in JSX as a key
        name: 'Consultant',
        upload: 0,
        notify: 0,
        comment: 1,
        respond: 1,
        resolve: 0,
        revise: 0,
        close: 0,
    }];

    //Updates the selectedRole int to the role clicked by the user
    const [selectedRole, selectRole] = useState(0);


    //Creates a list of role buttons that will appear in our left column
    const listRoles = roles.map(role => <li className="py-1" key={roles.id}>
        <button
            type="submit"
            value={role.id}
            onClick= {() => selectRole(role.id)}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            {role.name}
        </button>

    </li>);

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

    return (
        <div>
            {/*Create the header for the page */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Edit your company's roles
            </h2>

            {/*Create the container that will split out edit roles into two columns*/}
            <div className="flex min-h-full flex-1 flex-row justify-around px-6 py-4 lg:px-12">

                {/*Create the container for the roles, add button and counter*/}
                <div className="flex flex-col justify-end overflow-y">

                    {/* Creates the Add button and the role counter*/}
                    <div className="flex flex-row justify-end py-1">
                        <button
                            //value={}
                            onClick={handleAddRoleClick}
                            type="submit"
                            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add
                        </button>
                        <h1 className="flex justify-end px-2" > Roles: {roles.length}/50 </h1>
                    </div>

                    {/*Generates the list of roles*/}
                    <ul className="justify-end" > {listRoles} </ul>

                </div>

                {/*Create the container for the permissions and options column*/}
                <div className="flex flex-1 flex-column justify-start px-6 py-1">

                    {/*Create the row container for the Name, save and delete*/}
                    <div className="flex flex-row overflow-y">

                        <h1 className="justify-start min-w-40 ">
                            {roles[selectedRole].name}
                        </h1>

                        <img className="justify-end mx-auto h-8 w-auto px-2"
                             src={saveIcon}
                             alt="Save Changes">
                        </img>

                        <img className="justify-end mx-auto h-8 w-auto"
                             src={deleteIcon}
                             alt="Delete Role">
                        </img>


                    </div>

                    {/*Create the container for the permissions*/}
                    <div className="flex flex-col justify-center lg: overflow-y">
                    </div>

                </div>

            </div>
        </div>
    );
}