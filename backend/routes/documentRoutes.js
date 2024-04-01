import express from "express";
import {addDocument} from "../controllers/documentController.js";
import {addComment} from "../controllers/documentController.js";
import {deleteComment} from "../controllers/documentController.js";
import {getComments} from "../controllers/documentController.js";
const router = express.Router();

router.post("/addDocument", addDocument);
router.post("/addComment", addComment);
router.post("/deleteComment", deleteComment);
router.post("/getComments", getComments)

export default router;