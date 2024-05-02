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
router.get("/getCompanyID", authMiddleware, getCompanyID);
router.get("/getCompanyName", authMiddleware, getCompanyName);
router.get("/getEmployees", authMiddleware, getEmployees);
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