const express = require('express');
const { createCompany, getCompanyID,
    addOrUpdateRoles, modifyPendingListAndEditRoles,
    getEmailsAndRoles, getRoles,
    getEmployees, addEmployeeToCompany,
    getCompanyName, getEmployeesWithEmails, getCompanyOwner
} = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createCompany", authMiddleware, createCompany);
router.get("/getCompanyID", authMiddleware, getCompanyID);
router.get("/getCompanyName", authMiddleware, getCompanyName);
router.get("/getEmployees", authMiddleware, getEmployees);
router.get("/getEmployeesWithEmails", authMiddleware, getEmployeesWithEmails);
router.put("/modifyPendingListAndEditRoles", authMiddleware, modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", authMiddleware, addEmployeeToCompany);
router.get("/getRoles", authMiddleware, getRoles);
router.put("/addOrUpdateRoles", authMiddleware, addOrUpdateRoles);
router.get("/getEmailsAndRoles", authMiddleware, getEmailsAndRoles);
router.get("/getCompanyOwner", authMiddleware, getCompanyOwner);

module.exports = router;