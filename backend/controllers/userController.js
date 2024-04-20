
// Create user account in firestore after creating user in firebase auth
const {db} = require("../config/firebase-config");
exports.createUser = async (req, res) => {
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

// Get user by id
exports.getUser = async (req, res) => {
    const user = req.user;

    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        return res.status(404).send('User not found');
    } else {
        return res.status(200).send(doc.data());
    }
}

exports.getUserById = async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await db.collection("users").doc(userId).get();
        if (user.exists) {
            res.status(200).send(user.data());
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.updateUser = async (req, res) => {

}

exports.deleteUser = async (req, res) => {

}
