import React, {Fragment, useState, useEffect} from "react";
import {ArrowRightIcon} from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDoubleDownIcon} from '@heroicons/react/solid';
import axios from 'axios';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = React.useState(0);
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [initialNamePrompt, setInitialNamePrompt] = useState(false);
    const [rename, setRename] = useState(false);
    const [home, setHome] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [companyID, setCompanyID] = useState(0);
    const [permissions, setPermissions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [owner, setOwner] = useState(false);
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
            await axios.post("/api/companies/getEUpdatedFlag", {
                companyID: companyID
            }).then((response) => {
                setEUpdated(response.data.eUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch eUpdated flag:', error);
        }
    }

    const resetEUpdatedFlag = async () => {
        try {
            await axios.put("/api/companies/resetEUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset eUpdated flag:', error);
        }
    }

    const fetchRolesUpdatedFlag = async () => {
        try {
            await axios.post("/api/companies/getRolesUpdatedFlag", {
                companyID: companyID
            }).then((response) => {
                setRolesUpdated(response.data.rolesUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch rolesUpdated flag:', error);
        }
    }

    const resetRolesUpdatedFlag = async () => {
        try {
            await axios.put("/api/companies/resetRolesUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset rolesUpdated flag:', error);
        }
    }

    const fetchCUpdatedFlag = async () => {
        try {
            await axios.post("/api/users/getCUpdatedFlag", {
                uid: uid
            }).then((response) => {
                setCUpdated(response.data.cUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch cUpdated flag:', error);
        }
    }

    const resetCUpdatedFlag = async () => {
        try {
            await axios.put("/api/users/resetCUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset cUpdated flag:', error);
        }
    }

    const fetchRoleUpdatedFlag = async () => {
        try {
            await axios.post("/api/users/getRoleUpdatedFlag", {
                uid: uid
            }).then((response) => {
                setRoleUpdated(response.data.roleUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch roleUpdated flag:', error);
        }
    }

    const resetRoleUpdatedFlag = async () => {
        try {
            await axios.put("/api/users/resetRoleUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset rolesUpdated flag:', error);
        }
    }

    const fetchDUpdatedFlag = async () => {
        try {
            await axios.post("/api/users/getDUpdatedFlag", {
                uid: uid
            }).then((response) => {
                setDUpdated(response.data.dUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch dUpdated flag:', error);
        }
    }

    const resetDUpdatedFlag = async () => {
        try {
            await axios.put("/api/users/resetDUpdatedFlag", {
                uid: uid
            })
        } catch (error) {
            console.error('Failed to reset dUpdated flag:', error);
        }
    }

    const fetchPUpdatedFlag = async () => {
        try {
            await axios.post("/api/users/getPUpdatedFlag", {
                uid: uid
            }).then((response) => {
                setPUpdated(response.data.pUpdated)
            });
        } catch (error) {
            console.error('Failed to fetch pUpdated flag:', error);
        }
    }

    const resetPUpdatedFlag = async () => {
        try {
            await axios.put("/api/users/resetPUpdatedFlag", {
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
            await axios.post("/api/companies/getCompanyID", {
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
            await axios.post("/api/projects/getProjects", {
                uid: uid
            }).then((response) => {
                setProjects(response.data.projects)
            });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };
    const fetchPermissions = async () => {
        try {
            await axios.post("/api/users/getPermissions", {
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
            await axios.post("/api/companies/getEmployees", {
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
                await axios.post("/api/projects/getEmployeesOnProject", {
                    uid: uid,
                    companyID: companyID,
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
            await axios.post("/api/projects/createProject", {
                name: inputValue,
                owner: uid,
                companyID: companyID
            }).then(() => {
                setInitialNamePrompt(false)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    }

    const updateName = async () => {
        try {
            await axios.put("/api/projects/updateName", {
                name: inputValue,
                companyID: companyID,
                projectID: projectID
            }).then(() => {
                setRename(false)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    }

    const deleteProject = async () => {
        try {
            await axios.delete("/api/projects/deleteProject", { data: { companyID: companyID, projectID: projectID }}).then(() => {
                setHome(1)
            })
        } catch (error) {
            console.error('Failed to add project:', error);
        }
    }

    //Happens immediately on render, but only once
    useEffect(() => {
        fetchCompanyID();
        fetchPermissions();
        fetchEmployees();
        fetchProjects();
    }, []);

    //This function checks every 5 seconds for flags in the database that indicate if certain
    //information has been updated and needs to be re-fetched, such as the
    //documents/projects a user has access to and their role.

    useEffect(() => {
        const interval = setInterval(() => {
            fetchFlags();
            if(cUpdated) //user was just removed from company. Redirect to somewhere. todo
            {
                resetCUpdatedFlag()
            }
            if(roleUpdated || rolesUpdated) //if user's role has changed, or company owner has modified role names/permissions
            {
                fetchPermissions();
                if(roleUpdated)
                    resetRoleUpdatedFlag()
                if(rolesUpdated)
                    resetRolesUpdatedFlag()
            }
            if(eUpdated) //user(s) was/were just added/removed from this company, or their roles have changed
            {
                fetchEmployees();
                resetEUpdatedFlag()
            }
            if(pUpdated)
            {
                fetchProjects()
                resetPUpdatedFlag()
            }
        }, 5000); //check every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchEmployeesOnProject()
    }, [projectID]);

    //Handles a project's name change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //Handles an employee being added to/removed from a project
    const handleSelect = (employeeID) => {
        axios.put("/api/projects/updateEmployee", {employeeID: employeeID, companyID: companyID, projectID: projectID})
    }

    const renderProjectNames = () => {
        return projects.map((data) => (
                <>
                    <button
                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                        onClick={async () => {
                            setProjectID(data.id)
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

    /*
    const renderDocumentNames = () => {
        return documentNames[projectID].map((data) => (
            <button
                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                onClick={() => console.log("ok")}
            >
                <p>{data}</p>
            </button>
        ))
    }
    */

    //The prompt to name/rename a project. Appears when a project is initially created
    //and when the user presses the Rename button.
    const renderNamePrompt = () => {
        return (
            <div id="inputContainer"
                 className={`flex items-center space-x-5 transition-all duration-500`}>
                <input
                    type="text"
                    placeholder="New project name..."
                    className="w-full border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
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

    //The list of employees that can be added to/removed from a project.
    const renderEmployeeList = () => {
        return (
            <Listbox value={selectedPeople} multiple onChange={setSelectedPeople} style={{marginRight: "15px"}}>
                <div className="relative mt-1">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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

    //The rename and delete buttons.
    const renderRenameAndDelete = () => {
        return (
            <div>
                <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                    style={{marginRight: "15px"}}
                    onClick={() => setRename(true)}
                >
                    Rename
                </button>
                <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                    onClick={async () => {
                        await deleteProject()
                    } }
                >
                    Delete
                </button>
            </div>
        )
    }

    return (
        <div className="App">
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
                            setHome(1)
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
                    bgcolor="white"
                    style={{
                        overflowY: "auto",
                        maxHeight: "425px",
                        display: "column",
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
                    <Box component="h2" style={{display: "flex", flexDirection: "row"}}>
                        {owner === true && renderEmployeeList()}
                        {owner === true && renderRenameAndDelete()}
                    </Box>
                    <Divider color="#1bc41e" sx={{height: 2, width: '525px'}}></Divider>

                    {(initialNamePrompt || rename) && renderNamePrompt()}
                    {permissions[6] === 1 && (
                        <button
                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                        onClick={() => console.log("ok")}
                        >
                            <p>+</p>
                        </button>
                    )}
                </Box>
            </Box>
        </div>
    );
}
