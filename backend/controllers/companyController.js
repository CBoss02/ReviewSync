const {db} = require('../config/firebase-config');
const {FieldValue} = require('firebase-admin').firestore;

exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        const doc = await db.collection("companies").add({
            name: companyData.name,
            owner: companyData.owner,
            pendingList: [],
            employees: [],
            eUpdated: false,
            rolesUpdated: false
        })
        await db.collection("users").doc(companyData.owner).update({
            company: doc.id,
            role: "owner"
        })
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getEUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const companyID = user.data().company;
        const company = await db.collection("companies").doc(companyID).get();
        const companyData = company.data();
        res.status(200).send({eUpdated: companyData.eUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetEUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const companyID = user.data().company;
        await db.collection("companies").doc(companyID).update({
            eUpdated: false
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getRolesUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const companyID = user.data().company;
        const company = await db.collection("companies").doc(companyID).get();
        const companyData = company.data();
        res.status(200).send({rolesUpdated: companyData.rolesUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetRolesUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const companyID = user.data().company;
        await db.collection("companies").doc(companyID).update({
            rolesUpdated: false
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getCompanyID = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        res.status(200).send({companyID: userData.company});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getCompanyName = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const company = await db.collection("companies").doc(companyID).get();
        const companyName = company.data().name;
        res.status(200).send({companyName: companyName});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

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

exports.getEmployees = async (req, res) => {
    const user = await db.collection("users").doc(req.body.uid).get();
    const companyID = user.data().company;

    if (!user.exists) {
        return res.status(404).send('User not found');
    }

    try {
        const company = await db.collection("companies").doc(companyID).get();
        const companyData = company.data();
        const employees = [];
        const qSnap = await db.collection("users").where('company', '==', companyID).get();
        if (qSnap.empty) {
            res.status(200).send({employees: []});
        } else {
            await qSnap.forEach(user => {
                if (user.id !== companyData.owner) {
                    const userData = user.data();
                    employees.push(userData);
                }
            });
            res.status(200).send({employees: employees});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getAllEmployees = async (req, res) => {
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

exports.getEmailsAndRoles = async (req, res) => {
        try {
            const user = await db.collection("users").doc(req.body.uid).get();
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

    exports.addEmployeeToCompany = async (req, res) => {
        try {
            const data = req.body;
            const companyCollection = await db.collection("companies");
            const qSnap = await companyCollection.where('name', '==', data.companyName).get();
            if (qSnap.empty) {
                res.status(400).send({message: "No company found with this name. Please check your spelling and/or check with the owner."})
            } else {
                const user = await db.collection("users").doc(data.userID).get();
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
                                eUpdated: true
                            })
                            userCollection.doc(data.userID).update({
                                company: companyData.id,
                                role: role
                            })
                            res.status(200).send();
                        }
                        i++;
                    }
                    if (!userFound) {
                        res.status(400).send({message: "You have not been invited to join this company. Please contact the owner."});
                    }
                })
            }
        } catch (error) {
            res.status(400).send(error.message);
        }

    }

exports.getRoles = async (req, res) => {
    try {
        const roles = [];
        const user = await db.collection("users").doc(req.body.uid).get();
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

exports.addOrUpdateRoles = async (req, res) => {
    try {
        const roles = req.body.roles; //array of jsons
        const user = await db.collection("users").doc(req.body.uid).get();
        const userData = user.data();
        let ids = []; //keeps track of the Firestore ids present in the roles array
        let collection = db.collection('companies').doc(userData.company).collection('roles');
        const snapshot = await collection.get();
        for(let i = 0; i < roles.length; i++)
        {
            ids.push(roles[i].id)
            for(let j = i + 1; j < roles.length; j++)
            {
                if(roles[i].name === roles[j].name)
                {
                    res.status(400).send({message: "Role names must be unique"})
                    return
                }
            }
        }
        await snapshot.forEach(doc => {
            if(!ids.includes(doc.id))
            {
                collection.doc(doc.id).delete()
                db.collection("users").where("role", "==", doc.id).get().then(usersWithRole => {
                    usersWithRole.forEach(userWithRole => {
                        db.collection("users").doc(userWithRole.id).update({
                            role: null,
                            roleUpdated: true
                        })
                    })
                })
            }
        })
        for(let i = 0; i < roles.length; i++) {
            if(Number.isInteger(roles[i].id)) //Adding new role
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
                await db.collection("companies").doc(userData.company).update({
                    rolesUpdated: true
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
        const {employees, uid} = req.body;
        const userRef = db.collection("users").doc(uid);
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

        const allEmployeesSnapshot = await db.collection("users").where("company", "==", userData.company).get();
        if(!allEmployeesSnapshot.empty) {
            allEmployeesSnapshot.forEach(employee => {
                const employeeEmail = employee.data().email;
                if ((!currentEmployeeEmails.includes(employeeEmail)) && (employee.id !== uid)) //If employee's email was not found in request, AND if employee is not owner making the request, owner is removing them
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

exports.getCompany = async (req, res) => {
    try {
        // Fetch user document
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = userDoc.data();

        if (!userData.company) {
            return res.status(404).send('User does not belong to a company');
        }

        // Fetch company document
        const companyDoc = await db.collection("companies").doc(userData.company).get();
        if (!companyDoc.exists) {
            return res.status(404).send('Company not found');
        }
        const companyData = companyDoc.data();

        // Send the company data
        res.status(200).send(companyData);
    } catch (error) {
        console.error('Failed to fetch company:', error);
        res.status(500).send('Error fetching company data');
    }
}
