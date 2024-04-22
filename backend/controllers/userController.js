const {db} = require("../config/firebase-config");
const sendEmail = require('./emailController'); // Import sendEmail from mailer.js


exports.createUser = async (req, res) => {
    try {
        // Creating user document in Firestore
        await db.collection("users").doc(req.body.uid).set({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            company: null,
            role: null,
            documents: [],
            projects: []
        });

        // Send welcome email after successful creation
        await sendEmail(req.body.email, "Welcome to Our Service", "Hello " + req.body.first_name + ", welcome to our service!");

        res.status(200).send("User created successfully and email sent.");

    } catch (error) {
        console.error("Failed to create user or send email", error);
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

exports.getCUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const userData = user.data()
        res.status(200).send({cUpdated: userData.cUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetCUpdatedFlag = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).update({
            cUpdated: false
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getRoleUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const userData = user.data()
        res.status(200).send({roleUpdated: userData.roleUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetRoleUpdatedFlag = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).update({
            roleUpdated: false
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getDUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const userData = user.data()
        res.status(200).send({dUpdated: userData.dUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetDUpdatedFlag = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).update({
            dUpdated: false
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getPUpdatedFlag = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.body.uid).get();
        const userData = user.data()
        res.status(200).send({pUpdated: userData.pUpdated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resetPUpdatedFlag = async (req, res) => {
    try {
        await db.collection("users").doc(req.body.uid).update({
            pUpdated: false
        })
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getCurrentUser = async (req, res) => {
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

exports.getName = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await db.collection("users").doc(uid).get();
        const userData = user.data();
        res.status(200).send({first_name: userData.first_name, last_name: userData.last_name})
    } catch (error) {
        res.status(404).send(error.message);
    }
}

exports.updateFName = async (req, res) => {
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

exports.updateLName = async (req, res) => {
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

exports.uploadDocument = async (req, res) => {
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

exports.getPermissions = async (req, res) => {
    const data = req.body;
    const user = await db.collection("users").doc(data.uid).get();
    const userData = user.data();
    const roleID = userData.role;
    if (roleID === "owner") {
        res.status(200).send({permissions: [true, true, true, true, true, true, true]});
    } else {
        const role = await db.collection("companies").doc(userData.company).collection("roles").doc(roleID).get();
        const roleData = role.data();
        const permissions = roleData.permissions;
        res.status(200).send({permissions: permissions});
    }
}



