// src/components/comment/CommentSection.js
import React, {useEffect, useState} from 'react';
import api from "../../config/axiosConfig";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";
import io from 'socket.io-client';


const CommentSection = ({documentId, document, permissions, comments, socket}) => {
    const [activeReplyId, setActiveReplyId] = useState(null);

    const handleActiveReplyId = (commentId) => {
        if(commentId === activeReplyId) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(commentId);
        }
    }

    return (
        <div className="w-1/3 p-2 flex flex-col bg-gray-100 dark:bg-gray-800">
            {permissions[1] === true &&
                <CommentInput documentId={documentId} socket={socket}/>
            }
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
                                permissions={permissions}
                                socket={socket}
                            />
                        }
                    </>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
