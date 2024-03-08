import { db } from "../config/firebase-config.js";

export const createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        let userID;
        let companyID;
        const snapshot = await db.collection('users').where('email', '==', companyData.email).get();
        snapshot.forEach(doc => {
            userID = doc.id; //get the id of the owner of the company
        });
        db.collection("companies").add({ //Changing this to add because it returns a document reference and I can use that to get the ID
            name: companyData.name,
            owner: userID, //As per my discord message (on 3/7), I think we need some way of getting this from the frontend. Right now I have the user's email coming from the frontend
            employees: [],
            roles: [],
            projects: [],
            documents: []
        }).then((docRef) => {
            companyID = docRef.id;
        }).catch((error) => {
            res.status(400).send(error.message);
        });
        //Set the user's company field to this new company
        db.collection("users").doc(userID).set({
            company: companyID
        }).then((data) => {
            //do nothing
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
        let companyID;
        const snapshot = await db.collection('users').where('email', '==', roleData.email).get();
        snapshot.forEach(doc => {
            let data = doc.data(); //get the user document that has the company ID we need
            companyID = data.company;
        });
        let collection = db.collection('companies').doc(companyID).collection('roles'); //From what I've been reading on the internet, I think this will create the collection if it doesn't exist
        collection.where('name', '==', roleData.name).get().then(qSnap => {
            if (qSnap.empty) { //Make sure there's no documents with the same role name as the one that was passed in
                collection.add({ //If it wasn't created in line 45 it'll be created now I think
                    name: roleData.name,
                    permissions: roleData.permissions //this will be key value pairs
                }).then((docRef) => {
                    //do nothing
                }).catch((error) => {
                    res.status(400).send(error.message);
                });
            } else {
                console.log("Two roles cannot have the same name");
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const editRole = async (req, res) => {
    try {
        const roleData = req.body;
        let docID;
        let companyID;
        const snapshot1 = await db.collection('users').where('email', '==', roleData.email).get();
        snapshot1.forEach(doc => {
            let data = doc.data(); //get the user document that has the company ID we need
            companyID = data.company;
        });
        let colRef = db.collection('companies').doc(companyID).collection('roles');
        const snapshot2 = await colRef.where('name', '==', roleData.name).get();
        snapshot2.forEach(doc => {
            docID = doc.id; //get the id of the document we're updating
        });
        await colRef.doc(docID).update({
            name: roleData.name,
            permissions: roleData.permissions
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addEmployeeToCompany = async (req, res) => {
    try {
        const data = req.body;
        let userID;
        let companyID;
        let roleID;
        const snapshot1 = await db.collection('users').where('email', '==', data.userEmail).get();
        snapshot1.forEach(doc => {
            userID = doc.id; //get the ID of the user being added
        });
        const snapshot2 = await db.collection('users').where('email', '==', data.ownerEmail).get();
        snapshot2.forEach(doc => {
            let data = doc.data();
            companyID = data.company;
        });
        const snapshot3 = await db.collection('companies').doc(companyID).collection('roles').where('name', '==', data.role).get();
        snapshot3.forEach(doc => {
            roleID = doc.id;
        });
        db.collection("users").doc(userID).set({
            company: companyID,
            role: roleID
        }).then((data) => {
            //do nothing
        }).catch((error) => {
            res.status(400).send(error.message);
        })
        await db.collection("companies").doc(companyID).update({
            employees: FieldValue.arrayUnion(userID)
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}