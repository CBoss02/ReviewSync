const express = require("express");

const {
    getProjects,
    createProject,
    updateName,
    updateEmployee,
    getEmployeesOnProject,
    deleteProject
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getProjects", authMiddleware,  getProjects);


router.post("/createProject", createProject);
router.put("/updateName", updateName);
router.put("/updateEmployee", updateEmployee);
router.post("/getEmployeesOnProject", getEmployeesOnProject);
router.delete("/deleteProject", deleteProject);

module.exports = router;