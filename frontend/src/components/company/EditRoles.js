import React, {useEffect} from "react";
import {useState} from "react";
//import { useAuth } from "../../contexts/AuthContext";
//import { useNavigate} from "react-router-dom";
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import axios from 'axios';

export default function EditRoles() {

    //Default roles object that holds its name, permissions and an id
    let initialRoles = [{
        id: 1, // Used in JSX as a key
        name: 'Manager',
        /* read isn't relevant since the visibility of a file will determine whether*/
        /* it can be read or not*/
        //close: true,
        //comment: true,
        //notify: true,
        //resolve: true,
        //respond: true,
        //revise: true,
        //upload: true,
        permissions: [0,0,0,0,0,0,0],
    }, {
        id: 2,
        name: 'Author',
        //close: false,
        //comment: true,
        //notify: true,
        //resolve: true,
        //respond: true,
        //revise: true,
        //upload: true,
        permissions: [0,1,1,1,1,1,1],
    }, {
        id: 3,
        name: 'QA',
        //close: true,
        //comment: true,
        //notify: false,
        //resolve: true,
        //respond: true,
        //revise: false,
        //upload: false,
        permissions: [1,0,1,1,1,0,0],
    }, {
        id: 4,
        name: 'Consultant',
        //close: false,
        //comment: true,
        //notify: false,
        //resolve: false,
        //respond: true,
        //revise: false,
        //upload: false,
        permissions: [0,1,0,0,1,0,0],
    }];

    //Creates a new array anytime that the old one would need to be changed, updating the state
    const [roles, setRoles] = useState(initialRoles);

    //From addEmployees
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/getRoles'); // Adjust the URL to your actual endpoint
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                // Handle error (e.g., show an error message to the user)
            }
        };

        fetchRoles();
    }, []);

    //Reskinned from addEmployees
    const submitRoles = async () => {
        try {

            await Promise.all(roles.map(role =>
                axios.post('/api/addRole', {
                    name: role.name,
                    permissions: role.permissions,
                })
            ));

            alert('All roles added successfully!');
            // Reset the form or redirect the user as necessary
        } catch (error) {
            console.error('Error adding roles:', error);
            alert('Failed to add some or all roles.');
        }
    };


    //Updates the activeRole to the role clicked by the user
    //This object is a role type, not just a number
    const [activeRole, selectRole] = useState(roles[0]);

    //Should be passed an int that represents a roles ID
    function setActiveRole(passedID){
        for(let role of roles){
            if(role.id===passedID){
                selectRole(role);
            }//end if
        }//end for loop
    }//end function

    //ChatGPT hook that does not appear to work

    useEffect(() => {
        // Whenever roles change, update the active role
        selectRole(roles.find(role => role.id === activeRole.id));
    }, [roles]);



    //Keeps track of the newest ID number for a role to be given
    //This is just a number, not a special type
    const [currentID, setID] = useState(5);


    //Creates a list of role buttons that will appear in our left column
    const listRoles = roles.map((role) => <li className="py-1 mb-auto" key={role.id}>
        <button
            type="submit"
            value={role.id}
            onClick= {() => setActiveRole(role.id)}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            {role.name}
        </button>
    </li>);

    //Create a new role in the roles array and make it the activeRole
    const addRole = () => {
        setRoles([...roles, {
            id: currentID, // Used in JSX as a key
            name: 'New Role',
            permissions: [0,0,0,0,0,0,0],
        }])
        setActiveRole(currentID);
        setID(currentID + 1);

    }//end addRole

    //Deletes the activeRole from the roles array and changes it to a new role
    const deleteRole = () => {
        //As long as we aren't deleting the very last role
        if(roles.length>1){

            //If this isn't the first role in the list
            if(roles[0]!==activeRole){
                //Find the index of the role that we want to delete
                let index  = roles.indexOf(activeRole)
                //swap to the role AFTER the role we are deleting
                selectRole(roles[index-1])

                //filter out the role we want to "delete"
                setRoles(roles.filter(role => role !== roles[index]));

            //This is the very first element in the list, set the active role to item 2
            }else{
                //update the active role to the following role in the list
                setActiveRole(roles[1].id)
                //get rid of the first element in the list
                setRoles(roles.filter(role => role !== roles[0]));
            }//end nested if else

        }else{
            //FAILSAFE IF IT'S THE ONLY ROLE LEFT
            alert('Your company must have at least 1 role!');
        }//end if else
    }//end delete role


    //Updates the name in the role state when the role gets renamed
    function handleRename(newName){
        setRoles(roles.map(role => {
            if(role.id === activeRole.id) {
                return {...role, name: newName};
            }else{
                return role;
            }//end if else
        }));//end map
    }//end function

    //Creates the checkboxes and labels that describe the user's permissions
    const listPermissions = activeRole.permissions.map((perm, index) =>
            <li key={index}>
                <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    name={getPermFromIndex(index)}
                    value={perm}
                    checked={Boolean(perm)}
                    onChange={() => handleOnChange(index)}
                    //This does not SAVE the changes, but places them in the roles state array
                    //They must still be pushed to the database using the save button
                />
                <label htmlFor={`checkbox-${index}`}>{getPermFromIndex(index)}</label>
            </li>);

    //handles when the user clicks on a checkbox
    function handleOnChange(permIndex){
        let swappedBool = !activeRole.permissions[permIndex];
        setRoles(roles.map(role => {
            if(role.id === activeRole.id) {
                let tempPermissions = activeRole.permissions;
                tempPermissions[permIndex] = !tempPermissions[permIndex];
                return {...role, permissions: tempPermissions};

            }else{
                return role;
            }//end if else
        }));//end map
    }//end handleOnChange function

    //Translates the index of the permissions array into the actual permission name
    function getPermFromIndex(index){
        if(index == 0){return "Close Documents"}
        else if(index == 1){return "Comment on Documents"}
        else if(index == 2){return "Notify Reviewers"}
        else if(index == 3){return "Resolve Comments"}
        else if(index == 4){return "Respond to Comments"}
        else if(index == 5){return "Upload Revisions to Documents"}
        else if(index == 6){return "Upload Documents"}
        else{return "Permission not found"}
    }//end function

    //The actual code of the web page
    return (
        <div className="flex flex-col justify-center items-center w-full mb-auto mx-auto">
            {/*Create the header for the page */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Edit your company's roles
            </h2>

            {/*Create the container that will split out edit roles into two columns*/}
            <div className="flex min-h-full flex-1 flex-row justify-center px-10 mb-auto py-4 lg:px-12">

                {/*Create the container for the roles, add button and counter*/}
                <div className="flex flex-col justify-end mb-auto overflow-y">

                    {/* Creates the Add button and the role counter*/}
                    <div className="flex flex-row justify-end py-1">
                        <button
                            //value={}
                            onClick={addRole}
                            type="submit"
                            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                        >
                            Add
                        </button>
                        <h1 className="flex justify-end px-2" > Roles: {roles.length}/50 </h1>
                    </div>

                    {/*Generates the list of roles*/}
                    <ul className="justify-end" > {listRoles} </ul>

                </div>

                {/*Create the container for the permissions and options column*/}
                <div className="flex flex-1 flex-col justify-start px-6 py-1">

                    {/*Create the row container for the Name, save and delete*/}
                    <div className="flex flex-row overflow-y">

                        {/*
                        //Basic text header used before input textbox
                        <h1 className="justify-start min-w-40 ">
                            {activeRole.name} / ID: {activeRole.id}
                        </h1>
                        */}
                        <form>
                            <labeL>
                                <input
                                    id={activeRole.id}
                                    name="roleName"
                                    type="roleName"
                                    value={activeRole.name}
                                    onChange={(e) => handleRename(e.target.value)}
                                    className="block rounded-md border-0 min-w-30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </labeL>
                        </form>


                        <button className="justify-end mx-auto h-8 w-auto px-2"
                            //onClick={saveRole}>
                        >
                            <img
                                className="justify-end mx-auto h-8 w-auto"
                                src={saveIcon}
                                onClick={submitRoles}
                                alt="Save Role">
                            </img>
                        </button>

                        <button className="justify-end mx-auto h-8 w-auto"
                                onClick={deleteRole}>
                            <img
                                className="justify-end mx-auto h-8 w-auto"
                                src={deleteIcon}
                                alt="Delete Role">
                            </img>
                        </button>

                    </div>

                    {/*Create the container for the permissions*/}
                    <div className="flex justify-start lg: overflow-y">
                        <ul className="justify-start"> {listPermissions} </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}