// src/components/DocumentPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/axiosConfig'; // Axios configuration path
import DocumentFrame from '../components/document/DocumentFrame'; // Path to DocumentFrame component
import CommentSection from '../components/comment/CommentSection'; // Path to CommentSection component
import {CheckIcon, ChevronDoubleDownIcon, DotsHorizontalIcon, UploadIcon, XIcon} from '@heroicons/react/solid';
import {Listbox, Menu, Transition} from '@headlessui/react';
import { Fragment } from 'react';
import io from 'socket.io-client';
import {useAuth} from "../contexts/AuthContext";
import useIdleTimeout from "../components/idleTimer/idleTimer";

// Server endpoint for socket connection
const ENDPOINT = 'http://localhost:3001';
let socket;

// Utility function to combine CSS classes
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DocumentPage = () => {
    const { documentId } = useParams();
    const [document, setDocument] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [comments, setComments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState([]);

    useIdleTimeout();

    const { logout } = useAuth();

    // Fetches comments for the document
    const fetchComments = async () => {
        try {
            const response = await api.get(`/api/documents/getComments/${documentId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    }

    // Fetches the document details
    const fetchDocument = async () => {
        try {
            const response = await api.get(`/api/documents/getDocument/${documentId}`);
            setDocument(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch document', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    }

    // Initial data fetching
    useEffect(() => {
        fetchDocument();
        fetchComments();
    }, [documentId]);

    // Socket connection setup
    useEffect(() => {
        socket = io(ENDPOINT, { transports: ['websocket'] });
        socket.on('connect', () => {
            socket.emit('setup', documentId);
        });
        socket.on('revision', () => {
            window.location.reload();
        });
        socket.on('comment', () => {
            fetchComments();
        });
        return () => {
            socket.off('connect');
            socket.off('comment');
            socket.disconnect();
        };
    }, [documentId]);

    // Fetches user permissions
    useEffect(() => {
            const fetchPermissions = async () => {
                try {
                    const response = await api.get("/api/users/getPermissions");
                    setPermissions(response.data.permissions);
                } catch (error) {
                    console.error('Failed to fetch permissions:', error);
                    if(error.response.data === 'Invalid token')
                    {
                        logout();
                        navigate("/login");
                    }
                }
            }
            fetchPermissions();
    }, []);

    const navigate = useNavigate();

    // File upload handlers
    const handleFileChange = event => {
        setFile(event.target.files[0]);
    }

    const handleDragOver = event => {
        event.preventDefault();
        setDragging(true);
    }

    const handleDragEnter = event => {
        event.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = event => {
        event.preventDefault();
        setDragging(false);
    }

    const handleDrop = event => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    }

    // Uploads a new document revision
    const handleRevisionUpload = async () => {
        if(!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post(`/api/documents/uploadRevision/${documentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (socket) {
                socket.emit('revision', { document: documentId });
            }
            setShowUpload(false);
            setFile(null);
        } catch (error) {
            console.error('Failed to upload revision:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    }

    // Closes the document review
    const handleCloseReview = async () => {
        if (window.confirm('Are you sure you want to close the review?')) {
            try {
              await api.post(`/api/documents/closeReview/${documentId}`);
               navigate('/dashboard');
            } catch (error) {
                console.error('Failed to close review:', error);
                if(error.response.data === 'Invalid token')
                {
                    logout();
                    navigate("/login");
                }
            }
        }
    }

    // Resolves all comments on the document
    const handleResolveAllComments = async () => {
        if (window.confirm('Are you sure you want to resolve all comments?')) {
            try {
                await api.post(`/api/documents/resolveAllComments/${documentId}`);
                if (socket) {
                    socket.emit('comment', { document: documentId });
                }
            } catch (error) {
                console.error('Failed to resolve comments:', error);
                if(error.response.data === 'Invalid token')
                {
                    logout();
                    navigate("/login");
                }
            }
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/api/companies/getEmployees');
            setEmployees(response.data.employees)
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    }

    const fetchEmployeesOnDocument = async () => {
        try {
            const response = await api.get(`/api/documents/getEmployeesOnDocument/${documentId}`);
            setSelectedPeople(response.data.employees)
        } catch (error) {
            console.error('Failed to fetch employees on document:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchEmployees().then(() => {
            fetchEmployeesOnDocument();
        });
    }, []);


    if (isLoading) {
        return <div>Loading document...</div>;}

    const updateEmployee = async (employeeID) => {
        try {
            await api.put(`/api/documents/updateEmployee/${documentId}`, {
                employeeID: employeeID
            })
        } catch (error) {
            console.error('Failed to update employee:', error);
            if(error.response.data === 'Invalid token')
            {
                logout();
                navigate("/login");
            }
        }
    }

    const handleSelect = (employeeID) => {
        updateEmployee(employeeID)
    }

    const renderEmployeeList = () => {
        return (
            <Listbox value={selectedPeople} multiple onChange={setSelectedPeople} style={{width: "225px"}}>
                <div className="relative mt-1 pt-2">
                    <Listbox.Button
                        className="flex relative w-full h-9 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left
                            text-black shadow-sm sm:text-sm sm:leading-6
                            ring-1 ring-gray-300 placeholder:text-gray-500
                            focus:ring-indigo-500 focus:ring-2 focus:outline-0
                            dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300">
                        <span className="flex truncate -mt-0.5">Edit Reviewers</span>
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

    return (
        <div className="h-[calc(100vh-4rem)] mt-16 p-4 overflow-hidden">
            {showUpload && (
                <div
                    className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-4 rounded-lg shadow-lg"
                         onDragOver={handleDragOver}
                         onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                         onDrop={handleDrop}>
                        <div className="flex justify-end">
                            <button className="text-gray-400 rounded hover:text-gray-600"
                                    onClick={() => {
                                        setShowUpload(false);
                                        setFile(null);
                                    }}>
                                <XIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <div
                            className={`p-5 border-4 ${dragging ? 'border-blue-500' : 'border-0'} rounded-lg relative border-white`}
                            style={{width: '450px'}}>
                            <h1 className="text-lg font-semibold text-center">Upload
                                Revision</h1>
                            <div
                                className="flex flex-col items-center justify-center w-full border-2 border-dashed mt-2 mb-2 p-4 text-indigo-700">
                                <UploadIcon className="h-24 w-24 mx-auto"/>
                            </div>
                            <label className="block text-center cursor-pointer">
                                <input type="file" multiple
                                       className="text-sm hidden"
                                       onChange={handleFileChange}/>
                                <div
                                    className="text-white bg-indigo-600 border border-gray-300 rounded p-1 px-3 font-semibold hover:bg-indigo-500 cursor-pointer">
                                    Select
                                </div>
                            </label>
                            <div className="text-indigo-500 text-center mt-2">or
                                drop files here
                            </div>
                            {file && (
                                <>
                                    <div className="mt-4 flex flex-row items-center justify-start gap-2">
                                        <h2 className="text-lg font-semibold">Selected
                                            File:</h2>
                                        <p className="text-md">{file.name}</p>
                                    </div>
                                    <button
                                        className="w-full bg-indigo-600 text-white p-2 rounded mt-4"
                                        onClick={handleRevisionUpload}>
                                        Upload
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <header
                className="flex items-center justify-between text-gray-700 dark:text-gray-100 w-full my-2 py-2 border-b-2 border-b-gray-400 gap-1">
                <h1 className="text-xl font-semibold">{document.name || "Document Viewer"}</h1>
                <h1 className="flex items-center justify-right gap-5">
                    {permissions[4] && document.project === "null" && renderEmployeeList()}
                    {(permissions[0] || permissions[2] || permissions[5]) && (
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-lg
                            font-semibold text-gray-900 shadow-sm
                            dark:text-gray-100 focus-visible:outline focus-visible:ring-2
                            focus-visible:ring-indigo-600">
                                <DotsHorizontalIcon className="-mr-1 h-8 w-8 text-gray-400" aria-hidden="true"/>
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {permissions[5] && (
                                    <Menu.Item>
                                        {({active}) => (
                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                onClick={() => setShowUpload(true)}>
                                                Upload Revision
                                            </button>
                                        )}
                                    </Menu.Item>
                                    )}
                                    {permissions[2] && (
                                    <Menu.Item>
                                        {({active}) => (
                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                onClick={handleResolveAllComments}>
                                                Resolve All Comments
                                            </button>
                                        )}
                                    </Menu.Item>
                                    )}
                                    {permissions[0] && (
                                        <Menu.Item>
                                            {({active}) => (
                                                <button
                                                    type="submit"
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                    onClick={handleCloseReview}
                                                >
                                                    Close Review
                                                </button>
                                            )}
                                        </Menu.Item>
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    )}
                </h1>
            </header>
            <div className="flex w-full justify-center gap-2 h-[calc(100vh-11rem)]">
                <DocumentFrame document={document}/>
                <CommentSection documentId={documentId} document={document} permissions={permissions}
                                comments={comments} socket={socket}/>
            </div>
        </div>
    );
};

export default DocumentPage;
