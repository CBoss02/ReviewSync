import { db , FieldValue} from "../config/firebase-config.js";

export const createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        db.collection("companies").add({
            name: companyData.name,
            owner: companyData.owner,
            pendingList: []
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

export const getCompanies = async (req, res) => {
    try {
        const data = req.body;
        const companies = [];
        const collection = await db.collection("companies");
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            companies.push(doc.data());
        });
        res.status(200).send(companies);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//With this function, what makes the most sense to me is to have this
//function called whenever the owner presses save on a role- meaning the
//roles are pushed to the database one at a time and not all at once.
//Let me know if you guys think we should do it all at once- send the data from
//the frontend when the owner leaves the add roles page or something like that.
//If we do that I'll rewrite this accordingly.
export const addRole = async (req, res) => {
    try {
        const roleData = req.body;
        let collection = db.collection('companies').doc(roleData.companyID).collection('roles');
        collection.where('id', '==', roleData.name).get().then(qSnap => {
            if (qSnap.empty) { //Make sure there's no documents with the same role name as the one that was passed in
                collection.doc(roleData.name).set({
                    id: roleData.name,
                    permissions: roleData.permissions //this will be an array?
                }).then(() => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(400).send(error.message);
                });
            } else {
                res.status(400).send({message: "Two roles cannot have the same name"}); //may need to change
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const editRole = async (req, res) => {
    try {
        const roleData = req.body;
        const collection = await db.collection('companies').doc(roleData.companyID).collection('roles');
        if(roleData.id !== roleData.newName)
        {
            collection.where('id', '==', roleData.newName).get().then(qSnap => {
                if (qSnap.empty) { //Make sure there's no documents with the same role name as the one that was passed in
                    collection.doc(roleData.id).update({
                        id: roleData.newName,
                        permissions: roleData.permissions //this will be an array?
                    }).then(() => {
                        res.status(200).send();
                    }).catch((error) => {
                        res.status(400).send(error.message);
                    });
                } else {
                    res.status(400).send({message: "Two roles cannot have the same name"}); //may need to change
                }
            })
        }
        else
        {
            collection.doc(roleData.id).update({
                permissions: roleData.permissions
            }).then(() => {
                res.status(200).send();
            }).catch((error) => {
                res.status(400).send(error.message);
            })
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getRoles = async (req, res) => {
    try {
        const data = req.body;
        const roles = [];
        const collection = await db.collection("companies").doc(data.companyID).collection("roles");
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            roles.push(doc.data());
        });
        res.status(200).send(roles);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// functions to:
// 1 - check if company exists
// 2 - check if user is in company's pending list
// 3 - add email and role to company's pending list
// 4 - add employee to company officially
// I think the 1, 2, and 4 can be 1 function. If 1 or 2 fail it'll send
// back the 400 error code and an associated message.

// 3 - add email and role to company's pending list
export const addEmployeeToPendingList = async (req, res) => {
    try {
        const data = req.body;
        const emailAndRole = {email: data.email, role: data.role};
        const company = db.collection("companies").doc(data.companyID);
        company.update({
            pendingList: FieldValue.arrayUnion(emailAndRole)
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            res.status(400).send(error.message);
        })
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
                        const newPendingList = company.pendingList.splice(i, 1);
                        const userCollection = db.collection("users");
                        companyCollection.doc(companyData.id).update({
                            employees: FieldValue.arrayUnion(userSnap.id),
                            pendingList: newPendingList
                        }).then(() => {
                            userCollection.doc(data.userID).update({
                                company: companyData.id,
                                role: role
                            }).then(() => {
                                res.status(200).send()
                            }).catch((error) => {
                                res.status(400).send(error.message)
                            }).catch((error) => {
                                res.status(400).send(error.message)
                            })
                        })
                        i++;
                    }
                    if (!userFound) {
                        res.status(400).send({message: "You have not been invited to join this company. Please contact the owner."});
                    }
                }
            })
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}