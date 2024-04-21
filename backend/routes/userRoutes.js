const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const {getUser, createUser, getName, updateFName,
    updateLName, getPermissions, getCUpdatedFlag,
    resetCUpdatedFlag, getRoleUpdatedFlag, resetRoleUpdatedFlag,
    getDUpdatedFlag, resetDUpdatedFlag, getPUpdatedFlag, resetPUpdatedFlag
} = require("../controllers/userController");

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUser', authMiddleware, getUser);
router.post("/getName", getName);
router.put("/updateFName", updateFName);
router.put("/updateLName", updateLName);
router.post("/getPermissions", getPermissions);
router.post("/getCUpdatedFlag", getCUpdatedFlag);
router.put("/resetCUpdatedFlag", resetCUpdatedFlag);
router.post("/getRoleUpdatedFlag", getRoleUpdatedFlag);
router.put("/resetRoleUpdatedFlag", resetRoleUpdatedFlag);
router.post("/getDUpdatedFlag", getDUpdatedFlag);
router.put("/resetDUpdatedFlag", resetDUpdatedFlag);
router.post("/getPUpdatedFlag", getPUpdatedFlag);
router.put("/resetPUpdatedFlag", resetPUpdatedFlag);

router.get('/test', (req, res) => {
    res.send("Test route");
});


module.exports = router;