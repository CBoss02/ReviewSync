//This is the version that is working on Caleb's system
//I'll leave the other version that seems to be broken on some systems at the bottom of the page.

import {auth} from "../config/firebase-config.js";
//Keeps track of who's signed in

export const VerifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodeValue = await auth.verifyIdToken(token);
        if (decodeValue) {
            req.user = decodeValue;
            return next();
        }
    } catch (e) {
        return res.json({ message: "Internal Error" });
    }
};

export default VerifyToken;


/* Presumably broken version of verifyToken.js
import admin from "firebase-admin";


async function VerifyToken(req, res, next) {
    console.log(req.headers);
    if(req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            req.currentUser = await admin.auth().verifyIdToken(idToken);
            next();
        } catch (error) {
            return res.status(401).send("Unauthorized: Invalid token");

        }
    } else {
        return res.status(403).send("No authentication token found");
    }
}

export default VerifyToken;
 */