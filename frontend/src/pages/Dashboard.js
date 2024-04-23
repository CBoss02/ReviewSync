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
import CreateProject from "../components/project/CreateProject";
import {useNavigate} from "react-router-dom";

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
    const [eUpdated, setEUpdated] = useState(false); //Indicates if employees in company have changed
    const [rolesUpdated, setRolesUpdated] = useState(false); //Indicates if company roles have changed
    const [cUpdated, setCUpdated] = useState(false); //Indicates if a user has been removed from a company
    const [dUpdated, setDUpdated] = useState(false); //Indicates if a user has been added to/removed from a document
    const [pUpdated, setPUpdated] = useState(false); //Indicates if a user has been added to/removed from a project
    const [roleUpdated, setRoleUpdated] = useState(false); //Indicates if a user's role has changed
    const [documents, setDocuments] = useState([]);
    const [selected, setSelected] = useState("Home");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/documents/getAllDocuments');
                console.log(res.data);
                setDocuments(res.data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
        fetchData();
    }, []);

    const handleDocumentClick = async (documentId) => {
        navigate(`/document/${documentId}`);
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
            </Box>
        </div>
    );
}
