import React, {Fragment, useState, useEffect} from "react";
import {ArrowRightIcon} from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";
import {Listbox, Transition, Dialog} from '@headlessui/react';
import {CheckIcon, ChevronDoubleDownIcon} from '@heroicons/react/solid';
import DocumentUpload from "../components/document/DocumentUpload";
import api from "../config/axiosConfig";
import deleteIcon from "../assets/icons/RedDelete-Icon.png";
import saveIcon from "../assets/icons/GreenSave-Icon.png";
import useIdleTimeout from "../components/idleTimer/idleTimer";
import {useNavigate} from "react-router-dom";

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
    const [popupIsOpen, setPopupIsOpen] = useState(false); //for document upload
    const [file, setFile] = useState(null); //for document upload
    const [eUpdated, setEUpdated] = useState(false); //Indicates if employees in company have changed
    const [rolesUpdated, setRolesUpdated] = useState(false); //Indicates if company roles have changed
    const [cUpdated, setCUpdated] = useState(false); //Indicates if a user has been removed from a company
    const [dUpdated, setDUpdated] = useState(false); //Indicates if a user has been added to/removed from a document
    const [pUpdated, setPUpdated] = useState(false); //Indicates if a user has been added to/removed from a project
    const [roleUpdated, setRoleUpdated] = useState(false); //Indicates if a user's role has changed
    const navigate = useNavigate();

    useIdleTimeout(); //starts a timer that will log the user out after 10 minutes of inactivity

    const auth = useAuth(); //we may get rid of this entirely
    const uid = auth.currentUser.uid;

    const { logout } = useAuth(); //called when calling the API tells us that a user's login token has expired

    const fetchEUpdatedFlag = async () => {
        try {
            await api.post("/api/companies/getEUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.eUpdated)
                {
                    fetchEmployees()
                    resetEUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch eUpdated flag:', error);
        }
    }

    const resetEUpdatedFlag = async () => {
        try {
            await api.put("/api/companies/resetEUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset eUpdated flag:', error);
        }
    }

    const fetchRolesUpdatedFlag = async () => {
        try {
            await api.post("/api/companies/getRolesUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.rolesUpdated)
                {
                    fetchPermissions()
                    resetRolesUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch rolesUpdated flag:', error);
        }
    }

    const resetRolesUpdatedFlag = async () => {
        try {
            await api.put("/api/companies/resetRolesUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset rolesUpdated flag:', error);
        }
    }

    const fetchCUpdatedFlag = async () => {
        try {
            await api.post("/api/users/getCUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.cUpdated)
                {
                    //redirect
                    resetCUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch cUpdated flag:', error);
        }
    }

    const resetCUpdatedFlag = async () => {
        try {
            await api.put("/api/users/resetCUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset cUpdated flag:', error);
        }
    }

    const fetchRoleUpdatedFlag = async () => {
        try {
            await api.post("/api/users/getRoleUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.roleUpdated)
                {
                    fetchPermissions()
                    resetRoleUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch roleUpdated flag:', error);
        }
    }

    const resetRoleUpdatedFlag = async () => {
        try {
            await api.put("/api/users/resetRoleUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset rolesUpdated flag:', error);
        }
    }

    const fetchDUpdatedFlag = async () => {
        try {
            await api.post("/api/users/getDUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.dUpdated)
                {
                    //refetch documents
                    resetDUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch dUpdated flag:', error);
        }
    }

    const resetDUpdatedFlag = async () => {
        try {
            await api.put("/api/users/resetDUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset dUpdated flag:', error);
        }
    }

    const fetchPUpdatedFlag = async () => {
        try {
            await api.post("/api/users/getPUpdatedFlag", {
                uid: uid
            }).then((response) => {
                if(response.data.pUpdated)
                {
                    fetchProjects()
                    resetPUpdatedFlag()
                }
            });
        } catch (error) {
            console.error('Failed to fetch pUpdated flag:', error);
        }
    }

    const resetPUpdatedFlag = async () => {
        try {
            await api.put("/api/users/resetPUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to fetch pUpdated flag:', error);
        }
    }

    const fetchFlags = async () => {
        fetchEUpdatedFlag()
        fetchRolesUpdatedFlag()
        fetchCUpdatedFlag()
        fetchRoleUpdatedFlag()
        fetchDUpdatedFlag()
        fetchPUpdatedFlag()
    }

    //Fetches the projects this user has access to
    const fetchProjects = async () => {
        try {
            await api.get("/api/projects/getProjects").then((response) => {
                setProjects(response.data.projects)
            });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            if(error.response.data === 'Invalid token') //if user's login token has expired, log them out
            {
                logout();
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
            if(error.response.data === 'Invalid token')
            {
                logout();
            }
        }
    };

    //Fetches this user's permissions
    const fetchPermissions = async () => {
        try {
            await api.post("/api/users/getPermissions", {
                uid: uid
            }).then((response) => {
                setPermissions(response.data.permissions)
            });
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
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
            }
        }
    };

    //Called when a user switches to a certain project to get the employees assigned to this project
    const fetchEmployeesOnProject = async () => {
        try {
            await api.post("/api/projects/getEmployeesOnProject", {
                projectID: projectID
            }).then((response) => {
                setSelectedPeople(response.data.employees)
            });
        } catch (error) {
            console.error('Failed to fetch employees on project:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
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
                setPUpdated(true) //prob will get rid
                setHome(true)
                setOwner(false)
                setProjectID(null)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
            }
        }
    }

    //Updates the projects array locally to reflect the database change
    function handleLocalNewProject(newName){
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
            }).then(() => {
                setPUpdated(true)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
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
            if(error.response.data === 'Invalid token')
            {
                logout();
            }
        }
    }

    //Deletes a project
    const deleteProject = async () => {
        try {
            await api.delete("/api/projects/deleteProject",
                { data:
                        { projectID: projectID }
                }).then(() => {
            })
        } catch (error) {
            console.error('Failed to delete project:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
            }
        }
    }

    //Uploads a document to the database
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectID', projectID);
        try {
            const response = await api.post('/api/documents/uploadDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Upload successful', response.data);
            setPopupIsOpen(false);
        } catch (error) {
            console.error('Upload failed', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
            }
        }
    };

    //Immediately on render, get a user's permissions, projects, home documents, and the employees in the company
    useEffect(() => {
        fetchPermissions();
        fetchEmployees();
        fetchProjects();
        fetchHomeDocuments();
    }, []);

    /* Minimize calls to DB when testing to avoid maxing out firebase quota
    useEffect(() => {
        const interval = setInterval(() => {
            //fetchFlags()
        }, 5000); //check every 5 seconds
        return () => clearInterval(interval);
    }, []);
    */

    //When the project ID changes (when the user clicks on a project), get the documents in this project, and if the user is the owner, get the employees on this project
    useEffect(() => {
        if(!home)
        {
            fetchProjectDocuments()
            if(owner)
            {
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

    function handleLocalRename(newName){
        setProjects(projects.map(project => {
            if(project.id === projectID) {
                return {...project, name: newName};
            }else{
                return project;
            }//end if else
        }));//end map
    }//end function

    //When a file is selected by the user
    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    //Displays the projects as a list of buttons
    const renderProjectNames = () => {
        return projects.map((data) => (
                <>
                    <button
                        className="flex justify-center bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded min-w-80 transition-all duration-500"
                        onClick={async () => {
                            setProjectID(data.id)
                            setHome(false)
                            if(data.owner === uid)
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
            <button
                className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                onClick={() => handleDocumentRedirect(document.id)}
            >
                <p>{document.name}</p>
            </button>
        ))
    }

    const renderProjectDocumentNames = () => {
        return projectDocuments.map((document) => (
            <button
                className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                onClick={() => console.log("ok")}
            >
                <p>{document.name}</p>
            </button>
        ))
    }

    //We're probably going to switch to Megh's component for this but I'll leave it here just in case
    const renderPopup = () => {
        return (
            <>
                <Dialog as="div" className="relative z-10" open={popupIsOpen} onClose={() => setPopupIsOpen(false)}>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Dialog.Panel
                                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-black-900"
                                    style={{marginBottom: "15px"}}
                                >
                                    Upload a new document
                                </Dialog.Title>
                                <div>
                                    <input type="file" onChange={handleFileChange}/>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={handleUpload}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </>
        )
    }

    //Displays a prompt to name a new project, and calls the function to add the project to the database when they submit it
    const renderNamePrompt = () => {
        return (
            <div id="inputContainer"
                 className={`flex items-center space-x-5 transition-all duration-500 mt-2`}>
                <input
                    type="text"
                    placeholder="New project name..."
                    className="relative min-w-70 transition-all duration-500 rounded-lg
                                    p-2 h-9 px-2 min-w-28 text-black
                                    shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button
                    className="flex justify-center py-2.5 h-9 w-12 bg-blue-700 hover:bg-blue-500 text-white font-bold px-4 rounded-full"
                    onClick={async () => {
                        await addProject()
                    }}
                >
                    <ArrowRightIcon className="h-4 w-4"/>
                </button>
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
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {employees.map((employee) => (
                                <Listbox.Option
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                                        }`
                                    }
                                    value={employee.name}
                                    onClick={() => handleSelect(employee.id)}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {employee.name}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
        if(project.id===projectID){
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
                                setPUpdated(true);
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
                            //Find the index of the project that we want to delete
                            for(let project of projects){
                                if(project.id === projectID) {
                                    let index  = projects.indexOf(project);
                                    //filter out the project we want to "delete"
                                    setProjects(projects.filter(project => project !== projects[index]));
                                }//end nested if
                            }//end for
                            //Set the active project ot the home page
                            setProjectID(null);
                            setHome(true);
                            setOwner(false); //Navigate to the Home page
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

    //The actual code for the page
    return (
        <div className="App mt-16">
            <Box
                /*The left side box*/
                sx={{
                    overflow: 'auto',
                    justifyContent: "center",
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '30px',
                    alignContent: 'space-between'
                }}>
                <div className="flex-col align-top">
                    <h2 className="flex mt-4 ml-8 mb-2 justify-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Projects
                    </h2>
                    <Box
                        className="flex rounded w-auto min-w-400"
                        style={{
                            overflowY: "auto",
                            maxHeight: "425px",
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "25px",
                        }}
                        height={425}
                        my={0}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        sx={{border: '2px solid grey'}}
                    >
                        <button
                            className="flex justify-center bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded min-w-80 transition-all duration-500"
                            onClick={async () => {
                                setOwner(false)
                                setHome(true)
                                setProjectID(null)
                                setInitialNamePrompt(false)
                            }}
                        >
                            <p>HOME</p>
                        </button>
                        <Divider className="h-2 min-w-425 w-auto"
                                 color="#1bc41e" sx={{
                                     height: 2,
                                     width: '320px'
                        }}>
                        </Divider>
                        {renderProjectNames()}
                        <>
                            <button
                                className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                                onClick={async () => {
                                    setInitialNamePrompt(true)
                                    setInputValue("")
                                }}
                            >
                                <p>+</p>
                            </button>
                        </>
                    </Box>
                </div>
                <div className="flex-col align-top">
                    <h2 className="flex mt-4 mb-2 justify-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Documents
                    </h2>
                    <Box
                        /*The right side box*/
                        className="rounded flex"
                        style={{
                            overflowY: "auto",
                            maxHeight: "425px",
                            display: "column",
                            flexDirection: "column",
                            marginLeft: "25px",
                            marginRight: "25px"
                        }}
                        height={425}
                        width={600}
                        my={0}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={1}
                        sx={{border: '2px solid grey'}}
                    >
                        {!initialNamePrompt && (
                            <Box component="h2" className="justify-center"
                                 style={{
                                     display: "flex",
                                     flexDirection: "row"}}
                            >
                                {owner === true && renderRename}
                                {owner === true && renderEmployeeList()}
                                {owner === true && renderDelete()}
                            </Box>
                        )}
                        {(!initialNamePrompt && (owner === true)) && (
                            <Divider color="#1bc41e" sx={{
                                height: 2,
                                width: '525px'}}
                            />
                        )}
                        {initialNamePrompt && renderNamePrompt()}
                        {(home && !initialNamePrompt) && renderHomeDocumentNames()}
                        {(!home && !initialNamePrompt) && renderProjectDocumentNames()}
                        {(permissions[6] && !initialNamePrompt) && (
                            <DocumentUpload projectId={projectID}/>
                        )}
                    </Box>
                </div>
            </Box>
        </div>
    );
}
