import { db , FieldValue } from "../config/firebase-config.js";

export const createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        db.collection("companies").add({
            name: companyData.name,
            owner: companyData.owner,
            pendingList: [],
            employees: []
        }).then((data) => {
            db.collection("users").doc(companyData.owner).update({
                company: data.id
            }).then(() => {
                res.status(200).send();
            }).catch((error) => {
                res.status(400).send(error.message);
            })
        }).catch((error) => {
            res.status(400).send(error.message);
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getCompanyID = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        res.status(200).send({companyID: userData.company});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getEmailsAndRoles = async (req, res) => {
    try {
        const companyID = req.body.companyID;
        const company = await db.collection("companies").doc(companyID).get();
        const companyData = company.data();
        let emailsAndRoles = companyData.pendingList
        const qSnapUsers = await db.collection("users").where('company', '==', companyID).get();
        if(!qSnapUsers.empty) {
            let roles = {};
            let i = 0
            const qSnapRoles = await db.collection("companies").doc(companyID).collection("roles").get();
            await qSnapRoles.forEach(role => {
                const roleData = role.data()
                roles[role.id] = roleData.name
            })
            await qSnapUsers.forEach(user => {
                const userData = user.data();
                let emailAndRole = {}
                emailAndRole.email = userData.email
                emailAndRole.role = roles[userData.role]
                emailsAndRoles.push(emailAndRole)
            })
        }
        res.status(200).send({emailsAndRoles: emailsAndRoles});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addEmployeeToCompany = async (req, res) => {
    try {
        const data = req.body;
        const companyCollection = await db.collection("companies");
        const qSnap = await companyCollection.where('name', '==', data.companyName).get();
        if (qSnap.empty) {
            res.status(400).send({message: "No company found with this name. Please check your spelling and/or check with the owner."})
        } else {
            const userSnap = await db.collection("users").doc(data.userID).get();
            const user = userSnap.data();
            let userFound = false;
            qSnap.forEach(companyData => {
                const company = companyData.data();
                let i = 0;
                while (i < company.pendingList.length && !userFound) {
                    if (company.pendingList[i].email === user.email) {
                        userFound = true;
                        const role = company.pendingList[i].role;
                        const userCollection = db.collection("users");
                        companyCollection.doc(companyData.id).update({
                            employees: FieldValue.arrayUnion(userSnap.id),
                            pendingList: FieldValue.arrayRemove({email: user.email, role: role})
                        }).then(() => {
                            userCollection.doc(data.userID).update({
                                company: companyData.id,
                                role: role
                            }).then(() => {
                                res.status(200).send()
                            }).catch((error) => {
                                res.status(400).send(error.message)
                            })
                        }).catch((error) => {
                            res.status(400).send(error.message)
                        })
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

export const getRoles = async (req, res) => {
    try {
        const justNames = req.body.justNames;
        const roles = [];
        const collection = await db.collection("companies").doc(req.body.companyID).collection("roles");
        const snapshot = await collection.get();
        if(snapshot.empty)
        {
            res.status(200).send({roles: []})
        }
        else
        {
            await snapshot.forEach(doc => {
                const data = doc.data()
                data.id = doc.id
                if(justNames)
                {
                    roles.push(data.name)
                }
                else
                {
                    roles.push(data)
                }
            });
            res.status(200).send({roles: roles})
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addOrUpdateRoles = async (req, res) => {
    try {
        const roles = req.body.roles; //array of jsons
        let ids = []; //keeps track of the Firestore ids present in the roles array
        let collection = db.collection('companies').doc(req.body.companyID).collection('roles');
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
            }
        })
        for(let i = 0; i < roles.length; i++) {
            if (roles[i].id.length < 20) //Adding new role
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

export const modifyPendingListAndEditRoles = async (req, res) => {
    try {
        const employees = req.body.employees;
        const companyID = req.body.companyID;
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
                                    role: role.id
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
        if(!employeesOfCompany.empty)
        {
            await employeesOfCompany.forEach(employeeOfCompany => {
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
                        role: null
                    })
                    company.update({
                        employees: FieldValue.arrayRemove(employeeOfCompany.id)
                    })
                }
            })
        }
        const companySnapshot = await company.get();
        const companyData = await companySnapshot.data();
        const pendingList = companyData.pendingList;
        console.log(pendingList)
        console.log(employees)
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