import express from "express";
import {createCompany, addRole, editRole, addEmployeeToCompany, getCompanies, getRoles, addEmployeeToPendingList} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/addRole", addRole);
router.put("/editRole", editRole);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.get("/getCompanies", getCompanies);
router.get("/getRoles", getRoles);
router.post("/addEmployeeToPendingList", addEmployeeToPendingList);

export default router;