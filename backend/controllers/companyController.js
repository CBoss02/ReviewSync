const {db} = require('../config/firebase-config');
const {FieldValue} = require('firebase-admin').firestore;

//Creates a company with initially empty employees and pending lists
exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        const doc = await db.collection("companies").add({
            name: companyData.name,
            owner: req.user.uid,
            pendingList: [],
            employees: [],
        })
        await db.collection("users").doc(req.user.uid).update({
            company: doc.id,
            role: "owner"
        })
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Returns the ID of this user's company
exports.getCompanyID = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.user.uid).get();
        res.status(200).send({companyID: user.data().company});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getCompanyName = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        if(companyID !== null)
        {
            const company = await db.collection("companies").doc(companyID).get();
            const companyName = company.data().name;
            res.status(200).send({companyName: companyName});
        }
        else
        {
            res.status(200).send({companyName: ""})
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Returns the ID of the owner of this company
exports.getCompanyOwner = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const company = await db.collection("companies").doc(companyID).get();
        const owner = company.data().owner;
        res.status(200).send({owner: owner});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Retrieves the IDs and names of all employees in a certain company
exports.getEmployees = async (req, res) => {
    const user = await db.collection("users").doc(req.user.uid).get();
    const companyID = user.data().company;

    if (!user.exists) {
        return res.status(404).send('User not found');
    }

    try {
        const company = await db.collection("companies").doc(companyID).get();
        const employees = [];
        const qSnap = await db.collection("users").where('company', '==', companyID).get();
        if (qSnap.empty) {
            res.status(200).send({employees: []});
        } else {
            await qSnap.forEach(user => {
                if (user.id !== req.user.uid) { //Do not return user him/herself
                    const userData = user.data();
                    let nameAndID = {}
                    nameAndID.id = user.id;
                    nameAndID.name = userData.first_name + " " + userData.last_name;
                    employees.push(nameAndID);
                }
            });
            res.status(200).send({employees: employees});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Returns employee data including emails
exports.getEmployeesWithEmails = async (req, res) => {
    const user = await db.collection("users").doc(req.user.uid).get();

    if (!user.exists) {
        return res.status(404).send('User not found');
    }

    const companyID = user.data().company;
    if (!companyID) {
        return res.status(404).send('User does not belong to a company');
    }

    try {
        const companyDoc = await db.collection('companies').doc(companyID).get();
        if (!companyDoc.exists) {
            return res.status(404).send('Company not found');
        }

        const employeeList = companyDoc.data().employees || []; // Check if the employees array exists, otherwise default to an empty array

        const employees = [];
        for (const employeeId of employeeList) {
            const employeeDoc = await db.collection('users').doc(employeeId).get();
            if (employeeDoc.exists && employeeDoc.id !== user.id) {
                // Include the user ID in the employee data
                employees.push({
                    id: employeeDoc.id,
                    ...employeeDoc.data(),
                });
            }
        }
        res.status(200).send(employees);
    } catch (error) {
        console.log('Error fetching company document:', error);
        res.status(500).send(error.toString());
    }
}

//Returns emails and roles of employees, both on pending list and officially employees, to display on the Add Employees page
exports.getEmailsAndRoles = async (req, res) => {
        try {
            const user = await db.collection("users").doc(req.user.uid).get();
            const companyID = user.data().company;
            const company = await db.collection("companies").doc(companyID).get();
            const companyData = company.data();
            let emailsAndRoles = companyData.pendingList
            const qSnapUsers = await db.collection("users").where('company', '==', companyID).get();
            if (qSnapUsers.docs.length > 1) {
                await qSnapUsers.forEach(user => {
                    if (user.id !== companyData.owner) {
                        const userData = user.data();
                        let emailAndRole = {}
                        emailAndRole.email = userData.email
                        emailAndRole.role = userData.role
                        emailsAndRoles.push(emailAndRole)
                    }
                })
            }
            res.status(200).send({emailsAndRoles: emailsAndRoles});
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    //Adds an employee to a company IF they have been invited (if their information is on the pending list).
    exports.addEmployeeToCompany = async (req, res) => {
        try {
            const data = req.body;
            const companyCollection = await db.collection("companies");
            const qSnap = await companyCollection.where('name', '==', data.companyName).get();
            if (qSnap.empty) {
                res.status(405).send({message: "No company found with this name. Please check your spelling and/or check with the owner."})
            } else {
                const user = await db.collection("users").doc(req.user.uid).get();
                const userData = user.data();
                let userFound = false;
                qSnap.forEach(companyData => {
                    const company = companyData.data();
                    let i = 0;
                    while (i < company.pendingList.length && !userFound) {
                        if (company.pendingList[i].email === userData.email) {
                            userFound = true;
                            const role = company.pendingList[i].role;
                            const userCollection = db.collection("users");
                            companyCollection.doc(companyData.id).update({
                                employees: FieldValue.arrayUnion(user.id),
                                pendingList: FieldValue.arrayRemove({email: userData.email, role: role}),
                            }).then(() => {
                                userCollection.doc(req.user.uid).update({
                                    company: companyData.id,
                                    role: role
                                })
                            })
                            res.status(200).send();
                        }
                        i++;
                    }
                    if (!userFound) {
                        res.status(405).send({message: "You have not been invited to join this company. Please contact the owner."});
                    }
                })
            }
        } catch (error) {
            res.status(400).send(error.message);
        }

    }

    //Retrieves the names of the roles and associated permissions of this company.
exports.getRoles = async (req, res) => {
    try {
        const roles = [];
        const user = await db.collection("users").doc(req.user.uid).get();
        const userData = user.data();
        const collection = await db.collection("companies").doc(userData.company).collection("roles");
        const snapshot = await collection.get();
        if(snapshot.empty)
        {
            res.status(200).send({roles: []});
        }
        else
        {
            await snapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                roles.push(data);
            });
            res.status(200).send({roles: roles});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Modifies, deletes, and adds roles to this company accordingly from the information sent from the Edit Roles page.
exports.addOrUpdateRoles = async (req, res) => {
    try {
        const roles = req.body.roles; //array of jsons
        const user = await db.collection("users").doc(req.user.uid).get();
        const userData = user.data();
        let ids = []; //keeps track of the Firestore ids present in the roles array
        let collection = db.collection('companies').doc(userData.company).collection('roles');
        const snapshot = await collection.get();
        for(let i = 0; i < roles.length; i++)
        {
            ids.push(roles[i].id) //Keep track of IDs to tell which ones we're deleting if any later on
            for(let j = i + 1; j < roles.length; j++)
            {
                if(roles[i].name === roles[j].name)
                {
                    res.status(405).send({message: "Role names must be unique"})
                    return
                }
            }
        }
        await snapshot.forEach(doc => {
            if(!ids.includes(doc.id)) //If this ID was not included in the request, that means the owner deleted this role
            {
                collection.doc(doc.id).delete()
                //Set the role ID of all users who had this role to null
                db.collection("users").where("role", "==", doc.id).get().then(usersWithRole => {
                    usersWithRole.forEach(userWithRole => {
                        db.collection("users").doc(userWithRole.id).update({
                            role: null
                        })
                    })
                })
            }
        })
        for(let i = 0; i < roles.length; i++) {
            if(Number.isInteger(roles[i].id)) //ID is temporary ID from the Edit Roles page; that means this is a new role.
            {
                await collection.add({
                    name: roles[i].name,
                    permissions: roles[i].permissions
                })
            }
            else //Updating existing role
            {
                await collection.doc(roles[i].id).update({
                    name: roles[i].name,
                    permissions: roles[i].permissions
                })
            }
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.modifyPendingListAndEditRoles = async (req, res) => {
    try {
        const {employees} = req.body;
        const userRef = db.collection("users").doc(req.user.uid);
        const userData = (await userRef.get()).data();
        const companyRef = db.collection("companies").doc(userData.company);

        // Fetch current pending list from the company document
        const companyDoc = await companyRef.get();
        const companyData = companyDoc.data();
        let currentPendingList = companyData.pendingList || [];
        let currentEmployees = [];
        let newPendingList = [];

        //Separate request input into current employees and pending list employees
        for(let i = 0; i < employees.length; i++)
        {
            const snap = await db.collection("users").where("email", "==", employees[i].email).where("company", "==", userData.company).get();
            if(snap.empty)
                newPendingList.push(employees[i])
            else
                currentEmployees.push(employees[i])
        }

        //Prepare batch operation
        const batch = db.batch();

        //Update existing employees' roles and keep track of their emails to remove employees next
        let currentEmployeeEmails = [];
        for(let i = 0; i < currentEmployees.length; i++)
        {
            const userSnap = await db.collection("users").where("email", "==", currentEmployees[i].email).get();
            userSnap.forEach(user => {
                const userRef = db.collection("users").doc(user.id);
                batch.update(userRef, {role: currentEmployees[i].role})
            })
            currentEmployeeEmails.push(currentEmployees[i].email)
        }

        //Remove employees if any
        const allEmployeesSnapshot = await db.collection("users").where("company", "==", userData.company).get();
        if(!allEmployeesSnapshot.empty) {
            allEmployeesSnapshot.forEach(employee => {
                const employeeEmail = employee.data().email;
                if ((!currentEmployeeEmails.includes(employeeEmail)) && (employee.id !== req.user.uid)) //If employee's email was not found in request, AND if employee is not owner making the request, owner is removing them
                {
                    const userRef = db.collection("users").doc(employee.id);
                    batch.update(userRef, {company: null, role: null})
                    batch.update(companyRef, {employees: FieldValue.arrayRemove(employee.id)})
                }
            })
        }

        //Empty pending list
        currentPendingList.forEach(emp => {
            batch.update(companyRef, {
                pendingList: FieldValue.arrayRemove(emp)
            });
        });

        //Add the employees in the new pending list
        newPendingList.forEach(emp => {
            batch.update(companyRef, {
                pendingList: FieldValue.arrayUnion(emp)
            })
        })

        //Commit batch operation
        await batch.commit();
        res.status(200).send();

    } catch (error) {
        console.error("Error updating pending list:", error);
        res.status(400).send(error.message);
    }
}