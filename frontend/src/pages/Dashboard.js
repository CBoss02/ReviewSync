import React, {Fragment, useState, useEffect} from "react";
import {ArrowRightIcon, HomeIcon} from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDoubleDownIcon} from '@heroicons/react/solid';
import DocumentUpload from "../components/document/DocumentUpload";
import api from "../config/axiosConfig";
import deleteIcon from "../assets/icons/RedDelete-Icon.png";
import saveIcon from "../assets/icons/GreenSave-Icon.png";
import useIdleTimeout from "../components/idleTimer/idleTimer";
import {useNavigate} from "react-router-dom";
import DocumentCard from "../components/document/DocumentCard";
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:3001';
let socket;

export default function Dashboard() {
    const [projects, setProjects] = useState([]); //projects the user has access to
    const [projectID, setProjectID] = React.useState(null); //current project the user is examining
    const [homeDocuments, setHomeDocuments] = useState([]); //documents that aren't in a project
    const [projectDocuments, setProjectDocuments] = useState([]); //current project's documents
    const [selectedPeople, setSelectedPeople] = useState([]); //used with managing project employees
    const [initialNamePrompt, setInitialNamePrompt] = useState(false); //are we displaying the prompt to name a new project
    const [home, setHome] = useState(true); //is the user examining their home directory
    const [inputValue, setInputValue] = useState(""); //stores value of a project's name
    const [permissions, setPermissions] = useState([]); //user's permissions, in this case only relevant if they are able to upload documents or not
    const [employees, setEmployees] = useState([]); //employees in company, for when a user creates a project and needs to add employees to it
    const [owner, setOwner] = useState(false); //keeps track if user is owner of project currently being examined
    const [projectName, setProjectName] = useState(""); //name of the project currently being examined
    const navigate = useNavigate();
    const [isCreatingProject, setIsCreatingProject] = useState(false); //is the user currently creating a project

    useIdleTimeout(); //starts a timer that will log the user out after 10 minutes of inactivity

    const auth = useAuth();
    const uid = auth.currentUser.uid;

    const {logout} = useAuth();

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ['websocket'] });
        socket.on('connect', () => {
            socket.emit('setup', socket.id);
        });

        socket.on('new-document', () => {
            fetchHomeDocuments();
            fetchProjects();
            fetchProjectDocuments();
        });

        return () => {
            socket.off('connect');
            socket.off('new-document');
            socket.disconnect();
        };
    }, []);


    //Fetches the projects this user has access to
    const fetchProjects = async () => {
        try {
            await api.get("/api/projects/getProjects").then((response) => {
                setProjects(response.data.projects)
            });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            if (error.response.data === 'Invalid token') //if user's login token has expired, log them out
            {
                logout();
                navigate("/login");
            }
        }
    };

    //Fetches the documents a user has access to that are not part of a project
    const fetchHomeDocuments = async () => {
        try {
            await api.get("/api/documents/getHomeDocuments").then((response) => {
                setHomeDocuments(response.data.documents)
            });
        } catch (error) {
            console.error('Failed to fetch home documents:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    };

    //Fetches this user's permissions
    const fetchPermissions = async () => {
        try {
            const response = await api.get("/api/users/getPermissions");
            setPermissions(response.data.permissions)
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    }

    //Fetches the employees of this company
    const fetchEmployees = async () => {
        try {
            await api.get("/api/companies/getEmployees").then((response) => {
                setEmployees(response.data.employees)
            });
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    }

    //Called when a user switches to a certain project to get this project's documents
    const fetchProjectDocuments = async () => {
        try {
            await api.post("/api/projects/getProjectDocuments", {
                projectID: projectID
            }).then((response) => {
                setProjectDocuments(response.data.documents)
            });
        } catch (error) {
            console.error('Failed to fetch project documents:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    };

    //Called when a user switches to a certain project to get the employees assigned to this project
    const fetchEmployeesOnProject = async () => {
        try {
            await api.post("/api/projects/getEmployeesOnProject", {
                projectID: projectID,
                names: true
            }).then((response) => {
                setSelectedPeople(response.data.employees)
            });
        } catch (error) {
            console.error('Failed to fetch employees on project:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    };

    //Creates a new project as soon as the user submits the name for it
    const addProject = async () => {
        try {
            await api.post("/api/projects/createProject", {
                name: inputValue
            }).then(() => {
                handleLocalNewProject(inputValue, uid)
                setInitialNamePrompt(false)
                setHome(true)
                setOwner(false)
                setProjectID(null)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    }

    //Updates the projects array locally to reflect the database change
    function handleLocalNewProject(newName) {
        setProjects([...projects, {
            name: newName,
            owner: uid
        }])
    }//end handleLocalNewProject function

    //Updates a project's name in the database
    const updateName = async () => {
        try {
            await api.put("/api/projects/updateName", {
                name: inputValue,
                projectID: projectID
            });
        } catch (error) {
            console.error('Failed to add project:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    }

    //Updates an employee on a project (either adds or removes them from the project. The backend checks which one needs to happen)
    const updateEmployee = async (employeeID) => {
        try {
            await api.put("/api/projects/updateEmployee", {
                employeeID: employeeID,
                projectID: projectID
            })
        } catch (error) {
            console.error('Failed to update employee:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
        }
    }

    //Deletes a project
    const deleteProject = async () => {
        try {
            await api.delete("/api/projects/deleteProject",
                {
                    data:
                        {projectID: projectID}
                }).then(() => {
                //Find the index of the project that we want to delete
                for (let project of projects) {
                    if (project.id === projectID) {
                        let index = projects.indexOf(project);
                        //filter out the project we want to "delete"
                        setProjects(projects.filter(project => project !== projects[index]));
                    }//end nested if
                }//end for
                //Set the active project ot the home page
                setProjectID(null);
                setHome(true);
                setOwner(false); //Navigate to the Home page
            })
        } catch (error) {
            console.error('Failed to delete project:', error);
            if (error.response.data === 'Invalid token') {
                logout();
                navigate("/login");
            }
            if (error.response.status === 405)
                alert(error.response.data.message)
        }
    }

    //Immediately on render, get a user's permissions, projects, home documents, and the employees in the company
    useEffect(() => {
        fetchPermissions();
        fetchEmployees();
        fetchProjects();
        fetchHomeDocuments();
    }, []);

    //When the project ID changes (when the user clicks on a project), get the documents in this project, and if the user is the owner, get the employees on this project
    useEffect(() => {
        if (!home) {
            fetchProjectDocuments()
            if (owner) {
                fetchEmployeesOnProject()
            }
        }
    }, [projectID]);

    //Handles a project's name change as the user types it in
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //Handles an employee being added to/removed from a project
    const handleSelect = (employeeID) => {
        updateEmployee(employeeID)
    }

    function handleLocalRename(newName) {
        setProjects(projects.map(project => {
            if (project.id === projectID) {
                return {...project, name: newName};
            } else {
                return project;
            }//end if else
        }));//end map
    }//end function

    //Displays the projects as a list of buttons
    const renderProjectNames = () => {
        return projects.map((data) => (
                <>
                    <button
                        className="flex justify-center bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                        onClick={async () => {
                            setProjectName(data.name)
                            setProjectID(data.id)
                            setHome(false)
                            if (data.owner === uid)
                                setOwner(true)
                            else
                                setOwner(false)
                            setInputValue(data.name)
                            setInitialNamePrompt(false)
                        }}
                    >
                        <p>{data.name}</p>
                    </button>
                </>
            )
        )
    }

    const handleDocumentRedirect = (documentId) => {
        navigate(`/document/${documentId}`);
    }

    //Displays documents as a list of buttons
    const renderHomeDocumentNames = () => {
        return homeDocuments.map((document) => (
            <DocumentCard document={document} handleDocumentRedirect={handleDocumentRedirect}/>
            /*<button
                className="bg-indigo-700 hover:bg-indigo-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                onClick={() => handleDocumentRedirect(document.id)}
            >
                <p>{document.name}</p>
            </button>*/
        ))
    }

    const renderProjectDocumentNames = () => {
        return projectDocuments.map((document) => (
            <DocumentCard document={document} handleDocumentRedirect={handleDocumentRedirect}/>
            /*<button
                className="bg-indigo-700 hover:bg-indigo-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                onClick={() => handleDocumentRedirect(document.id)}
            >
                <p>{document.name}</p>
            </button>*/
        ))
    }

    //Displays a prompt to name a new project, and calls the function to add the project to the database when they submit it
    const renderNamePrompt = () => {
        return (
            <div id="inputContainer"
                 className={`flex flex-col items-center space-x-5 transition-all duration-500 mt-2 w-full`}>
                <input
                    type="text"
                    placeholder="New project name..."
                    className="relative w-full transition-all duration-500 rounded-lg
                                    p-2  px-2 text-black
                                    shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className="flex flex-row items-start justify-center w-full mt-1">
                    <button
                        className="flex bg-indigo-700 hover:bg-indigo-500 text-white font-semibold text-sm py-2 px-4 rounded transition-all duration-500"
                        onClick={async () => {
                            await addProject()
                        }}
                    >
                        Create Project
                        <ArrowRightIcon className="h-5 w-5 ml-1"/>
                    </button>
                </div>
            </div>
        )
    }

    //A selectable list of company employees to add to a project. Preselects the employees already on the project.
    //When an employee is selected/deselected, it triggers an API call to add/remove that employee from the project.
    const renderEmployeeList = () => {
        return (
            <Listbox value={selectedPeople} multiple onChange={setSelectedPeople} style={{marginRight: "15px"}}>
                <div className="relative mt-1 pt-2">
                    <Listbox.Button
                        className="flex relative w-full h-9 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left
                            text-black shadow-sm sm:text-sm sm:leading-6
                            ring-1 ring-gray-300 placeholder:text-gray-500
                            focus:ring-indigo-500 focus:ring-2 focus:outline-0
                            dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300">
                        <span className="flex truncate -mt-0.5">Manage Project Employees</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDoubleDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {employees.map((employee) => (
                                <Listbox.Option
                                    className={({active}) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                                        }`
                                    }
                                    value={employee.name}
                                    onClick={() => handleSelect(employee.id)}
                                >
                                    {({selected}) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {employee.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        )
    }

    //The rename box.
    const renderRename = projects.map((project) => {
        if (project.id === projectID) {
            return (
                <div className="flex ml-1 mt-2 mx-4 pt-1">
                    <input
                        id={project.id}
                        type="text"
                        value={inputValue}
                        placeholder={project.name}
                        onChange={handleInputChange}
                        className="flex z-0 align-middle p-2 px-2 pr-10 h-9 min-w-60 relative min-w-70 transition-all duration-500 rounded-lg
                                    text-black shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                    />
                    <button className="flex z-10 justify-end h-8 w-auto mt-0.5 -ml-9 "
                            onClick={async () => {
                                await updateName()
                                handleLocalRename(inputValue);
                                //Change the local projects array to reflect the changes
                            }}
                    >
                        <img
                            className="justify-end mx-auto h-8 w-auto"
                            src={saveIcon}
                            alt="Save Project Name">
                        </img>
                    </button>
                </div>
            )
        }//end if
    });//end renderRename

    //the Delete Button
    const renderDelete = () => {
        return (
            <div>
                <button className="flex pt-4 -ml-1 pb-0"
                        onClick={async () => {
                            await deleteProject()
                        }}//end onCLick
                >
                    <img
                        className="h-8 w-8"
                        src={deleteIcon}
                        alt="Delete Role">
                    </img>
                </button>
            </div>
        )
    }//end renderDelete()

    return (
        <div className="App mt-20 w-full h-[calc(100vh-5rem)] overflow-hidden">
            <header
                className="flex-shrink-0 dark:border-gray-700 border-b-2 px-14 py-1 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-500">Dashboard</h1>
            </header>
            <div className="flex flex-row items-start m-2 gap-4">
                <div className="flex-col w-1/3 items-center h-[calc(100vh-8rem)] overflow-y-scroll">
                    <div className="flex-col w-full space-y-2 p-3">
                        <button
                            className="flex justify-center bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                            onClick={async () => {
                                setOwner(false)
                                setHome(true)
                                setProjectID(null)
                                setInitialNamePrompt(false)
                            }}
                        >
                            <p>HOME</p>
                        </button>

                        <h2 className="flex mt-4 ml-6 mb-2 justify-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white border-b-2">
                            Projects
                        </h2>

                        {renderProjectNames()}
                        <>
                            <button
                                className="bg-indigo-700 hover:bg-indigo-500 w-full text-white font-bold py-2 px-4 rounded transition-all duration-500"
                                onClick={async () => {
                                    setInitialNamePrompt(true)
                                    setProjectName("")
                                    setInputValue("")
                                }}
                            >
                                <p>Add Project +</p>
                            </button>
                            {initialNamePrompt && renderNamePrompt()}

                        </>
                    </div>
                </div>
                <vr className="border-r-2 h-[calc(100vh-8rem)]"/>
                <div className="flex-col w-full items-center h-[calc(100vh-8rem)]">
                    <div className="flex  justify-between border-b-2 p-2">
                        <h2 className="flex justify-start text-2xl font-bold text-gray-900 dark:text-white">
                            {(home && !initialNamePrompt) ? "Home" : `${projectName}` }
                            {initialNamePrompt ? "Creating new project" : ""}
                        </h2>
                        <div className="flex items-center justify-center space-x-5">
                            {!initialNamePrompt && (
                                <Box component="h2" className="justify-center items-center"
                                     style={{
                                         display: "flex",
                                         flexDirection: "row"
                                     }}
                                >
                                    {owner === true && renderRename}
                                    {owner === true && renderEmployeeList()}
                                    {owner === true && renderDelete()}
                                </Box>
                            )}
                            {(permissions[6] && !initialNamePrompt) && (
                                <DocumentUpload projectId={projectID} canSelect={permissions[4]} socket={socket}  />
                            )}
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                        gap-4 p-2 overflow-y-scroll h-[calc(100vh-12rem)]">
                        {(home && !initialNamePrompt) && renderHomeDocumentNames()}
                        {(!home && !initialNamePrompt) && renderProjectDocumentNames()}
                    </div>
                </div>
            </div>

        </div>
    );
}
