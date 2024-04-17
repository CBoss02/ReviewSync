import {db} from "../config/firebase-config.js";
import {auth} from "../config/firebase-config.js";

export const createUser = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).set({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            company: null,
            role: null,
            documents: [],
            projects: []
        });
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}


export const getCurrentUser = async (req, res) => {
    try {
        const user = req.currentUser;
        if (user) {
            console.log(user);
            res.status(200).send(user);
        } else {
            console.log("User not found");
            res.status(400).send("User not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export const getName = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        res.status(200).send({first_name: userData.first_name, last_name: userData.last_name})
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export const updateFName = async (req, res) => {
    try {
        const data = req.body
        await db.collection("users").doc(data.uid).update({
            first_name: data.first_name
        })
        res.status(200).send()
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export const updateLName = async (req, res) => {
    try {
        const data = req.body
        await db.collection("users").doc(data.uid).update({
            last_name: data.last_name
        })
        res.status(200).send()
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export const uploadDocument = async (req, res) => {
    try {
        const user = req.currentUser;

        if (user) {
            const document = {
                document_name: req.body.document_name,
                document_url: req.body.document_url,
                user_id: user.uid,
            }
            await db.collection("companies").add(document);
            res.status(200).send("Document uploaded successfully");
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export const getPermissions = async (req, res) => {
    const data = req.body;
    const user = await db.collection("users").doc(data.uid).get();
    const userData = await user.data();
    const roleID = userData.role;
    const role = await db.collection("companies").doc(userData.company).collection("roles").doc(roleID).get();
    const roleData = await role.data();
    const permissions = roleData.permissions;
    res.status(200).send({permissions: permissions});
}

