import { db } from "../config/firebase-config.js";

export const createUser = async (req, res) => {
    try {
        const user = req.body;
        db.collection("users").doc().set({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            company: null,
            role: null,
            projects: [],
            documents: []
        }).then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}



