const {db} = require("../config/firebase-config");
const nodemailer = require('nodemailer');
// Configure the transporter for NodeMailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail; you can change this as needed
    auth: {
        user: 'reviewsyncinc@gmail.com', // Your email
        pass: 'bwsoptvkfsdgxqtq\n' // Your email password
    }
});

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

        res.status(200).send("User created successfully");

    } catch (error) {
        console.error("Failed to create user", error);
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

exports.updateFName = async (req, res) => {
    try {
        await db.collection("users").doc(req.user.uid).update({
            first_name: req.body.first_name
        })
        res.status(200).send()
    } catch (error) {
        res.status(404).send(error.message);
    }
}

exports.updateLName = async (req, res) => {
    try {
        await db.collection("users").doc(req.user.uid).update({
            last_name: req.body.last_name
        })
        res.status(200).send()
    } catch (error) {
        res.status(404).send(error.message);
    }
}

exports.getPermissions = async (req, res) => {
    const user = await db.collection("users").doc(req.user.uid).get();
    const userData = user.data();
    const roleID = userData.role;
    if (roleID === null) //Failsafe in case this user might not have been assigned a role
        res.status(200).send({permissions: [false, false, false, false, false, false, false]});
    else if (roleID === "owner") //Owners have all permissions
        res.status(200).send({permissions: [true, true, true, true, true, true, true]});
    else
    {
        const role = await db.collection("companies").doc(userData.company).collection("roles").doc(roleID).get();
        res.status(200).send({permissions: role.data().permissions});
    }
}

exports.notifyReviewers = async (req, res) => {
    try {
        const { userIds } = req.body; // Array of user IDs and the document ID from request body
        // Fetch user emails from their IDs
        if(userIds.length > 0)
        {
            const usersRef = db.collection('users');
            const promises = userIds.map(userId => usersRef.doc(userId).get());
            const userDocs = await Promise.all(promises);

            const userEmails = userDocs.map(doc => doc.exists ? doc.data().email : null).filter(email => email != null);

            // Send an email to each user individually
            for (const email of userEmails) {
                const mailOptions = {
                    from: 'reviewsyncinc@gmail.com', // sender address
                    to: email, // send to individual user
                    subject: 'Document Addition Notification', // Subject line
                    text: `You have been added as a reviewer to a new document.`, // plain text body
                };
                // Send email
                await transporter.sendMail(mailOptions);
                console.log('Email sent to:', email);
            }

            res.status(200).send({ message: 'Emails sent successfully' });
        }
    } catch (error) {
        console.error('Error notifying users:', error);
        res.status(500).send(error.message);
    }
};
