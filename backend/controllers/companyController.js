import { db , FieldValue} from "../config/firebase-config.js";


export const createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        db.collection("companies").add({
            name: companyData.name,
            owner: companyData.owner,
            employees: companyData.employees
        }).then((data) => {
            db.collection("users").doc(companyData.owner).update({
                company: data.id
            }).catch((error) => {
                res.status(400).send(error.message);
            })
            let i = 0;
            while(i < companyData.employees.length)
            {
                db.collection("users").doc(companyData.employees[i]).update({
                    company: data.id
                }).then(() => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(400).send(error.message);
                })
                i++;
            }
        }).catch((error) => {
            res.status(400).send(error.message);
        })
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
        collection.where('name', '==', roleData.name).get().then(qSnap => {
            if (qSnap.empty) { //Make sure there's no documents with the same role name as the one that was passed in
                collection.doc().set({
                    name: roleData.name,
                    permissions: roleData.permissions //this will be an array?
                }).then(() => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(400).send(error.message);
                });
            } else {
                res.status(400).send("Two roles cannot have the same name"); //may need to change
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const editRole = async (req, res) => {
    try {
        const roleData = req.body;
        let collection = await db.collection('companies').doc(roleData.companyID).collection('roles');
        collection.doc(roleData.docID).update({
            name: roleData.name,
            permissions: roleData.permissions
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addEmployeeToCompany = async (req, res) => {
    try {
        const data = req.body;
        db.collection("users").doc(data.userID).update({
            company: data.companyID,
            role: data.roleID
        }).then(() => {
            db.collection("companies").doc(data.companyID).update({
                employees: FieldValue.arrayUnion(data.userID)
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