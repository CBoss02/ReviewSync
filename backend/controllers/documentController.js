const {storage, db} = require('../config/firebase-config');
const express = require("express");
const {getDownloadURL} = require("firebase-admin/storage");
const {FieldValue} = require('firebase-admin').firestore;
const nodemailer = require('nodemailer');
// Configure the transporter for NodeMailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail; you can change this as needed
    auth: {
        user: 'reviewsyncinc@gmail.com', // Your email
        pass: 'bwsoptvkfsdgxqtq\n' // Your email password
    }
});

exports.uploadDocument = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    if (!user.exists || !req.file) {
        return res.status(400).send('Missing file or user');
    }

    const companyId = user.data().company;
    const filePath = `${companyId}/documents/${req.file.originalname}-${Date.now()}`;
    const storageRef = storage.bucket();

    try {
        // Correctly using the upload method here
        const [file] = await storageRef.upload(req.file.path, {
            destination: filePath,
            metadata: {
                contentType: req.file.mimetype,
            }
        });

        // Get a signed URL for reading the file
        const downloadUrl = await getDownloadURL(file);

        let reviewers = [];
        if (req.body.reviewers === null || req.body.reviewers === undefined) {
            reviewers = [];
        } else {
            reviewers = req.body.reviewers;
        }

        try {
            const docRef = await db.collection('companies').doc(companyId).collection('documents').add({
                name: req.file.originalname,
                owner: req.user.uid,
                state: {
                    id: 0,
                    name: 'Uploaded',
                    revision: 0,
                },
                reviewers: reviewers,
                project: req.body.project,
                url: downloadUrl,
                contentType: req.file.mimetype,
                createdAt: new Date(),
            });

            // Check if project ID is provided and add document to project
            if ((req.params.projectId !== undefined) && (req.params.projectId !== null)) {
                await db.collection('companies').doc(companyId).collection('projects').doc(req.params.projectId).update({
                    documents: FieldValue.arrayUnion(docRef.id),
                });
            }
            else
            {
                await db.collection('users').doc(req.user.uid).update({
                    documents: FieldValue.arrayUnion(docRef.id),
                });
            }

            res.status(200).send({id: docRef.id, url: downloadUrl});
        } catch (innerError) {
            res.status(500).send(innerError.toString());
        }
    } catch (error) {
        console.error('Failed to upload document:', error);
        res.status(500).send(error.toString());
    }
};

exports.uploadRevision = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const companyId = user.data().company;

    if (!user.exists || !req.file) {
        return res.status(400).send('Missing file or user');
    }

    const filePath = `${companyId}/documents/${req.file.originalname}-${Date.now()}`;
    const storageRef = storage.bucket();


    try {
        const [file] = await storageRef.upload(req.file.path, {
            destination: filePath,
            metadata: {
                contentType: req.file.mimetype,
            }
        });

        const downloadUrl = await getDownloadURL(file);

        try {
            const document = await db.collection('companies').doc(companyId).collection('documents').doc(req.params.documentId).get();
            if (!document.exists) {
                return res.status(404).send('Document not found');
            }

            const revision = document.data().state.revision + 1;
            await db.collection('companies').doc(companyId).collection('documents').doc(req.params.documentId).update({
                state: {
                    id: 1,
                    name: 'Revised',
                    revision: revision,
                },
                url: downloadUrl,
                contentType: req.file.mimetype,
                updatedAt: new Date(),
                name: req.file.originalname,
            });

            res.status(200).send({url: downloadUrl});
        } catch (error) {
            res.status(500).send(error.toString());
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
}


exports.getAllDocuments = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const companyId = user.data().company;

    if (!user.exists) {
        return res.status(400).send('User not found');
    }


    try {
        const documents = [];
        if (req.params.projectId != null || req.params.projectId !== undefined) {
            const snapshot = await db.collection('companies').doc(companyId).collection('projects').doc(req.params.projectId).get();
        } else {
            const snapshot = await db.collection('companies').doc(companyId).collection('documents').get();
            snapshot.forEach(doc => {
                // Check if user is in the reviewers list
                if ((doc.data().reviewers.includes(req.user.uid) || doc.data().owner === req.user.uid) && doc.data().state.id !== 2){
                    documents.push({id: doc.id, ...doc.data()});
                }
            });
        }
        res.status(200).send(documents);
    } catch (error) {
        res.status(500).send(error.toString());
    }
};

exports.getHomeDocuments = async (req, res) => {
    try {
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const documentIDs = user.data().documents;
        const documents = [];
        const snapshot = await db.collection("companies").doc(companyID).collection("documents").get();

        snapshot.forEach(doc => {
            const docData = doc.data();
            if ((documentIDs.includes(doc.id)) && (docData.state.name !== 'Closed')) {
                documents.push({id: doc.id, ...doc.data()});
            }
        });
        res.status(200).send({documents: documents});
    } catch (error) {
        res.status(400).send(error.message);
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

exports.getDocument = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();

    if (!user.exists) {
        return res.status(400).send('User not found');
    }

    try {
        const document = await db.collection('companies').doc(user.data().company).collection('documents').doc(req.params.documentId).get();
        if (!document.exists) {
            return res.status(404).send('Document not found');
        }

        res.status(200).send(document.data());
    } catch (error) {
        res.status(500).send(error.toString());
    }
};

exports.getEmployeesOnDocument = async (req, res) => {
    try {
        const uid = req.user.uid;
        const user = await db.collection("users").doc(uid).get();
        const companyID = user.data().company;
        let employees = [];
        const snapshot = await db.collection("users").where("company", "==", companyID).get();
        if(!snapshot.empty)
        {
            snapshot.forEach(employee => {
                const employeeData = employee.data();
                if(employee.id !== uid && employeeData.documents.includes(req.params.documentId))
                {
                    const name = employeeData.first_name.concat(" ").concat(employeeData.last_name)
                    employees.push(name)
                }
            })
        }
        res.status(200).send({employees: employees});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const data = req.body;
        const user = await db.collection("users").doc(req.user.uid).get();
        const companyID = user.data().company;
        const document = await db.collection("companies").doc(companyID).collection("documents").doc(req.params.documentId).get();
        const documentData = document.data();
        if(documentData.reviewers.includes(data.employeeID))
        {
            await db.collection("companies").doc(companyID).collection("documents").doc(req.params.documentId).update({
                reviewers: FieldValue.arrayRemove(data.employeeID)
            })
            await db.collection("users").doc(data.employeeID).update({
                documents: FieldValue.arrayRemove(req.params.documentId),
            })
        }
        else
        {
            await db.collection("companies").doc(companyID).collection("documents").doc(req.params.documentId).update({
                reviewers: FieldValue.arrayUnion(data.employeeID)
            })
            const employeeDoc = db.collection("users").doc(data.employeeID);
            await employeeDoc.update({
                documents: FieldValue.arrayUnion(req.params.documentId),
            })
            const employee = await employeeDoc.get();
            const mailOptions = {
                from: 'reviewsyncinc@gmail.com', // sender address
                to: employee.data().email, // send to individual user
                subject: 'Document Addition Notification', // Subject line
                text: `You have been added as a reviewer to a new document. ${documentData.name}`, // plain text body
            };
            // Send email
            transporter.sendMail(mailOptions);
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.deleteDocument = async (req, res) => {

}

exports.closeReview = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const companyId = user.data().company;
    const documentId = req.params.documentId;

    try {
        await db.collection('companies').doc(companyId).collection('documents').doc(documentId).update({
            state: {
                id: 2,
                name: 'Closed',
                revision: 0,
            }
        });

        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}


exports.addComment = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const comment = req.body.comment;

    try {
        const commentRef = await db.collection('companies').doc(user.data().company).collection('documents').doc(req.params.documentId).collection('comments').add({
            text: comment,
            owner: {
                uid: req.user.uid,
                name: user.data().first_name + " " + user.data().last_name,
                email: user.data().email
            },
            createdAt: new Date(),
            replies: [],
            state: 'open',
            isReply: false
        });
        res.status(200).send({id: commentRef.id});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.getComments = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    try {
        const comments = [];
        const snapshot = await db.collection('companies').doc(user.data().company).collection('documents').doc(req.params.documentId).collection('comments').get();
        snapshot.forEach(doc => {
            if (doc.data().state === 'open') {
                comments.push({id: doc.id, ...doc.data()});
            }
        });
        res.status(200).send(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


exports.addReply = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const comment = req.body.comment;

    try {
        const reply = {
            text: comment,
            parentId: req.params.commentId,
            owner: {
                uid: req.user.uid,
                name: user.data().first_name + " " + user.data().last_name,
                email: user.data().email
            },
            createdAt: new Date(),
            state: 'open',
            isReply: true
        }

        const collection = await db.collection('companies').doc(user.data().company).collection('documents').doc(req.params.documentId).collection('comments');
        await collection.doc(req.params.commentId).update({
            replies: FieldValue.arrayUnion(reply)
        }).then(() => {
            res.status(200).send();
        });
    } catch (error) {
        res.status(400).send(error.message);
    }

}

exports.deleteComment = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const documentID = req.params.documentId;
    const commentID = req.params.commentId;
    try {
        const collection = await db.collection('companies').doc(user.data().company).collection('documents').doc(documentID).collection('comments');
        await collection.doc(commentID).update({
            state: 'deleted'
        }).then(() => {
            res.status(200).send();
        });
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

exports.resolveComment = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const documentID = req.params.documentId;
    const commentID = req.params.commentId;

    try {
        const collection = await db.collection('companies').doc(user.data().company).collection('documents').doc(documentID).collection('comments');
        await collection.doc(commentID).update({
            state: 'resolved'
        }).then(() => {
            res.status(200).send();
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.resolveAllComments = async (req, res) => {
    const user = await db.collection('users').doc(req.user.uid).get();
    const documentID = req.params.documentId;

    try {
        const collection = await db.collection('companies').doc(user.data().company).collection('documents').doc(documentID).collection('comments');
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            collection.doc(doc.id).update({
                state: 'resolved'
            });
        });
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}