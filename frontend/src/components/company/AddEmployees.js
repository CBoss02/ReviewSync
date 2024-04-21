import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import {useAuth} from "../../contexts/AuthContext";
import axios from 'axios';

const EmployeeRoles = () => {
    const auth = useAuth();
    const uid = auth.currentUser.uid;

    const [employees, setEmployees] = useState([{ email: '', role: '' }]);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate(); // Correctly placed useNavigate call
    const [companyName, setCompanyName] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.post('/api/companies/getRoles', {uid: uid});
                setRoles(response.data.roles)
            } catch (error) {console.error('Failed to fetch roles:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchRoles const
        const fetchEmailsAndRoles = async () => {
            try {
                const response = await axios.post('/api/companies/getEmailsAndRoles', {uid: uid});
                if(response.data.emailsAndRoles.length !== 0)
                    setEmployees(response.data.emailsAndRoles)
            } catch (error) {console.error('Failed to fetch emails and roles:', error);
                // Handle error (e.g., show an error message to the user)
            }//end try catch
        };//end fetchEmailsAndRoles const
        const fetchCompanyName = async () => {
            try {
                const response = await axios.post('/api/companies/getCompanyName', {uid: uid});
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
        try {
            await axios.put("/api/companies/modifyPendingListAndEditRoles", {uid: uid, employees: employees})
            // Reset the form or redirect the user as necessary
        } catch (error) {
            console.error('Error adding employees:', error);
        }
    };

    return (

        <div className="flex flex-col justify-center items-center mb-auto mx-auto">

            {companyName && (
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                {/*Edit your company's roles*/}
                Edit {companyName}'s Employees
            </h2>
            )}

            <div style={{border: '1px solid #ccc', padding: '20px', borderRadius: '5px'}}>
                {employees.map((employee, index) => (
                    <div key={index} style={{marginBottom: '10px', display: 'flex'}}>
                        <input
                            className="dark:ring-indigo-600 dark:ring-2 focus:ring-inset"
                            type="email"
                            value={employee.email}
                            placeholder="Employee's email"
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            style={{
                                marginRight: '10px',
                                flexGrow: 1,
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '5px'
                            }}
                        />
                        <select
                            value={employee.role}
                            onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                            style={{flexGrow: 1, border: '1px solid #ccc', borderRadius: '5px', padding: '5px'}}
                        >
                            <option value="">Select a role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => removeEmployee(index)}
                            style={{padding: '5px 10px', borderRadius: '5px', background: '#ffcccc', color: '#333'}}
                        >
                            <img src={deleteIcon} alt="Delete" style={{height: '20px', width: '20px'}}/>
                        </button>
                    </div>
                ))}
                <div style={{display: 'flex', justifyContent: 'space-between'}}
                    className="dark:text-white"
                    >
                    <button onClick={addEmployee}
                            style={{
                                width: '100%',
                                //marginRight: '10px',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}>Add Employees
                    </button>
                    {/*}
                    <button onClick={submitEmployees} style={{padding: '10px', borderRadius: '5px'}}>
                        <img src={saveIcon} alt="Save" style={{height: '24px', width: '24px'}}/>
                    </button>
                    */}
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