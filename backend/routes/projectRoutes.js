const express = require("express");

const {
    getProjects,
    createProject,
    updateName,
    updateEmployee,
    getEmployeesOnProject,
    deleteProject
} = require("../controllers/projectController");
const router = express.Router();

router.post("/getProjects", getProjects);
router.post("/createProject", createProject);
router.put("/updateName", updateName);
router.put("/updateEmployee", updateEmployee);
router.post("/getEmployeesOnProject", getEmployeesOnProject);
router.delete("/deleteProject", deleteProject);

module.exports = router;