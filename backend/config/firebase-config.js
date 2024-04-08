//Configures the firebase cloud

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };
import {getFirestore, FieldValue} from "firebase-admin/firestore";

import {FieldValue} from "firebase-admin/firestore";

const app = initializeApp({
    credential: cert(serviceAccountKey),
});

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth , FieldValue };

