import React, {Fragment, useState} from "react";
import {ChatIcon, ChevronDownIcon, DotsHorizontalIcon} from "@heroicons/react/solid";
import CommentInput from "./CommentInput";
import {Menu, Transition} from "@headlessui/react";
import {useAuth} from "../../contexts/AuthContext";
import api from "../../config/axiosConfig";

function CommentCard({comment, documentId, document, isReplyActive, setReplyActive, permissions}) {
    const [viewReplies, setViewReplies] = useState(false);

    const auth = useAuth();

    const handleViewReplies = () => {
        setViewReplies(!viewReplies);
    }

    const handleRevisionUpload = async () => {

    }

    const handleResolveAllComments = async () => {

    }

    const handleEditReviewers = async () => {

    }


    const handleCommentResolve = async (commentId) => {
        try {
            await api.post(`/api/documents/resolveComment/${documentId}/${commentId}`);
        } catch (error) {
            console.error('Failed to resolve comment:', error);
        }
    }

    const handleCommentDelete = async (commentId) => {
        try {
            await api.delete(`/api/documents/deleteComment/${documentId}/${commentId}`);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    }

    const handleDeleteReply = async (commentId, replyId) => {
        try {
            await api.delete(`/api/documents/deleteReply/${documentId}/${commentId}/${replyId}`);
        } catch (error) {
            console.error('Failed to delete reply:', error);
        }
    }

    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }


    return (
        <>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-200 dark:bg-gray-600 mr-2">
                <div className="flex flex-row items-center justify-between w-full p-1">
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-200">{comment.owner.name}</h1>
                    <div className="flex flex-row items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt._seconds * 1000).toLocaleString('en-US', {
                                year: 'numeric', month: 'numeric', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>

                        {
                            (auth.currentUser.uid === comment.owner.uid || auth.currentUser.uid === document.owner || permissions[2]) &&
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-lg
                                        font-semibold text-gray-900 shadow-sm
                                        dark:text-gray-100 focus-visible:outline focus-visible:ring-2
                                        focus-visible:ring-indigo-600">
                                        <DotsHorizontalIcon className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true"/>
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="absolute right-0 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {permissions[2] &&
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <button
                                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                            onClick={() => handleCommentResolve(comment.id)}>
                                                            Resolve Comment
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            }
                                            {auth.currentUser.uid === comment.owner.uid &&
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <button
                                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-indigo-700 font-medium hover:font-semibold"
                                                            onClick={() => handleCommentDelete(comment.id)}>
                                                            Delete Comment
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            }
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        }
                    </div>
                </div>
                <div className="w-full p-2 ml-1 text-gray-700 dark:text-gray-300">
                    <p className="text-sm text-justify">{comment.text}</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full py-1 px-3">
                    {permissions[3] &&
                    <button
                        className="text-xs font-semibold text-blue-700 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={setReplyActive}>
                        <span className="flex flex-row items-center gap-1 text-blue-400 hover:text-blue-600">
                            Reply
                            <ChatIcon className="h-4 w-4"/>
                        </span>
                    </button>
                    }
                    {
                        comment.replies.length > 0 &&
                        <button
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={handleViewReplies}>
                            <span className="flex flex-row items-center gap-1 text-blue-400 hover:text-blue-600">
                                {viewReplies ? 'Hide' : `View ${(comment.replies.length)}`} Replies
                                <ChevronDownIcon className="h-4 w-4"/>
                            </span>
                        </button>
                    }
                </div>
            </div>
            {isReplyActive && <CommentInput documentId={documentId} commentId={comment.id}/>}
            {viewReplies && comment.replies.map(reply => (
                <>
                    <div className="flex flex-col items-center p-2 rounded-b-lg bg-gray-300 dark:bg-gray-700 mr-2 ml-4">
                        <div className="flex flex-row items-center justify-between w-full p-1">
                            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-200">{reply.owner.name}</h1>
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(reply.createdAt._seconds * 1000).toLocaleString('en-US', {
                                        year: 'numeric', month: 'numeric', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="w-full p-2 ml-1 text-gray-700 dark:text-gray-300">
                            <p className="text-sm text-justify">{reply.text}</p>
                        </div>
                    </div>
                </>
            ))}
        </>
    );
}

export default CommentCard;
