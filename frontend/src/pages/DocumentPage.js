import React, {useEffect, useState} from 'react';
import DocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import api from '../config/axiosConfig';
import {useParams} from "react-router-dom"; // Import your configured axios instance

const DocumentViewer = () => {
    const documentId = useParams().documentId;
    const [fileUrl, setFileUrl] = useState('');

    const docs = [{uri: 'https://firebasestorage.googleapis.com/v0/b/reviewsync-prod.appspot.com/o/DaJBFFEp2k2gOIBp7K73%2Fdocuments%2Fc4611_sample_explain.pdf1713813356647?alt=media&token=10e6b885-2910-4c32-aec3-b1ab784dff55'}]

   /* async function fetchDocument() {
        const documentRef = await api.get(`/api/documents/getDocument/${documentId}`);
        setFileUrl(documentRef.data.url);
    }

    useEffect(() => {
        fetchDocument();
    });
    */

    return (
        <div>
            {
                <DocViewer documents={docs} renderers={DocViewerRenderers} />
            }
        </div>
    );
};

export default DocumentViewer;
