import express from "express";
const router = express.Router();
import {createUser, getUsers} from "../controllers/userController.js";

router.post("/createUser", createUser);
router.get("/getUsers", getUsers)

export default router;