import express from "express";
import {addDocument, addComment, deleteComment, getComments} from "../controllers/documentController.js";
const router = express.Router();

router.post("/addDocument", addDocument);
router.post("/addComment", addComment);
router.delete("/deleteComment", deleteComment);
router.get("/getComments", getComments);

export default router;