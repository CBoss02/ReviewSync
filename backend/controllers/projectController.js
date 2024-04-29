const {db} = require('../config/firebase-config');
const {FieldValue} = require('firebase-admin').firestore;

exports.getProjects = async (req, res) => {
    try {
        const user = await db.collection('users').doc(req.user.uid).get();
        const userData = user.data();
        let projects = []
        if(userData.projects.length !== 0)
        {
            for(let i = 0; i < userData.projects.length; i++)
            {
                const project = await db.collection("companies").doc(userData.company).collection("projects").doc(userData.projects[i]).get();
                const projectData = project.data();
                projectData.id = userData.projects[i];
                projects.push(projectData)
            }
        }
        res.status(200).send({projects: projects})
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.createProject = async (req, res) => {
    try {
        const name = req.body.name;
        const uid = req.user.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        db.collection("companies").doc(companyID).collection("projects").add({
            name: name,
            owner: uid,
            employees: [],
            documents: [],
        }).then((project) => {
            db.collection("users").doc(uid).update({
                projects: FieldValue.arrayUnion(project.id),
                pUpdated: true
            })
        }).catch((error) => {
            console.log(error)
        })
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getProjectDocuments = async (req, res) => {
    try {
        const projectID = req.body.projectID;
        const uid = req.user.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        const projectRef = await db.collection("companies").doc(companyID).collection("projects").doc(projectID).get();
        const documentIDs = projectRef.data().documents;
        const documents = [];
        const snapshot = await db.collection("companies").doc(companyID).collection("documents").get();
        snapshot.forEach(doc => {
            if(documentIDs.includes(doc.id))
            {
                documents.push({id: doc.id, ...doc.data()});
            }
        });
        res.status(200).send({documents: documents})
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.updateName = async (req, res) => {
    try {
        const data = req.body
        const uid = req.body.uid
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        const project = await db.collection("companies").doc(companyID).collection("projects").doc(data.projectID);
        await project.update({
            name: data.name
        })
        const projectSnap = await project.get();
        const projectData = projectSnap.data();
        for(let i = 0; i < projectData.employees.length; i++)
        {
            await db.collection("users").doc(projectData.employees[i]).update({
                pUpdated: true
            })
        }
        await db.collection("users").doc(uid).update({
            pUpdated: true
        })
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const data = req.body;
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const project = await db.collection("companies").doc(companyID).collection("projects").doc(data.projectID).get();
        const projectData = project.data();
        if(projectData.employees.includes(data.employeeID))
        {
            await db.collection("companies").doc(companyID).collection("projects").doc(data.projectID).update({
                employees: FieldValue.arrayRemove(data.employeeID)
            })
            await db.collection("users").doc(data.employeeID).update({
                projects: FieldValue.arrayRemove(data.projectID),
                pUpdated: true
            })
        }
        else
        {
            await db.collection("companies").doc(companyID).collection("projects").doc(data.projectID).update({
                employees: FieldValue.arrayUnion(data.employeeID)
            })
            await db.collection("users").doc(data.employeeID).update({
                projects: FieldValue.arrayUnion(data.projectID),
                pUpdated: true
            })
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getEmployeesOnProject = async (req, res) => {
    try {
        const data = req.body;
        const uid = req.user.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        let employees = [];
        const snapshot = await db.collection("users").where("company", "==", companyID).get();
        if(!snapshot.empty)
        {
            snapshot.forEach(employee => {
                const employeeData = employee.data();
                if(employee.id !== uid && employeeData.projects.includes(data.projectID))
                {
                    const name = employeeData.first_name.concat(" ").concat(employeeData.last_name)
                    employees.push(name)
                }
            })
        }
        res.status(200).send({employees: employees});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//it makes the most sense to push to the database every time a small thing gets updated
//deleteProject
exports.deleteProject = async (req, res) => {
    try {
        const projectID = req.body.projectID;
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const project = await db.collection("companies").doc(companyID).collection("projects").doc(projectID).get();
        const projectData = project.data();
        if(projectData.documents.length === 0)
        {
            await db.collection("companies").doc(companyID).collection("projects").doc(projectID).delete();
            const users = await db.collection("users").where('company', '==', companyID)
                .where('projects', 'array-contains', projectID)
                .get();
            if(!users.empty)
            {
                await users.forEach(user => {
                    const userData = user.data();
                    if(userData.projects.includes(projectID))
                    {
                        db.collection("users").doc(user.id).update({
                            projects: FieldValue.arrayRemove(projectID),
                            pUpdated: true
                        })
                    }
                })
            }
            res.status(200).send();
        }
        else
        {
            res.status(400).send({message: "There are document reviews taking place in this project. Please ensure they are closed before deleting this project."});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
