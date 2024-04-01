import express from "express";
import {addDocument} from "../controllers/documentController.js";
import {addComment} from "../controllers/documentController.js";
const router = express.Router();

router.post("/addDocument", addDocument);
router.post("/addComment", addComment);

export default router;