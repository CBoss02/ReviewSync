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

exports.createComment = async (req, res) => {
    try {
        const comment = req.body;
        const collection = await db.collection("companies").doc(comment.companyID).collection("documents").doc(comment.documentID).collection("comments");
        collection.add({
            text: comment.text,
            owner: comment.owner,
            replies: []
        }).then((newComment) => {
            if (comment.reply === true) {
                collection.doc(comment.parentID).update({
                    replies: FieldValue.arrayUnion(newComment.id)
                }).then(() => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(400).send(error.message);
                })
            } else {
                res.status(200).send();
            }
        }).catch((error) => {
            res.status(400).send(error.message);
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
        const collection = await db.collection("companies").doc(comment.companyID).collection("documents").doc(comment.documentID).collection("comments");
        const parent = await collection.where('replies', 'array-contains', comment.id).get();
        if (parent.empty) {
            const doc = await collection.doc(comment.id).get();
            const data = doc.data();
            let i = 0;
            while (i < data.replies.length) {
                await collection.doc(data.replies[i]).delete();
                i++;
            }
            await collection.doc(comment.id).delete();
            res.status(200).send();
        } else {
            await parent.forEach(doc => {
                collection.doc(doc.id).update({
                    replies: FieldValue.arrayRemove(comment.id)
                })
            })
            await collection.doc(comment.id).delete();
            res.status(200).send();
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getComments = async (req, res) => {
    try {
        const data = req.body;
        const comments = [];
        const collection = await db.collection("companies").doc(data.companyID).collection("documents").doc(data.documentID).collection("comments");
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            comments.push(doc.data());
        });
        res.status(200).send(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
}