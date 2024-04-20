import React, { useState } from 'react';
import api from "../../config/axiosConfig";

function DocumentUpload() {
    const [file, setFile] = useState(null);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/documents/uploadDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload successful', response.data);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Document</button>
        </div>
    );
}

export default DocumentUpload;