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

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = React.useState(0);
    const [documents, setDocuments] = useState([]);
    const [companyID, setCompanyID] = useState("");
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [initialNamePrompt, setInitialNamePrompt] = useState(false);
    const [rename, setRename] = useState(false);
    const [home, setHome] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [owner, setOwner] = useState(false);
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [eUpdated, setEUpdated] = useState(false); //Indicates if employees in company have changed
    const [rolesUpdated, setRolesUpdated] = useState(false); //Indicates if company roles have changed
    const [cUpdated, setCUpdated] = useState(false); //Indicates if a user has been removed from a company
    const [dUpdated, setDUpdated] = useState(false); //Indicates if a user has been added to/removed from a document
    const [pUpdated, setPUpdated] = useState(false); //Indicates if a user has been added to/removed from a project
    const [roleUpdated, setRoleUpdated] = useState(false); //Indicates if a user's role has changed

    const auth = useAuth();
    const uid = auth.currentUser.uid;

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

    const fetchCompanyID = async () => {
        try {
            await api.post("/api/companies/getCompanyID", {
                uid: uid
            }).then((response) => {
                setCompanyID(response.data.companyID)
            });
        } catch (error) {
            console.error('Failed to fetch company ID:', error);
        }
    }

    const fetchProjects = async () => {
        try {
            await api.post("/api/projects/getProjects", {uid: uid}).then((response) => {
                setProjects(response.data.projects)
            });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const fetchHomeDocuments = async () => {
        try {
            await api.get("/api/documents/getHomeDocuments").then((response) => {
                setDocuments(response.data.documents)
            });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };
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
    const fetchEmployees = async () => {
        try {
            await api.post("/api/companies/getEmployees", {
                uid: uid
            }).then((response) => {
                setEmployees(response.data.employees)
            });
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    }
    const fetchEmployeesOnProject = async () => {
        if(!home) //if user is not viewing home page
        {
            try {
                await api.post("/api/projects/getEmployeesOnProject", {
                    uid: uid,
                    projectID: projectID
                }).then((response) => {
                    setSelectedPeople(response.data.employees)
                });
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
    };

    const addProject = async () => {
        try {
            await api.post("/api/projects/createProject", {
                name: inputValue,
                owner: uid
            }).then(() => {
                handleLocalNewProject(inputValue, uid)
                setInitialNamePrompt(false)
                setPUpdated(true)
                setHome(true)
                setOwner(false)
                setProjectID(0)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    }

    //Updates the projects array locally to reflect the database change
    function handleLocalNewProject(newName){
        setProjects([...projects, {
            name: newName,
            owner: uid
        }])
    }//end handleLocalNewProject function

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
        }
    };

    const updateName = async () => {
        try {
            await api.put("/api/projects/updateName", {
                name: inputValue,
                projectID: projectID,
                uid: uid
            }).then(() => {
                setRename(0)
                setRename(false)
                setPUpdated(true)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    }

    const deleteProject = async () => {
        try {
            await api.delete("/api/projects/deleteProject", { data: { uid: uid, projectID: projectID }}).then(() => {
            })
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    }

    //Happens immediately on render, but only once
    useEffect(() => {
        fetchCompanyID();
        fetchPermissions();
        fetchEmployees();
        fetchProjects();
        fetchHomeDocuments();
    }, []);

    //This function checks every 5 seconds for flags in the database that indicate if certain
    //information has been updated and needs to be re-fetched, such as the
    //documents/projects a user has access to and their role.

    /* Minimize calls to DB when testing to avoid maxing out firebase quota
    useEffect(() => {
        const interval = setInterval(() => {
            //fetchFlags()
        }, 5000); //check every 5 seconds
        return () => clearInterval(interval);
    }, []);
    */

    useEffect(() => {
        fetchEmployeesOnProject()
    }, [projectID]);

    //Handles a project's name change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //Handles an employee being added to/removed from a project
    const handleSelect = (employeeID) => {
        api.put("/api/projects/updateEmployee", {employeeID: employeeID, uid: uid, projectID: projectID})
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

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const renderProjectNames = () => {
        return projects.map((data) => (
                <>
                    <button
                        className="flex justify-center bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded min-w-80 transition-all duration-500"
                        onClick={async () => {
                            setProjectID(data.id)
                            setHome(false)
                            setInputValue(data.name)
                            if(data.owner === uid)
                                setOwner(true)
                            else
                                setOwner(false)
                            setInitialNamePrompt(false)
                        }}
                    >
                        <p>{data.name}</p>
                    </button>
                </>
            )
        )
    }


    const renderDocumentNames = () => {
        return documents.map((document) => (
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

//The prompt to name/rename a project. Appears when a project is initially created
//and when the user presses the Rename button.

    const renderNamePrompt = () => {
        return (
            <div id="inputContainer"
                 className={`flex items-center space-x-5 transition-all duration-500 mt-2`}>
                <input
                    type="text"
                    placeholder="New project name..."
                    className="min-w-70 border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button
                    className="flex justify-center py-3 h-10 w-14 bg-blue-700 hover:bg-blue-500 text-white font-bold px-4 rounded-full"
                    onClick={async () => {
                        if(initialNamePrompt) {
                            await addProject()
                        }
                        if(rename) {
                            await updateName()
                        }
                    }}
                >
                    <ArrowRightIcon className="h-4 w-4"/>
                </button>
            </div>
        )
    }

    const renderEmployeeList = () => {
        return (
            <Listbox value={selectedPeople} multiple onChange={setSelectedPeople} style={{marginRight: "15px"}}>
                <div className="relative mt-1 pt-2">
                    <Listbox.Button
                        className="relative w-full h-9 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left
                        shadow-sm ring-1 ring-gray-300 placeholder:text-black focus:ring-2
                        focus:ring-inset justify-center focus:ring-indigo-600 sm:leading-6 px-2 dark:ring-indigo-600 dark:ring-2
                         focus-visible:border-indigo-500 focus-visible:ring-2
                          focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">Manage Project Employees</span>
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
                <div className="flex mt-2 mx-4 pt-1">
                    <input
                        id={project.id}
                        type="text"
                        value={inputValue}
                        placeholder={project.name}
                        onChange={handleInputChange}
                        className="flex align-middle p-2 rounded-md h-9 border-0 min-w-60 text-black shadow-sm ring-1
                         ring-gray-300 placeholder:text-black justify-center -ml-3
                        focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 dark:ring-indigo-600"
                    />

                    <button className="flex justify-end h-8 w-auto mt-0.5 -ml-9"
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

    //the Delete Box
    const renderDelete = () => {
        return (
            <div>
                <button className="flex pt-4 pb-0"
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
                            setProjectID(0);
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

    return (
        <div className="App ">
            <Box
                sx={{
                    //height: '100vh',
                    overflow: 'auto',
                    justifyContent: "center",
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '30px',
                    alignContent: 'space-between'
                }}>
                <Box
                    className="flex rounded w-auto min-w-400"
                    //bgcolor="white"
                    style={{
                        overflowY: "auto",
                        maxHeight: "425px",
                        display: "flex",
                        //flexGrow: 1,
                        flexDirection: "column",
                        marginLeft: "25px",
                        //marginRight: "25px"
                    }}
                    //height={800}
                    height={425}
                    //width={400}
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
                            setProjectID(0)
                        }}
                    >
                        <p>HOME</p>
                    </button>


                    <Divider className="h-2 min-w-425 w-auto"
                    color="#1bc41e" sx={{height: 2, width: '320px'}}></Divider>

                    {renderProjectNames()}
                    <>
                        <button
                            className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                            onClick={() => setInitialNamePrompt(true)}
                        >
                            <p>+</p>
                        </button>
                    </>
                </Box>
                <Box
                    className="rounded"
                    bgcolor="white"
                    style={{
                        overflowY: "auto",
                        maxHeight: "425px",
                        display: "column",
                        //flexGrow: 1,
                        flexDirection: "column",
                        marginLeft: "25px",
                        marginRight: "25px"
                    }}
                    //height={800}
                    //width={200}
                    height={425}
                    width={600}
                    my={0}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    p={1}
                    sx={{border: '2px solid grey'}}
                >
                    {(!initialNamePrompt && !rename) && (
                        <Box component="h2" className="justify-center" style={{display: "flex", flexDirection: "row"}}>
                            {owner === true && renderRename}
                            {owner === true && renderEmployeeList()}
                            {owner === true && renderDelete()}
                        </Box>
                    )}


                    {((!initialNamePrompt && !rename) && (owner === true)) && (
                        <Divider color="#1bc41e" sx={{height: 2, width: '525px'}}/>
                    )}


                    {(initialNamePrompt || rename) && renderNamePrompt()}
                    {home && renderDocumentNames()}
                    {(permissions[6] && (!initialNamePrompt && !rename)) &&(
                        <button
                            className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                            onClick={() => setPopupIsOpen(true)}
                        >
                            <p>+</p>
                        </button>
                    )}

                </Box>
            </Box>
            {popupIsOpen && renderPopup()}
        </div>
    );
}
