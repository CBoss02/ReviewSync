import express from "express";
import {createCompany} from "../controllers/companyController.js";
import {addRole} from "../controllers/companyController.js";
import {editRole} from "../controllers/companyController.js";
import {addEmployeeToCompany} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/addRole", addRole);
router.post("/editRole", editRole);
router.post("/addEmployeeToCompany", addEmployeeToCompany);

export default router;