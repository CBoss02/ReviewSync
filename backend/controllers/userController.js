import { db } from "../config/firebase-config.js";

export const createUser = async (req, res) => {
    try {
        const user = req.body;
        db.collection("users").add({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            company: null,
            role: null,
            projects: [],
            documents: []
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}



