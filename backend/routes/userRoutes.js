import express from "express";
const router = express.Router();
import {createUser,
    getCurrentUser,
    uploadDocument,
    getName,
    updateFName,
    updateLName,
    getPermissions,
    getCUpdatedFlag,
    resetCUpdatedFlag,
    getRoleUpdatedFlag,
    resetRoleUpdatedFlag,
    getDUpdatedFlag,
    resetDUpdatedFlag,
    getPUpdatedFlag,
    resetPUpdatedFlag
} from "../controllers/userController.js";
import VerifyToken from "../middleware/verifyToken.js";

router.post("/createUser", createUser);
router.get("/getCurrentUser", VerifyToken, getCurrentUser);
router.post("/uploadDocument", VerifyToken, uploadDocument);
router.post("/getName", getName);
router.put("/updateFName", updateFName);
router.put("/updateLName", updateLName);
router.post("/getPermissions", getPermissions);
router.post("/getCUpdatedFlag", getCUpdatedFlag);
router.put("/resetCUpdatedFlag", resetCUpdatedFlag);
router.post("/getRUpdatedFlag", getRoleUpdatedFlag);
router.put("/resetRUpdatedFlag", resetRoleUpdatedFlag);
router.post("/getDUpdatedFlag", getDUpdatedFlag);
router.put("/resetDUpdatedFlag", resetDUpdatedFlag);
router.post("/getPUpdatedFlag", getPUpdatedFlag);
router.put("/resetPUpdatedFlag", resetPUpdatedFlag);

export default router;