const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const {getUser, createUser, updateFName,
    updateLName, getPermissions, notifyReviewers
} = require("../controllers/userController");

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUser', authMiddleware, getUser);
router.put("/updateFName", authMiddleware, updateFName);
router.put("/updateLName", authMiddleware, updateLName);
router.get("/getPermissions", authMiddleware, getPermissions);
router.post("/notifyReviewers", notifyReviewers);

router.get('/test', (req, res) => {
    res.send("Test route");
});

module.exports = router;