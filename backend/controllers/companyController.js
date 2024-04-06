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
        res.status(200).send(userData.company);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

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
        const roles = [];
        const collection = await db.collection("companies").doc(req.body.companyID).collection("roles");
        const snapshot = await collection.get();
        if(snapshot.empty)
        {
            res.status(200).send([])
        }
        else
        {
            snapshot.forEach(doc => {
                roles.push(doc.data());
            });
            res.status(200).send(roles)
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