import {db, FieldValue} from "../config/firebase-config.js";

export const getProjects = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        let projects = []
        if(!userData.projects.empty)
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

export const createProject = async (req, res) => {
    try {
        const data = req.body;
        db.collection("companies").doc(data.companyID).collection("projects").add({
            name: data.name,
            owner: data.owner,
            employees: [],
            documents: [],
            changed: false
        }).then((project) => {
            db.collection("users").doc(data.owner).update({
                projects: FieldValue.arrayUnion(project.id)
            })
        }).catch((error) => {
            console.log(error)
        })
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const updateName = async (req, res) => {
    try {
        const data = req.body
        await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).update({
            name: data.name
        })
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const data = req.body;
        const project = await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).get();
        const projectData = project.data();
        if(projectData.employees.includes(data.employeeID))
        {
            await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).update({
                employees: FieldValue.arrayRemove(data.employeeID)
            })
            await db.collection("users").doc(data.employeeID).update({
                projects: FieldValue.arrayRemove(data.projectID)
            })
        }
        else
        {
            await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).update({
                employees: FieldValue.arrayUnion(data.employeeID)
            })
            await db.collection("users").doc(data.employeeID).update({
                projects: FieldValue.arrayUnion(data.projectID)
            })
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getEmployeesOnProject = async (req, res) => {
    try {
        const data = req.body;
        let employees = [];
        const snapshot = await db.collection("users").where("company", "==", data.companyID).get();
        if(!snapshot.empty)
        {
            snapshot.forEach(employee => {
                const employeeData = employee.data();
                if(employee.id !== data.uid && employeeData.projects.includes(data.projectID))
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
export const deleteProject = async (req, res) => {
    try {
        const data = req.body
        const project = await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).get();
        const projectData = project.data();
        if(projectData.documents.length === 0)
        {
            console.log("in if block")
            await db.collection("companies").doc(data.companyID).collection("projects").doc(data.projectID).delete();
            const users = await db.collection("users").where("company", "==", data.companyID).get();
            if(!users.empty)
            {
                await users.forEach(user => {
                    db.collection("users").doc(user.id).update({
                        projects: FieldValue.arrayRemove(data.projectID)
                    })
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