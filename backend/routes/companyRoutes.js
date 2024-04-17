import express from "express";

import {
    createCompany,
    getCompanyID,
    modifyPendingListAndEditRoles,
    addEmployeeToCompany,
    getRoles,
    addOrUpdateRoles,
    getEmailsAndRoles,
    getEmployees
} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/getCompanyID", getCompanyID);
router.post("/getEmployees", getEmployees);
router.put("/modifyPendingListAndEditRoles", modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.get("/getRoles", getRoles);
router.put("/addOrUpdateRoles", addOrUpdateRoles);
router.get("/getEmailsAndRoles", getEmailsAndRoles);


export default router;