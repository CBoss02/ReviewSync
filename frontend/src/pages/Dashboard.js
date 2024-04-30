import React, {Fragment, useState, useEffect} from "react";
import {ArrowRightIcon, DocumentIcon} from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";
import {Listbox, Transition, Dialog} from '@headlessui/react';
import {CheckIcon, ChevronDoubleDownIcon} from '@heroicons/react/solid';
import DocumentUpload from "../components/document/DocumentUpload";
import api from "../config/axiosConfig";
import deleteIcon from "../assets/icons/RedDelete-Icon.png";
import saveIcon from "../assets/icons/GreenSave-Icon.png";
import CreateProject from "../components/project/CreateProject";
import {useNavigate} from "react-router-dom";
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";
import FileViewer from "react-file-viewer";
import DocumentCard from "../components/document/DocumentCard";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = React.useState(0);
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
    const [eUpdated, setEUpdated] = useState(false); //Indicates if employees in company have changed
    const [rolesUpdated, setRolesUpdated] = useState(false); //Indicates if company roles have changed
    const [cUpdated, setCUpdated] = useState(false); //Indicates if a user has been removed from a company
    const [dUpdated, setDUpdated] = useState(false); //Indicates if a user has been added to/removed from a document
    const [pUpdated, setPUpdated] = useState(false); //Indicates if a user has been added to/removed from a project
    const [roleUpdated, setRoleUpdated] = useState(false); //Indicates if a user's role has changed
    const [documents, setDocuments] = useState([]);
    const [selected, setSelected] = useState("Home");
    const navigate = useNavigate();

    const auth = useAuth();
    const uid = auth.currentUser.uid;

    /*    const fetchEUpdatedFlag = async () => {
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
                    setInitialNamePrompt(false)
                    setPUpdated(true)
                })
            } catch (error) {
                console.error('Failed to add project:', error);
            }
        }

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
                    setHome(true)
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

        /!* Minimize calls to DB when testing to avoid maxing out firebase quota
        useEffect(() => {
            const interval = setInterval(() => {
                //fetchFlags()
            }, 5000); //check every 5 seconds
            return () => clearInterval(interval);
        }, []);
        *!/

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
                <button className="flex justify-center bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded min-w-80 transition-all duration-500" onClick={() => handleDocumentClick(document.id)}>
                    <p>{document.name}</p>
                </button>
            ))
        }

        const handleDocumentClick = async (documentId) => {
            navigate(`/document/${documentId}`);
        }


        const renderNamePrompt = () => {
            return (
                <div id="inputContainer"
                     className={`flex items-center space-x-5 transition-all duration-500`}>
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
                            if(initialNamePrompt)
                            {
                                await addProject()
                            }
                            if(rename)
                            {
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
                                //If this isn't the first project in the list
                                if(projects[0].id!==projectID){
                                    //Find the index of the role that we want to delete
                                    for(let project of projects){
                                        if(project.id === projectID) {
                                            let index  = projects.indexOf(project);

                                            //swap to the role AFTER the role we are deleting
                                            setProjectID(projects[index-1].id)

                                            //filter out the role we want to "delete"
                                            setProjects(projects.filter(project => project !== projects[index]));
                                        }//end nested if
                                    }//end for

                                    // /This is the very first element in the list, set the active project to home
                                }else{
                                    //update the active project to the following role in the list
                                    setProjectID(0);
                                    setHome(true);
                                    setOwner(false); //Navigate to the Home page

                                    //get rid of the first element in the list
                                    setProjects(projects.filter(project => project !== projects[0]));
                                }//end if else
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
        }//end renderDelete()*/


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/documents/getAllDocuments');
                setDocuments(res.data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/projects/getAllProjects');
                setProjects(res.data)
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
        fetchData();
    }, []);

    const handleProjectClick = async (project) => {
        if (project === null || project === undefined) {
            setSelected("Home")
            try {
                const res = await api.get('/api/documents/getAllDocuments');
                setDocuments(res.data);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        } else {
            setSelected(project)
            try {
                const res = await api.get(`/api/documents/getAllDocuments/${project.id}`);
                setDocuments(res.data);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        }
    }

        return (
            <div className="flex flex-row mt-16 p-8 gap-x-4 h-[calc(100vh-4rem)] overflow-hidden">
                {/* Projects Div */}
                <div className="flex flex-col w-full lg:w-1/3 gap-2 overflow-auto">
                    <button
                        className="bg-green-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500">
                        Create Project
                    </button>
                    <button
                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                        onClick={() => setSelected("Home")}>Home
                    </button>
                    {projects.map((project) => (
                        <button
                            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                            onClick={() => handleProjectClick(project)}
                        >
                            {project.name}
                        </button>
                    ))}
                </div>
                <vr className="hidden lg:block border-r-2 border-gray-400"/>
                {/* Documents Grid */}
                <div className="flex flex-col w-full">
                    <header
                        className="flex items-center justify-between text-gray-700 dark:text-gray-100 w-full my-2 py-2 border-b-2 border-b-gray-400 gap-1">
                        <h1 className="text-xl font-semibold">{(selected.name) ? selected.name : "Home"}</h1>
                    </header>
                    <div className="grid grid-cols-4 w-full overflow-auto gap-4">
                        {documents.map((document) => (
                            <DocumentCard document={document}/>
                        ))}
                    </div>
                </div>
            </div>
            /*              <DocumentUpload/>
                        <Box
                            sx={{
                                height: '100vh',
                                overflow: 'auto',
                                justifyContent: "center",
                                display: 'flex',
                                flexWrap: 'wrap',
                                marginTop: '30px',
                                alignContent: 'space-between'
                            }}>
                            <Box
                                bgcolor="white"
                                style={{
                                    overflowY: "auto",
                                    maxHeight: "425px",
                                    display: "flex",
                                    flexGrow: 1,
                                    flexDirection: "column",
                                    marginLeft: "25px",
                                    marginRight: "25px"
                                }}
                                height={800}
                                width={200}
                                my={0}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                p={2}
                                sx={{border: '2px solid grey'}}
                            >
                                <button
                                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                    onClick={async () => {
                                        setOwner(false)
                                    }}
                                >
                                    <p>HOME</p>
                                </button>
                                {renderProjectNames()}
                                <>
                                    <button
                                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
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
                                <Box component="h2" className="justify-center" style={{display: "flex", flexDirection: "row"}}>
                                    {owner === true && renderRename}
                                    {owner === true && renderEmployeeList()}
                                    {owner === true && renderDelete()}
                                </Box>
                                <Divider color="#1bc41e" sx={{height: 2, width: '525px'}}></Divider>

                                {(initialNamePrompt || rename) && renderNamePrompt()}
                                {home && renderDocumentNames()}
                                {permissions[6] && (
                                    <button
                                        className="bg-blue-700 hover:bg-blue-500 min-w-80 text-white font-bold py-2 px-4 rounded transition-all duration-500"
                                        onClick={() => setPopupIsOpen(true)}
                                    >
                                        <p>+</p>
                                    </button>
                                )}
                            </Box>
                        </Box>*/
        );
    }
