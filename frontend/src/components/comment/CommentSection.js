// src/components/comment/CommentSection.js
import React, {useEffect, useState} from 'react';
import api from "../../config/axiosConfig";
import {ChatIcon, DotsHorizontalIcon} from "@heroicons/react/solid";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

const CommentSection = ({documentId, document}) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [activeReplyId, setActiveReplyId] = useState(null);

    const handleActiveReplyId = (commentId) => {
        if(commentId === activeReplyId) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(commentId);
        }
    }

    const handleChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting comment:', newComment);
        if (newComment !== '') {
            await api.post(`/api/documents/addComment/${documentId}`, {
                comment: newComment
            });
            setNewComment('');
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/api/documents/getComments/${documentId}`);
                console.log(response.data);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        }

        fetchComments();
    }, []);

    const handleCommentResolve = async (commentId) => {
        console.log('Resolving comment:', commentId);
    }

    return (
        <div className="w-1/3 p-2 flex flex-col bg-gray-100 dark:bg-gray-800">
            <CommentInput documentId={documentId}/>
            <div className="flex flex-grow flex-col gap-2 overflow-y-scroll" style={{maxHeight: 'calc(100vh - 200px)'}}>
                {comments.map(comment => (
                    <>
                        {
                            (comment.state === "open") &&
                            <CommentCard
                                comment={comment}
                                documentId={documentId}
                                isReplyActive={comment.id === activeReplyId}
                                setReplyActive={() => handleActiveReplyId(comment.id)}
                                document={document}
                            />
                        }
                    </>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
