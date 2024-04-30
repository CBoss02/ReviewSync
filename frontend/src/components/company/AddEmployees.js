import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import {useAuth} from "../../contexts/AuthContext";
import api from "../../config/axiosConfig";
import useIdleTimeout from "../idleTimer/idleTimer"

const EmployeeRoles = () => {
    const auth = useAuth();
    const uid = auth.currentUser.uid;

    const [employees, setEmployees] = useState([{ email: '', role: '' }]);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate(); // Correctly placed useNavigate call
    const [companyName, setCompanyName] = useState("");

    useIdleTimeout();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.post('/api/companies/getRoles', {uid: uid});
                setRoles(response.data.roles)
            } catch (error) {console.error('Failed to fetch roles:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchRoles const
        const fetchEmailsAndRoles = async () => {
            try {
                const response = await api.post('/api/companies/getEmailsAndRoles', {uid: uid});
                if(response.data.emailsAndRoles.length !== 0)
                    setEmployees(response.data.emailsAndRoles)
            } catch (error) {console.error('Failed to fetch emails and roles:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchEmailsAndRoles const
        const fetchCompanyName = async () => {
            try {
                const response = await api.get('/api/companies/getCompanyName');
                setCompanyName(response.data.companyName)
            } catch (error) {
                console.error('Failed to fetch company name:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchCompanyName
        fetchRoles();
        fetchEmailsAndRoles();
        fetchCompanyName();
    }, []);

    const handleInputChange = (index, field, value) => {
        const newEmployees = [...employees];
        newEmployees[index][field] = value;
        setEmployees(newEmployees);
    };

    const navigateToDashboard = () => {
        navigate('/dashboard'); // Use navigate to change the path
    };

    const addEmployee = () => {
        setEmployees([...employees, { email: '', role: '' }]);
    };

    const removeEmployee = (indexToRemove) => {
        setEmployees(employees.filter((_, index) => index !== indexToRemove));
    };

    const submitEmployees = async () => {
        let incorrect = false;
        for(let employee of employees){
            if(employee.role===""){
                alert('You must select a role for every employee!');
                console.error('You must select a role for ', employee.email, '!');
                incorrect=true;
            }//end if
            if(employee.email===""){
                alert('You must give an email for every employee!');
                console.error('You must give an email for ', employee.email, '!');
                incorrect=true;
            }//end if
        }//end for loop

        if(incorrect===false){
            try {
                await api.put("/api/companies/modifyPendingListAndEditRoles", {uid: uid, employees: employees})
                // Reset the form or redirect the user as necessary
            } catch (error) {
                console.error('Error adding employees:', error);
            }
        }
    };

    return (

        <div className="flex flex-col justify-center items-center mb-auto mx-auto">

            {companyName && (
            <h2 className="mt-10 mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                {/*Edit your company's roles*/}
                Edit {companyName}'s Employees
            </h2>
            )}

            <div className= "shadow-sm ring-1 ring-gray-300 dark:ring-indigo-500 dark:ring-2" style={{padding: '20px', borderRadius: '5px'}}>
                {employees.map((employee, index) => (
                    <div key={index} style={{marginBottom: '10px', display: 'flex'}}>
                        <input
                            className="rounded-md border-0 min-w-56 text-black ml-1
                                    shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                            type="email"
                            value={employee.email}
                            placeholder="Employee's email"
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            style={{
                                marginRight: '10px',
                                flexGrow: 1,
                                padding: '5px'
                            }}
                        />
                        <select
                            className="rounded-md border-0 min-w-40 ml-2 text-black
                                    shadow-sm sm:text-sm sm:leading-6 bg-white
                                    ring-1 ring-gray-300 placeholder:text-gray-500
                                    focus:ring-indigo-500 focus:ring-2 focus:outline-0
                                    dark:ring-2 dark:ring-indigo-500 dark:focus:ring-indigo-300"
                            value={employee.role}
                            onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                            style={{flexGrow: 1, padding: '5px'}}
                        >
                            <option value="">Select a role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <button
                            className={"mx-auto h-8 w-auto -mt-1 -mr-3"}
                            onClick={() => removeEmployee(index)}
                            style={{padding: '5px 10px',}}
                        >
                            <img
                                className="justify-end mx-auto h-8 w-auto"
                                src={deleteIcon}
                                alt="Delete Role">
                            </img>
                        </button>
                    </div>
                ))}
                <div style={{display: 'flex', justifyContent: 'space-between'}}
                     className="dark:text-white"
                    >
                    <button
                        className="flex justify-center w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
                            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={addEmployee}
                    >Add Employee
                    </button>
                </div>

                <div className="flex flex-row mt-2">
                    <button className="flex w-20 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm
                    font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            type="submit"
                            value="Next"
                            onClick={() => navigate('/edit-roles', {state: {companyName}})}
                    >
                        ← Back
                    </button>
                    <button className="flex mt-1 justify-end ml-auto h-8 w-auto px-2">
                        <img
                            className="justify-end mx-auto h-8 w-auto"
                            src={saveIcon}
                            onClick={submitEmployees}
                            alt="Save Role">
                        </img>
                    </button>
                    <button className="flex w-20 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm
                    font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                            type="submit"
                            value="Next"
                            onClick={() => navigateToDashboard()}
                    >
                        Next →
                    </button>
                </div>

            </div>

        </div>
    );

};

export default EmployeeRoles;