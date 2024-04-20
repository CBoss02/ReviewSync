const express = require('express');
const { uploadDocument, getDocuments, testRoute, deleteComment, createComment, getComments} = require('../controllers/documentController');
const multer = require('multer');
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/uploadDocument', upload.single('file'), authMiddleware, uploadDocument);
router.post("/addComment", createComment);
router.delete("/deleteComment", deleteComment);
router.get("/getComments", getComments);
router.get('/', getDocuments);
router.get('/testRoute', authMiddleware, testRoute);

module.exports = router;




