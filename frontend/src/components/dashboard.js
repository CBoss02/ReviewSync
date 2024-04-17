import React, {Fragment, useState, useEffect} from "react";
import {ArrowRightIcon} from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDoubleDownIcon} from '@heroicons/react/solid';
import axios from 'axios';

const documentNames = [["HomeDocument1", "HomeDocument2", "HomeDocument3"], ["FirebaseDocument1", "FirebaseDocument2", "FirebaseDocument3"]]
export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = React.useState(0);
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [namePrompt, setNamePrompt] = useState(0);
    const [rename, setRename] = useState(0);
    const [home, setHome] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [companyID, setCompanyID] = useState(0);
    const [projectChange, setProjectChange] = useState(0);
    const [permissions, setPermissions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [owner, setOwner] = useState(false);

    const auth = useAuth();
    const uid = auth.currentUser.uid;

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchProjects = async () => {
                try {
                    await axios.post("/api/projects/getProjects", {
                        uid: uid
                    }).then((response) => {
                        setProjects(response.data.projects)
                        setProjectChange(0)
                    });
                } catch (error) {
                    console.error('Failed to fetch projects:', error);
                }
            };
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
            fetchCompanyID()
            fetchPermissions()
            fetchEmployees()
            fetchProjects()
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchEmployeesOnProject = async () => {
            if(projectID !== 0)
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
        fetchEmployeesOnProject()
    }, [projectID]);

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

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const addProject = async () => {
        try {
            await axios.post("/api/projects/createProject", {
                name: inputValue,
                owner: uid,
                companyID: companyID
            }).then(() => {
                setNamePrompt(0)
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
                setRename(0)
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
                        if(namePrompt)
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

    const handleSelect = (employeeID) => {
        axios.put("/api/projects/updateEmployee", {employeeID: employeeID, companyID: companyID, projectID: projectID})
    }

    //now to fetch the permissions, you first get the company id, see if it's equal to the state,
    //then if it is, fetch the permissions. The state that's shared would be [companyID, refetch] where
    //refetch is a bool? Then on change of the state which only happens when the user saves all the
    //roles, it changes the value of the state which will trigger the function to fetch permissions
    //in the other component
    //Today: 5.25 hours
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

    const renderRenameAndDelete = () => {
        return (
            <div>
                <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                    style={{marginRight: "15px"}}
                    onClick={() => setRename(1)}
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
                    {projects.map((data) => {
                        return (
                            <>
                                <button
                                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                    onClick={async () => {
                                        setProjectID(data.id)
                                        if(data.owner === uid)
                                            setOwner(true)
                                        else
                                            setOwner(false)
                                        setNamePrompt(0)
                                    }}
                                >
                                    <p>{data.name}</p>
                                </button>
                            </>
                        );
                    })}
                    <>
                        <button
                            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                            onClick={() => setNamePrompt(1)}
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

                    {(namePrompt === 1 || rename === 1) && renderNamePrompt()}
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
