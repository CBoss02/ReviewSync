import express from "express";
import {addProject, addEmployeeToProject} from "../controllers/projectController.js";
const router = express.Router();

router.post("/addProject", addProject);
router.post("/addEmployeeToProject", addEmployeeToProject);

export default router;