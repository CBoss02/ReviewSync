import express from "express";

import {
    getProjects,
    createProject,
    updateName,
    updateEmployee,
    getEmployeesOnProject,
    deleteProject
} from "../controllers/projectController.js";
const router = express.Router();

router.post("/getProjects", getProjects);
router.post("/createProject", createProject);
router.put("/updateName", updateName);
router.put("/updateEmployee", updateEmployee);
router.post("/getEmployeesOnProject", getEmployeesOnProject);
router.delete("/deleteProject", deleteProject);

export default router;