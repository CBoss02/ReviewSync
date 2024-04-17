import { db, FieldValue } from "../config/firebase-config.js";

// Function to add a new project to the Firestore database
export const addProject = async (req, res) => {
    try {
        const { companyID, projectName, ownerID } = req.body;
        const projectsCollection = db.collection('companies').doc(companyID).collection('projects');

        // Create a new project document
        const project = await projectsCollection.add({
            Name: projectName,
            ownerID: ownerID,
            Employees: [ownerID],  // Start with the owner's ID in the array
            documentIDs: []  // Initialize as empty array
        });

        res.status(200).send({ message: 'Project added successfully', projectID: project.id });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(400).send({ message: 'Failed to add project', error: error.message });
    }
};

// Function to add an employee to the Employees field in a project document
export const addEmployeeToProject = async (req, res) => {
    try {
        const { companyID, projectID, userID } = req.body;
        const projectRef = db.collection('companies').doc(companyID).collection('projects').doc(projectID);

        // Update the project document by adding an employee ID to the 'Employees' array
        await projectRef.update({
            Employees: FieldValue.arrayUnion(userID)
        });

        res.status(200).send({ message: 'Employee added to project successfully' });
    } catch (error) {
        console.error('Failed to add employee to project:', error);
        res.status(400).send({ message: 'Failed to add employee to project', error: error.message });
    }
};
