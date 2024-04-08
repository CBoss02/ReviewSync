import express from "express";

import {
    createCompany,
    getCompanyID,
    modifyPendingListAndEditRoles,
    addEmployeeToCompany,
    getRoles,
    addOrUpdateRoles,
} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.get("/getCompanyID", getCompanyID);
router.put("/modifyPendingListAndEditRoles", modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.get("/getRoles", getRoles);
router.put("/addOrUpdateRoles", addOrUpdateRoles);


export default router;