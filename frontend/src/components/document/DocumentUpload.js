import React, { useState } from 'react';
import api from "../../config/axiosConfig";
import { XIcon } from "@heroicons/react/solid";

function DocumentUpload() {
    const [file, setFile] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [reviewers, setReviewers] = useState([]);

    const handleFileChange = event => {
        setFile(event.target.files[0]); // Set file and implicitly prepare to show reviewer selection
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (!dragging) setDragging(true);
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]); // Set file from drop
        }
    };

    const handleReviewerChange = event => {
        const selectedReviewers = Array.from(event.target.selectedOptions, option => option.value);
        setReviewers(selectedReviewers);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('reviewers', JSON.stringify(reviewers));

        try {
            const response = await api.post('/api/documents/uploadDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload successful', response.data);
            setShowUpload(false); // Close the upload modal after successful upload
            setFile(null); // Clear the file after upload
        } catch (error) {
            console.error('Upload failed', error);
        }
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
                                    onClick={() => setShowUpload(false)}>
                                <XIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <div
                            className={`p-5 border-4 ${dragging ? 'border-blue-500' : 'border-0'} rounded-lg relative border-white`}
                            style={{width: '450px'}}>
                            <svg className="text-indigo-500 mx-auto mb-4 w-24 h-24" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
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
                                <div>
                                    <button className="bg-indigo-500 text-white rounded px-4 py-2 mt-4" onClick={handleUpload}>
                                        Upload Document
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
