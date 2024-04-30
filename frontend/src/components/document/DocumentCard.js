// components/Card.js
import React from 'react';
import { useNavigate } from "react-router-dom";

const DocumentCard = ({ document }) => {
    const navigate = useNavigate();

    const handleDocumentClick = async (documentId) => {
        navigate(`/document/${documentId}`);
    }

    return (
        <button className="card bg-white shadow hover:shadow-md relative"
                onClick={() => handleDocumentClick(document.id)}
                style={{
                    aspectRatio: '1 / 1', // This ensures the card is always a square
                }}>
            <div className="w-full h-full flex flex-col">
                <div className="card-body flex-grow bg-gray-400 text-center font-bold text-gray-200 overflow-hidden">
                    {/** Display the document type*/}
                    <p className="truncate card-title p-2">{document.contentType}</p>
                </div>
                <div className="card-footer bg-gray-200 text-center overflow-hidden">
                    {/** Display the document name*/}
                    <p className="card-text">{document.name}</p>
                </div>
            </div>
        </button>
    );
};

export default DocumentCard;
