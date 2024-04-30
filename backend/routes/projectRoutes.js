const express = require("express");

const {
    getProjects,
    getProject,
    getAllProjects,
    createProject,
    updateName,
    updateEmployee,
    getEmployeesOnProject,
    deleteProject,
    getProjectDocuments
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/getProject/:projectId', authMiddleware, getProject);
router.get("/getAllProjects", authMiddleware,  getAllProjects);

router.get("/getProjects", authMiddleware, getProjects);
router.post("/getProjectDocuments", authMiddleware, getProjectDocuments);
router.post("/createProject", authMiddleware, createProject);
router.put("/updateName", authMiddleware, updateName);
router.put("/updateEmployee", authMiddleware, updateEmployee);
router.post("/getEmployeesOnProject", authMiddleware, getEmployeesOnProject);
router.delete("/deleteProject", authMiddleware, deleteProject);

module.exports = router;