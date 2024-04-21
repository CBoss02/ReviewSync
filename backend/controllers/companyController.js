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
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        const company = await db.collection("companies").doc(companyID).get();
        const companyName = company.data().name;
        res.status(200).send({companyName: companyName});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        let employees = [];
        const snapshot = await db.collection("users").where("company", "==", companyID).get();
        if(!snapshot.empty)
        {
            snapshot.forEach(employee => {
                if(employee.id !== uid)
                {
                    const employeeData = employee.data();
                    const name = employeeData.first_name.concat(" ").concat(employeeData.last_name);
                    const employeeJson = {id: employee.id, name: name}
                    employees.push(employeeJson)
                }
            })
        }
        res.status(200).send({employees: employees});
    } catch (error) {
        res.status(400).send(error.message);
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
        if(qSnapUsers.docs.length > 1) {
            await qSnapUsers.forEach(user => {
                if(user.id !== companyData.owner)
                {
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
        const employees = req.body.employees;
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        const companyID = userData.company;
        const company = db.collection("companies").doc(companyID);
        let joinedCompany = false;
        for(let i = 0; i < employees.length; i++)
        {
            const userSnapshot = await db.collection("users").where('email', '==', employees[i].email).get();
            if(!userSnapshot.empty) //User is registered
            {
                await userSnapshot.forEach(user => {
                    const userData = user.data();
                    if(userData.company === companyID) //User has already joined company, so update their role
                    {
                        joinedCompany = true;
                        const roleCollection = company.collection("roles");
                        roleCollection.where('name', '==', employees[i].role).get().then((roleSnapshot) => {
                            roleSnapshot.forEach(role => {
                                db.collection("users").doc(user.id).update({
                                    role: role.id,
                                    roleUpdated: true
                                })
                                db.collection("companies").doc(companyID).update({
                                    eUpdated: true
                                })
                            })
                        })
                    }
                })
            }
            if(!joinedCompany) //This also accounts for if a user has not registered yet
            {
                await company.update({
                    pendingList: FieldValue.arrayUnion(employees[i])
                })
            }
        }
        const employeesOfCompany = await db.collection("users").where('company', '==', companyID).get();
        if(employeesOfCompany.docs.length > 1) //if there are more employees than the company owner
        {
            await employeesOfCompany.forEach(employeeOfCompany => {
                if(employeeOfCompany.id !== uid) //do not remove owner of company
                {
                    const employeeOfCompanyData = employeeOfCompany.data();
                    let found = false;
                    for(let i = 0; i < employees.length; i++)
                    {
                        if(employeeOfCompanyData.email === employees[i].email)
                        {
                            found = true
                            break
                        }
                    }
                    if(!found) //This user's email wasn't found in the request, so the owner is removing them
                    {
                        db.collection("users").doc(employeeOfCompany.id).update({
                            company: null,
                            role: null,
                            cUpdated: true
                        })
                        company.update({
                            employees: FieldValue.arrayRemove(employeeOfCompany.id),
                            eUpdated: true
                        })
                    }
                }
            })
        }
        const companySnapshot = await company.get();
        const companyData = companySnapshot.data();
        const pendingList = companyData.pendingList;
        for(let i = 0; i < pendingList.length; i++)
        {
            let found = false
            for(let j = 0; j < employees.length; j++)
            {
                if((pendingList[i].email === employees[j].email) && (pendingList[i].role === employees[j].role))
                {
                    found = true;
                    break
                }
            }
            if(!found)
            {
                await company.update({
                    pendingList: FieldValue.arrayRemove(pendingList[i])
                })
            }
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}