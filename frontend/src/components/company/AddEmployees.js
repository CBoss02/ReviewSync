import React, { useState, useEffect } from 'react';
import deleteIcon from "../../assets/icons/RedDelete-Icon.png";
import saveIcon from "../../assets/icons/GreenSave-Icon.png";
import axios from 'axios';

const EmployeeRoles = () => {
    const [employees, setEmployees] = useState([{ email: '', role: '' }]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles'); // Adjust the URL to your actual endpoint
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                // Handle error (e.g., show an error message to the user)
            }
        };

        fetchRoles();
    }, []);

    const handleInputChange = (index, field, value) => {
        const newEmployees = [...employees];
        newEmployees[index][field] = value;
        setEmployees(newEmployees);
    };

    const addEmployee = () => {
        setEmployees([...employees, { email: '', role: '' }]);
    };

    const removeEmployee = (indexToRemove) => {
        setEmployees(employees.filter((_, index) => index !== indexToRemove));
    };

    const submitEmployees = async () => {
        try {

            await Promise.all(employees.map(employee =>
                axios.post('/api/addEmployeeToCompany', {
                    userEmail: employee.email,
                    role: employee.role,
                    ownerEmail: 'owner@example.com',
                })
            ));

            alert('All employees added successfully!');
            // Reset the form or redirect the user as necessary
        } catch (error) {
            console.error('Error adding employees:', error);
            alert('Failed to add some or all employees.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                {employees.map((employee, index) => (
                    <div key={index} style={{marginBottom: '10px', display: 'flex'}}>
                        <input
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
                                <option key={role} value={role}>{role}</option>
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
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <button onClick={addEmployee}
                            style={{width: '100%', marginRight: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}}>Add Employees
                    </button>
                    <button onClick={submitEmployees} style={{padding: '10px', borderRadius: '5px'}}>
                        <img src={saveIcon} alt="Save" style={{height: '24px', width: '24px'}}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRoles;