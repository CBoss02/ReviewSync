import {db, FieldValue} from "../config/firebase-config.js";

//only adding this for testing purposes, I know Megh is writing the document functions
export const addDocument = async (req, res) => {
    try {
        const documentData = req.body;
        let collection = await db.collection('companies').doc(documentData.companyID).collection('documents');
        collection.add({
            name: documentData.name,
            owner: documentData.owner,
            filePath: null
        }).then(() => {
            res.status(200).send();
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addComment = async (req, res) => {
    try {
        const comment = req.body;
        let collection = await db.collection("companies").doc(comment.companyID).collection("documents").doc(comment.documentID).collection("comments");
        collection.add({
            text: comment.text,
            owner: comment.owner,
            replies: []
        }).then((newComment) => {
            if(comment.reply === true)
            {
                collection.doc(comment.parentID).update({
                    replies: FieldValue.arrayUnion(newComment.id)
                }).then(() => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(400).send(error.message);
                })
            }
            else
            {
                res.status(200).send();
            }
        }).catch((error) => {
            res.status(400).send(error.message);
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = req.body;
        let collection = await db.collection("companies").doc(comment.companyID).collection("documents").doc(comment.documentID).collection("comments");
        collection.where('replies', 'array-contains', comment.id).get().then((parent => {
            if(parent.empty)
            {
                collection.doc(comment.id).get().then((doc) => {
                    let data = doc.data();
                    let i = 0;
                    while(i < data.replies.length)
                    {
                        collection.doc(data.replies[i]).delete();
                        i++;
                    }
                    collection.doc(comment.id).delete();
                    res.status(200).send();
                })
            }
            else
            {
                parent.forEach(doc => {
                    collection.doc(doc.id).update({
                        replies: FieldValue.arrayRemove(comment.id)
                    });
                })
                collection.doc(comment.id).delete();
                res.status(200).send();
            }
        }))
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getComments = async (req, res) => {
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