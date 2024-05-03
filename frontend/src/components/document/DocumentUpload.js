import React, { useState, useEffect } from 'react';
import api from "../../config/axiosConfig";
import { UploadIcon, XIcon } from "@heroicons/react/solid";

function DocumentUpload({ projectId, canSelect }) {
    const [file, setFile] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    // Fetch all employees only once when the component mounts
    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await api.get('/api/companies/getAllEmployees');
                setEmployees(response.data);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
                setError(error);
            }
        };

        fetchAllEmployees();
    }, []);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const handleDragOver = event => {
        event.preventDefault();
        if (!dragging) setDragging(true);
    };

    const handleDragEnter = event => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = event => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDrop = event => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleReviewerToggle = email => {
        setSelectedReviewers(prev => {
            if (prev.includes(email)) {
                // If the ID is already selected, remove it (uncheck)
                return prev.filter(item => item !== email);
            } else {
                // If the ID is not selected, add it (check)
                return [...prev, email];
            }
        });
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        if((projectId === undefined) || (projectId === null)){
            projectId = null;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('project', projectId);
        selectedReviewers.forEach(reviewer => formData.append('reviewers', reviewer));
        let response;
        try {
            if(projectId === null) {
                response = await api.post('/api/documents/uploadDocument', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await api.post(`/api/documents/uploadDocument/${projectId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            console.log('Upload successful: ', response.data);
            setShowUpload(false);
            setFile(null);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const filteredEmployees = searchTerm.length === 0
        ? employees.slice(0, 5) // Show first 5 employees if no search term
        : employees.filter(employee => {
            const fullName = `${employee.first_name} ${employee.last_name} ${employee.email}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
        setDropdownOpen(true);
    };


    return (
        <div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowUpload(true)}>Upload Document
            </button>

            {showUpload && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-4 rounded-lg shadow-lg" onDragOver={handleDragOver}
                         onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <div className="flex justify-end">
                            <button className="text-gray-400 rounded hover:text-gray-600"
                                    onClick={() => {
                                        setShowUpload(false);
                                        setFile(null);
                                        setSelectedReviewers([]);
                                    }}>
                                <XIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <div
                            className={`p-5 border-4 ${dragging ? 'border-blue-500' : 'border-0'} rounded-lg relative border-white`}
                            style={{width: '450px'}}>
                            <h1 className="text-lg font-semibold text-center">Upload Document</h1>
                            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed mt-2 mb-2 p-4 text-indigo-700">
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
                            <div className="text-indigo-500 text-center mt-2">or drop files here</div>
                            {file && (
                                <div className="mt-4">
                                    <>
                                        <div className="mt-4 flex flex-row items-center justify-start gap-2">
                                            <h2 className="text-lg font-semibold">Selected
                                                File:</h2>
                                            <p className="text-md">{file.name}</p>
                                        </div>
                                        {canSelect && (<h2 className="text-lg font-semibold mt-4">Select Reviewers</h2>)}
                                        {canSelect && (
                                        <input
                                            type="text"
                                            placeholder="Search employees..."
                                            className="w-full border border-gray-300 p-2 rounded-t mt-1"
                                            onChange={handleSearchChange}
                                            onFocus={() => setDropdownOpen(true)}
                                        />
                                        )}
                                    </>
                                    {dropdownOpen && canSelect && (
                                        <div
                                            className="w-full border border-gray-300 p-2 rounded-b max-h-60 overflow-auto">
                                            {filteredEmployees.map(employee => (
                                                <div key={employee.id} className="flex items-center my-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReviewers.includes(employee.id)}
                                                        onChange={() => handleReviewerToggle(employee.id)}
                                                        className="mr-2"
                                                    />
                                                    {employee.first_name} {employee.last_name} ({employee.email})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button className="w-full bg-indigo-600 text-white p-2 rounded mt-2"
                                            onClick={handleUpload}>
                                        Upload
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentUpload;
