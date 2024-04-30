const express = require('express');
const { createCompany, getCompanyID,
    addOrUpdateRoles, modifyPendingListAndEditRoles,
    getEmailsAndRoles, getRoles,
    getEmployees, addEmployeeToCompany,
    getCompanyName, getEUpdatedFlag,
    resetEUpdatedFlag, getRolesUpdatedFlag,
    resetRolesUpdatedFlag, getCompany, getAllEmployees, getCompanyOwner
} = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/getCompanyID", getCompanyID);
router.post("/getCompanyName", getCompanyName);
router.post("/getEmployees", getEmployees);
router.get("/getAllEmployees", authMiddleware, getAllEmployees);
router.put("/modifyPendingListAndEditRoles", modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.post("/getRoles", getRoles);
router.put("/addOrUpdateRoles", addOrUpdateRoles);
router.post("/getEmailsAndRoles", getEmailsAndRoles);
router.post("/getEUpdatedFlag", getEUpdatedFlag);
router.put("/resetEUpdatedFlag", resetEUpdatedFlag);
router.post("/getRolesUpdatedFlag", getRolesUpdatedFlag);
router.put("/resetRolesUpdatedFlag", resetRolesUpdatedFlag);
router.get("/getCompany", authMiddleware, getCompany);
router.get("/getCompanyOwner", authMiddleware, getCompanyOwner);

module.exports = router;