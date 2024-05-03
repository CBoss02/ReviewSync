// src/components/comment/CommentInput.js
import React, {useEffect, useState} from 'react';
import api from "../../config/axiosConfig";

const CommentInput = (props) => {
    const [newComment, setNewComment] = useState('');

    const handleChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newComment !== '') {
            if(props.commentId !== undefined) {
                await api.post(`/api/documents/addReply/${props.documentId}/${props.commentId}`, {
                    comment: newComment
                });
            } else {
                await api.post(`/api/documents/addComment/${props.documentId}`, {
                    comment: newComment
                });
            }
            if(props.socket) {
                props.socket.emit('comment', {
                    document: props.documentId,
                    comment: newComment
                });
            }
            setNewComment('');
        }
    }

    return (
        <div>
            <form className="mb-2 mr-2" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center p-3 rounded-lg bg-gray-200 dark:bg-gray-600 gap-2">
                        <textarea
                            id="chat"
                            rows="3"
                            value={newComment}
                            onChange={handleChange}
                            className="block mx-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your comment..."
                        />
                    <div className="flex flex-row items-center justify-end w-full">
                        <button className="bg-blue-500 text-sm text-gray-100 py-1 px-2 hover:bg-blue-600 rounded-md">
                            Post Comment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CommentInput;
