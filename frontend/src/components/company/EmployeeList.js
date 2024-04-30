import React, { useEffect, useState } from 'react';
import api from "../../config/axiosConfig"; // Adjust path as necessary

function EmployeeList({ selectedReviewers, onUpdateSelectedReviewers, searchTerm }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await api.get('/api/companies/getAllEmployees');
                setEmployees(response.data); // Ensure this matches the structure expected from your API
            } catch (error) {
                console.error('Failed to fetch employees', error);
            }
        }
        fetchEmployees();
    }, []);

    const filteredEmployees = searchTerm.length === 0
        ? employees
        : employees.filter(employee => {
            const fullName = `${employee.first_name} ${employee.last_name} ${employee.email}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

    return (
        <div>
            {employees.map(employee => (
                <div key={employee.id} className="flex items-center my-1">
                    <input
                        type="checkbox"
                        checked={selectedReviewers.includes(employee.id)}
                        onChange={() => onUpdateSelectedReviewers(employee.id)}
                        className="mr-2"
                    />
                    <div className="flex flex-col">
                        <div className="text-sm">{employee.first_name} {employee.last_name}</div>
                        <div className="text-sm text-gray-400">{employee.email}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EmployeeList;
