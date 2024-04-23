// src/components/CommentList.js
import React from 'react';
import {DotsHorizontalIcon, DotsVerticalIcon} from "@heroicons/react/solid";

function CommentList(/*{ comments }*/) {
    const comments = [{
        id: 1,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis nec turpis.',
        user: {
            id: 1,
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits',
        },
        createdAt: new Date()
    }, {
        id: 2,
        text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            id: 2,
            name: 'Jane Doe',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 3,
        text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        user: {
            id: 3,
            name: 'John Smith',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 4,
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        user: {
            id: 4,
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 5,
        text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        user: {
            id: 5,
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 6,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis nec turpis.',
        user: {
            id: 6,
            name: 'Jane Doe',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 7,
        text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            id: 7,
            name: 'John Smith',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 8,
        text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        user: {
            id: 8,
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 9,
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        user: {
            id: 9,
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 10,
        text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        user: {
            id: 10,
            name: 'Jane Doe',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }, {
        id: 11,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec turpis nec turpis.',
        user: {
            id: 11,
            name: 'John Smith',
            avatar: 'https://randomuser.me/api/portraits'
        },
        createdAt: new Date()
    }
    ];

    return (
        <div className="space-y-4 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
            {comments.map(comment => (
                <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-50 text-gray-600 p-2 rounded mr-2">
                    <div className="flex flex-col p-1">
                        <div className="flex -flex-row justify-between">
                            <span className="font-semibold text-md text-gray-500 dark:text-gray-300">{comment.user.name}</span>
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-xs font-thin text-gray-400 dark:text-gray-400">{comment.createdAt.toLocaleString()}</span>
                                <button className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                                    <DotsHorizontalIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                        <p className="text-sm pl-1 font-medium text-gray-600 dark:text-gray-200">{comment.text}</p>
                        <div className="flex flex-row justify-between pl-1 mt-2">
                            <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500">Reply</button>
                            <button className="bg-green-600 py-1 px-2 rounded-xl text-gray-200 hover:text-blue-700 dark:hover:text-blue-500">Resolve</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommentList;
