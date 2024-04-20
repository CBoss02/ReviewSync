const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const {getUser, createUser} = require("../controllers/userController");

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUser', authMiddleware, getUser);
router.get('/test', (req, res) => {
    res.send("Test route");
});


module.exports = router;