const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://reviewsync-39f23.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage, admin };

