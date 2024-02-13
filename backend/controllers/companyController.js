import { db } from "../config/firebase-config.js";

export const createCompany = async (req, res) => {
    try {
        const company = req.body;
        db.collection("companies").doc().set({
            name: company.name,
            owner: null,
            employees: [],
            roles: [],
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
