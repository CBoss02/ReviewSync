import React, {useEffect} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import auth from "../../config/firebase-config";
import api from "../../config/axiosConfig";


export default function Register() {
    const [form, setForm] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        verify_password: '',
    });

    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await register(form.email, form.password, form.first_name, form.last_name);
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Failed to create an account");
        }
        setLoading(false);
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight  dark:text-white">
                        Register new account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onChange={handleFormChange} onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white -mb-1">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="first_name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm  ring-inset
                                    placeholder:text-gray-400  focus:ring-inset sm:text-sm sm:leading-6 ring-1 ring-gray-300
                                    focus:ring-indigo-600 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-600 dark:focus:ring-indigo-300"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white -mb-1">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="last_name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm  ring-inset
                                    placeholder:text-gray-400  focus:ring-inset sm:text-sm sm:leading-6 ring-1 ring-gray-300
                                    focus:ring-indigo-600 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-600 dark:focus:ring-indigo-300"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white -mb-1">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm  ring-inset
                                    placeholder:text-gray-400  focus:ring-inset sm:text-sm sm:leading-6 ring-1 ring-gray-300
                                    focus:ring-indigo-600 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-600 dark:focus:ring-indigo-300"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white -mb-1">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm  ring-inset
                                    placeholder:text-gray-400  focus:ring-inset sm:text-sm sm:leading-6 ring-1 ring-gray-300
                                    focus:ring-indigo-600 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-600 dark:focus:ring-indigo-300"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="verify_password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white -mb-1">
                                    Verify password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="verify_password"
                                    name="verify_password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm  ring-inset
                                    placeholder:text-gray-400  focus:ring-inset sm:text-sm sm:leading-6 ring-1 ring-gray-300
                                    focus:ring-indigo-600 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-600 dark:focus:ring-indigo-300"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <button onClick={() => {
                            window.location.href = "/login";
                        }} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    )
}