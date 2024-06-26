import React, {useEffect} from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import {useAuth} from "../../contexts/AuthContext";
import api from "../../config/axiosConfig";
import useIdleTimeout from "../idleTimer/idleTimer"

export default function EditRoles() {
    const auth = useAuth();
    const uid = auth.currentUser.uid;

    useIdleTimeout();

    const { logout } = useAuth();

//Default roles object that holds its name, permissions and an id
    let initialRoles = [{
        permissions: [false,true,true,true,true,true,true],
        name: 'Author',
        id: 1,
        // Used in JSX as a key
        /* read isn't relevant since the visibility of a file will determine whether */
        /* it can be read or not*/
        //close: false,
        //comment: true,
        //resolve: true,
        //respond: true,
        //select and notify: true,
        //revise: true,
        //upload: true,
    }, {
        permissions: [false,false,false,false,false,false,false],
        name: 'Manager',
        id: 2,
        //close: false,
        //comment: false,
        //resolve: false,
        //respond: false,
        //select and notify: false,
        //revise: false,
        //upload: false,
    }, {
        permissions: [true,false,true,true,true,false,false],
        name: 'QA',
        id: 3,
        //close: true,
        //comment: true,
        //resolve: false,
        //respond: true,
        //select and notify: true,
        //revise: false,
        //upload: false,
    }, {
        permissions: [false,true,false,false,true,false,false],
        name: 'Consultant',
        id: 4,
        //close: false,
        //comment: true,
        //resolve: false,
        //respond: false,
        //select and notify: true,
        //revise: false,
        //upload: false,
    }];

    const navigate = useNavigate(); // Instantiate useNavigate

    const [companyName, setCompanyName] = useState("");
    //Creates a new array anytime that the old one would need to be changed, updating the state
    const [roles, setRoles] = useState([]);
    const [activeRole, selectRole] = useState({});

    //From addEmployees
    //Only run once because of the empty dependencies array
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/api/companies/getRoles');
                if(response.data.roles.length !== 0)
                {
                    setRoles(response.data.roles)
                    selectRole(response.data.roles[0])
                }
                else
                {
                    setRoles(initialRoles)
                    selectRole(initialRoles[0])
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                if(error.response.data === 'Invalid token') //if user's login token has expired, log them out
                {
                    logout();
                    navigate("/login");
                }
                setRoles(initialRoles)
                selectRole(initialRoles[0])
            }//end try catch
        };//end fetchRoles const
        const fetchCompanyName = async () => {
            try {
                const response = await api.get('/api/companies/getCompanyName');
                setCompanyName(response.data.companyName)
            } catch (error) {
                console.error('Failed to fetch company name:', error);
                if(error.response.data === 'Invalid token') //if user's login token has expired, log them out
                {
                    logout();
                    navigate("/login");
                }
            }//end try catch
        };//end fetchCompanyName
        fetchCompanyName();
        fetchRoles();
    }, []); //end useEffect


    //Reskinned from addEmployees
    const submitRoles = async () => {
        let incorrectRole = false;
        for(let role of roles){
            if(role.name===""){
                alert("Every role must have a name!");
                incorrectRole = true;
            }//end if
        }//end for loop

        if(incorrectRole===false){
            try {
                await api.put('/api/companies/addOrUpdateRoles', {
                    uid: uid, roles: roles
                }).catch(function (error) {
                    if(error.response.data === 'Invalid token') //if user's login token has expired, log them out
                    {
                        logout();
                        navigate("/login");
                    }
                    if (error.response.status === 405)
                    {
                        alert(error.response.data.message);
                    }//end if
                });
                // Reset the form or redirect the user as necessary
            } catch (error) {
                console.log(error.message);
            }//end try catch
        }//end if

    }//end submitRoles()

    //Updates the activeRole to the role clicked by the user
    //This object is a role type, not just a number

    //Should be passed an int that represents a roles ID
    function setActiveRole(passedID){
        for(let role of roles){
            if(role.id===passedID){
                selectRole(role);
            }//end if
        }//end for loop
    }//end function

    //Fixes the rename issue where you can only change 1 char at a time
    //May be causing a role ID error tho?
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
            permissions: [false,false,false,false,false,false,false],
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
    const listPermissions = activeRole?.permissions?.map((perm, index) =>
        <li key={index}>
            <input
                className="dark:text-white"
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
        //let swappedBool = !activeRole.permissions[permIndex];
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
        if(index === 0){return " Close Documents"}
        else if(index === 1){return " Comment on Documents"}
        else if(index === 2){return " Resolve Comments"}
        else if(index === 3){return " Respond to Comments"}
        else if(index === 4){return " Select and Notify Reviewers"}
        else if(index === 5){return " Upload Revisions to Documents"}
        else if(index === 6){return " Upload Documents"}
        else{return "Permission not found"}
    }//end function

    const handleNextClick = () => {
        navigate('/add-employees', {state: {roles, companyName}}) // Navigate to /add-employees
    };


//The actual code of the web page
    return (
    <div className="flex flex-col justify-center items-center w-full mb-auto mx-auto mt-24">
        {/*Create the header for the page */}
        {companyName && (
        <h2 className="mt-24 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            {/*Edit your company's roles*/}
            Edit {companyName}'s Roles
        </h2>
        )}

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
                    <h1 className="flex justify-end px-2 mt-1 dark:text-white"> Roles: {roles.length}/50 </h1>
                </div>

                {/*Generates the list of roles*/}
                <ul className="justify-end"> {listRoles} </ul>

            </div>

            {/*Create the container for the permissions and options column*/}
            {activeRole && (
            <div className="flex flex-1 flex-col justify-start px-6 py-1">
                {/*Create the row container for the Name, save and delete*/}
                <div className="flex flex-row overflow-y">
                    <form>
                        <input
                            id={activeRole.id}
                            name="roleName"
                            type="roleName"
                            value={activeRole.name}
                            onChange={(e) => handleRename(e.target.value)}
                            className="block p-2 rounded-md h-8 border-0 min-w-28 text-black
                                    transition-all duration-500
                                    shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                        />
                    </form>

                    <button className="justify-end mx-auto h-8 w-auto px-2">
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
                <div className="flex mt-3 mb-1 justify-start lg: overflow-y dark:text-white">
                    <ul className="justify-start dark:text-white"> {listPermissions} </ul>
                </div>

                <button className="flex ml-auto w-19 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm
                    font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                        type="submit"
                        value="Next"
                        onClick={handleNextClick}
                >
                    Next →
                </button>

            </div>
            )}
        </div>
    </div>
    );
}