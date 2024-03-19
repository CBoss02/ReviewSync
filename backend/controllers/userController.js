import {db} from "../config/firebase-config.js";
import {auth} from "../config/firebase-config.js";

export const createUser = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).set({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        });

        res.status(200).send("User created successfully");
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


