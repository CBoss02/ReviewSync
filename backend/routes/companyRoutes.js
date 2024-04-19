import express from "express";

import {
    createCompany,
    getCompanyID,
    getCompanyName,
    modifyPendingListAndEditRoles,
    addEmployeeToCompany,
    getRoles,
    addOrUpdateRoles,
    getEmailsAndRoles,
    getEmployees,
    getEUpdatedFlag,
    resetEUpdatedFlag,
    getRolesUpdatedFlag,
    resetRolesUpdatedFlag
} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/getCompanyID", getCompanyID);
router.post("/getCompanyName", getCompanyName);
router.post("/getEmployees", getEmployees);
router.put("/modifyPendingListAndEditRoles", modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.post("/getRoles", getRoles);
router.put("/addOrUpdateRoles", addOrUpdateRoles);
router.post("/getEmailsAndRoles", getEmailsAndRoles);
router.post("/getEUpdatedFlag", getEUpdatedFlag);
router.put("/resetEUpdatedFlag", resetEUpdatedFlag);
router.post("/getRUpdatedFlag", getRolesUpdatedFlag);
router.put("/resetRUpdatedFlag", resetRolesUpdatedFlag);

export default router;