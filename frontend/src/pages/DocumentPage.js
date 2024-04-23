// src/components/DocumentViewer.js
import React, {useEffect, useRef, useState} from 'react';
import { useParams } from "react-router-dom";
import api from '../config/axiosConfig'; // Make sure this path matches your Axios configuration
import DocumentFrame from '../components/document/DocumentFrame'; // Make sure this path matches your DocumentFrame component
import CommentSection from '../components/comment/CommentSection';
import {ChevronDownIcon, DotsHorizontalIcon, MenuIcon} from "@heroicons/react/solid";
import {Menu, Transition} from "@headlessui/react"; // Make sure this path matches your CommentSection component
import {Fragment} from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DocumentPage = () => {
    const { documentId } = useParams();
    const [document, setDocument] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const buttonRef = useRef(null); // Ref to track the button position

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`/api/documents/getDocument/${documentId}`);
                setDocument(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch document', error);
            }
        };

        fetchDocument();
    }, [documentId]);

    if (isLoading) {
        return <div>Loading document...</div>;
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <div className="flex flex-col h-screen mt-16 mx-8">
            <header className="flex items-center justify-between text-gray-700 dark:text-gray-100 w-full my-2 py-2 border-b-2 border-b-gray-400 gap-1">
                <h1 className="text-xl font-semibold">{document.name || "Document Viewer"}</h1>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <DotsHorizontalIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Upload Revision
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Resolve All Comments
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Edit Reviewers
                                        </a>
                                    )}
                                </Menu.Item>
                                <form method="POST" action="#">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="submit"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block w-full px-4 py-2 text-left text-sm'
                                                )}
                                            >
                                                Close Review
                                            </button>
                                        )}
                                    </Menu.Item>
                                </form>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </header>
            <div className="flex flex-grow w-full justify-center gap-4">
                <DocumentFrame document={document}/>
                <vr className="border-r-2 border-gray-400 h-full"/>
                <CommentSection documentId={documentId}/>
            </div>
        </div>
    );
};

export default DocumentPage;
