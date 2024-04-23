// src/components/comment/CommentSection.js
import React, { useState } from 'react';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

const CommentSection = ({ documentId }) => {
    const [comments, setComments] = useState([]);

    const addComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    return (
        <div className="w-1/3 p-4 flex flex-col">
            <div>
                <CommentInput onCommentSubmit={addComment}/>
            </div>
            <CommentList comments={comments}/>
        </div>
    );
};

export default CommentSection;
