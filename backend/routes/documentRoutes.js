const express = require('express');
const { uploadDocument, getDocuments, testRoute} = require('../controllers/documentController');
const multer = require('multer');
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/uploadDocument', upload.single('file'), authMiddleware, uploadDocument);
router.get('/', getDocuments);
router.get('/testRoute', authMiddleware, testRoute);
router.post("/addComment", addComment);
router.delete("/deleteComment", deleteComment);
router.get("/getComments", getComments);

module.exports = router;




