const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const {getUser, createUser} = require("../controllers/userController");

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUser', authMiddleware, getUser);
router.get('/test', (req, res) => {
    res.send("Test route");
});

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


module.exports = router;