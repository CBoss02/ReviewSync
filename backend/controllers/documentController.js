const {storage, db} = require('../config/firebase-config');
const {FieldValue} = require('firebase-admin').firestore;

exports.uploadDocument = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const companyId = user.data().company;

    if (!req.file || !user.exists) {
        return res.status(400).send('Missing file or user');
    }

    try {
        const blob = storage.bucket().file(`${companyId}/documents/${req.file.originalname + Date.now()}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            res.status(500).send(err.toString());
        });

        blobStream.on('finish', async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${storage.bucket().name}/${blob.name}`;

            try {
                const docRef = await db.collection('companies').doc(companyId).collection('documents').add({
                    name: req.file.originalname,
                    url: publicUrl,
                    contentType: req.file.mimetype,
                    createdAt: new Date(),
                    owner: req.user.uid,
                });

                await db.collection('users').doc(req.user.uid).update({
                    documents: FieldValue.arrayUnion(docRef.id),
                });

                res.status(200).send({ id: docRef.id, url: publicUrl });
            } catch (innerError) {
                res.status(500).send(innerError.toString());
            }
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).send(error.toString());
    }
};


exports.getDocuments = async (req, res) => {
    try {
        const documents = [];
        const snapshot = await db.collection('documents').get();
        snapshot.forEach(doc => {
            documents.push({id: doc.id, ...doc.data()});
        });
        res.status(200).json(documents);
    } catch (error) {
        console.error('Failed to retrieve document:', error);
        res.status(500).json({error: error.message});
    }
};

exports.deleteDocument = async (req, res) => {

}

exports.addComment = async (req, res) => {
    try {
        const comment = req.body;
        const user = await db.collection('users').doc(req.user.uid).get();
        const companyID = user.data().company;
        const collection = await db.collection("companies").doc(companyID).collection("documents").doc(comment.documentID).collection("comments");
        await collection.add({
            text: comment.text,
            owner: {
                id: user.id,
                name: user.data().first_name + " " + user.data().last_name
            },
            replies: []
        }).then(() => {
            res.status(200).send();
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.addReply = async (req, res) => {
    try {
        const reply = req.body;
        const user = await db.collection('users').doc(req.user.uid).get();
        const companyID = user.data().company;
        const collection = await db.collection("companies").doc(companyID).collection("documents").doc(reply.documentID).collection("comments");
        await collection.doc(reply.parentID).update({
            replies: FieldValue.arrayUnion({
                text: reply.text,
                owner: {
                    id: user.id,
                    name: user.data().first_name + " " + user.data().last_name
                }
            })
        }).then(() => {
            res.status(200).send();
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.testRoute = async (req, res) => {
    res.send('You are authenticated', req.user.id);
}

exports.deleteComment = async (req, res) => {
    try {
        const comment = req.body;
        const user = await db.collection('users').doc(req.user.uid).get();
        const companyID = user.data().company;
        const collection = await db.collection("companies").doc(companyID).collection("documents").doc(comment.documentID).collection("comments");
        await collection.doc(comment.id).delete().then(() => {
            res.status(200).send();
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.deleteReply = async (req, res) => {
    try {
        const replyData = req.body;
        const user = await db.collection("users").doc(replyData.reply.owner.id).get();
        const companyID = user.data().company;
        const collection = await db.collection("companies").doc(companyID).collection("documents").doc(replyData.documentID).collection("comments");
        await collection.doc(replyData.parentID).update({
            replies: FieldValue.arrayRemove(replyData.reply)
        }).then(() => {
            res.status(200).send();
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getComments = async (req, res) => {
    try {
        const user = await db.collection('users').doc(req.user.uid).get();
        const companyID = user.data().company;
        const comments = [];
        const collection = await db.collection("companies").doc(companyID).collection("documents").doc(req.body.documentID).collection("comments").get();
        await collection.forEach(doc => {
            const commentData = doc.data();
            commentData.id = doc.id;
            comments.push(commentData)
        })
        res.status(200).send({comments: comments});
    } catch (error) {
        res.status(400).send(error.message);
    }
}