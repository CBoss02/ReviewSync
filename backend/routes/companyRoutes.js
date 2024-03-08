import express from "express";
import {createCompany} from "../controllers/companyController.js";
const router = express.Router();

router.post("/createCompany", createCompany);
router.post("/addRoles", addRole);
router.post("/editRole", editRole);

export default router;