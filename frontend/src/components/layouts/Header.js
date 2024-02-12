
import { LogoutIcon } from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../authentication/Logout";
import ThemeToggler from "./ThemeToggler";

import logo from "../../assets/logos/ReviewSync-Logo.png";
import auth from "../../config/firebase";

export default function Header() {
    const [modal, setModal] = useState(false);

    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                const token = user && (await user.getIdToken());

                const payloadHeader = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const res = await fetch("http://localhost:5001", payloadHeader);
                console.log(await res.text());
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <nav className="px- px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <Link to="/" className="flex">
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              <img src={logo} alt="ReviewSync" className="h-8" />
            </span>
                    </Link>
                    <div className="flex md:order-2">
                        <ThemeToggler />

                        {currentUser && (
                            <>
                                <button
                                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                                    onClick={() => setModal(true)}
                                >
                                    <LogoutIcon className="h-8 w-8" aria-hidden="true" />
                                </button>

                                <Link
                                    to="/profile"
                                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                                >
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://avatars.dicebear.com/api/avataaars/123.svg"
                                        alt=""
                                    />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {modal && <Logout modal={modal} setModal={setModal} />}
        </>
    );
}