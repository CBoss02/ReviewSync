import express from "express";
const router = express.Router();
import {createUser, getCurrentUser, uploadDocument} from "../controllers/userController.js";
import {VerifyToken} from "../middleware/VerifyToken.js";

router.post("/createUser", createUser);
router.get("/getCurrentUser", VerifyToken, getCurrentUser);
router.post("/uploadDocument", VerifyToken, uploadDocument);

export default router;