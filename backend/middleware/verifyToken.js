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