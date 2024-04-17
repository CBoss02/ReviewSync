import express from "express";
import {addDocument, addComment, deleteComment, getComments, addEmployeeToDocument} from "../controllers/documentController.js";
const router = express.Router();

router.post("/addDocument", addDocument);
router.post("/addComment", addComment);
router.delete("/deleteComment", deleteComment);
router.get("/getComments", getComments);
router.get("/addEmployeeToDocument", addEmployeeToDocument);

export default router;