// components/Card.js
import React from 'react';

const DocumentCard = ({ type, name }) => {
    return (
        <div className="card m-2 w-full">
            <div className="card-body w-full h-2/3 bg-gray-400 text-center font-bold text-gray-200">
                {/** Display the document type*/}
                <h5 className="card-title">{type}</h5>
            </div>
            <div className="card-footer w-full h-1/3 bg-gray-200 text-center">
                {/** Display the document name*/}
                <p className="card-text">{name}</p>
            </div>
        </div>
    );
};

export default DocumentCard;
