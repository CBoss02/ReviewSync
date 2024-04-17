import express from "express";
const router = express.Router();
import {createUser, getCurrentUser, uploadDocument, getPermissions, getName, updateFName, updateLName} from "../controllers/userController.js";
import VerifyToken from "../middleware/verifyToken.js";

router.post("/createUser", createUser);
router.post("/getName", getName);
router.put("/updateFName", updateFName);
router.put("/updateLName", updateLName);
router.get("/getCurrentUser", VerifyToken, getCurrentUser);
router.post("/uploadDocument", VerifyToken, uploadDocument);
router.post("/getPermissions", getPermissions);

export default router;