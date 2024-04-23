const express = require("express");

const {
    getProject,
    getAllProjects,
    createProject,
    updateName,
    updateEmployee,
    getEmployeesOnProject,
    deleteProject
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/getProject/:projectId', authMiddleware, getProject);
router.get("/getAllProjects", authMiddleware,  getAllProjects);

router.post("/createProject", createProject);
router.put("/updateName", updateName);
router.put("/updateEmployee", updateEmployee);
router.post("/getEmployeesOnProject", getEmployeesOnProject);
router.delete("/deleteProject", deleteProject);

module.exports = router;