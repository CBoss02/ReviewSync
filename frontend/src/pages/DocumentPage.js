// src/components/DocumentViewer.js
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import api from '../config/axiosConfig'; // Make sure this path matches your Axios configuration
import DocumentFrame from '../components/document/DocumentFrame'; // Make sure this path matches your DocumentFrame component
import CommentSection from '../components/comment/CommentSection';
import {ChevronDownIcon, DotsHorizontalIcon, MenuIcon, UploadIcon, XIcon} from "@heroicons/react/solid";
import {Menu, Transition} from "@headlessui/react"; // Make sure this path matches your CommentSection component
import {Fragment} from "react";
import {useAuth} from "../contexts/AuthContext";
import DocumentUpload from "../components/document/DocumentUpload";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DocumentPage = () => {
    const {documentId} = useParams();
    const [document, setDocument] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    const navigate = useNavigate();

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    }

    const handleDragOver = event => {
        event.preventDefault();
        if (!dragging) setDragging(true);
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
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    }

    const auth = useAuth();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`/api/documents/getDocument/${documentId}`);
                console.log(response.data);
                setDocument(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch document', error);
            }
        };

        fetchDocument();
    }, [documentId]);

    const handleRevisionUpload = async () => {
        if(!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post(`/api/documents/uploadRevision/${documentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowUpload(false);
            setFile(null);
        } catch (error) {
            console.error('Failed to upload revision:', error);
        }
    }

    const handleCloseReview = async () => {
        const confirmClose = window.confirm('Are you sure you want to close the review?');
        if (confirmClose) {
            try {
                await api.post(`/api/documents/closeReview/${documentId}`).then(
                    navigate('/dashboard')
                )
            } catch (error) {
                console.error('Failed to close review:', error);
            }
        }
    }

    const handleResolveAllComments = async () => {
        const confirmResolve = window.confirm('Are you sure you want to resolve all comments?');
        if (confirmResolve) {
            try {
                await api.post(`/api/documents/resolveAllComments/${documentId}`);
            } catch (error) {
                console.error('Failed to resolve comments:', error);
            }
        }
    }

    const handleEditReviewers = async () => {
        console.log('Editing reviewers...');
    }

    if (isLoading) {
        return <div>Loading document...</div>;
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
                {
                    auth.currentUser.uid === document.owner &&
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
                                    <Menu.Item>
                                        {({active}) => (
                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                onClick={() => setShowUpload(true)}>
                                                Upload Revision
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({active}) => (
                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                onClick={handleResolveAllComments}>
                                                Resolve All Comments
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({active}) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Edit Reviewers
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <form method="POST" action="#">
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
                                    </form>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                }
            </header>
            <div className="flex w-full justify-center gap-2 h-[calc(100vh-11rem)]">
                <DocumentFrame document={document}/>
                <CommentSection documentId={documentId} document={document}/>
            </div>
        </div>
    );
};

export default DocumentPage;
