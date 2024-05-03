const express = require('express');
const { uploadDocument, getHomeDocuments, deleteComment, addComment, addReply, getComments, getAllDocuments, getDocument,
    resolveComment,
    uploadRevision,
    getEmployeesOnDocument,
    updateEmployee,
    closeReview,
    resolveAllComments,
} = require('../controllers/documentController');
const multer = require('multer');
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/uploadDocument/:projectId?', upload.single('file'), authMiddleware, uploadDocument);
router.post('/uploadRevision/:documentId', upload.single('file'), authMiddleware, uploadRevision);
router.get('/getEmployeesOnDocument/:documentId', authMiddleware, getEmployeesOnDocument);
router.put('/updateEmployee/:documentId', authMiddleware, updateEmployee);
router.get('/getDocument/:documentId', authMiddleware, getDocument)
router.get('/getAllDocuments/:projectId?',authMiddleware, getAllDocuments);
router.delete("/deleteComment", deleteComment);
router.post("/addComment/:documentId", authMiddleware, addComment);
router.get('/getComments/:documentId', authMiddleware, getComments);
router.post("/addReply/:documentId/:commentId", authMiddleware, addReply);
router.delete("/deleteComment/:documentId/:commentId", authMiddleware, deleteComment);
router.get('/getHomeDocuments', authMiddleware, getHomeDocuments);
router.post('/resolveComment/:documentId/:commentId', authMiddleware, resolveComment);
router.post('/resolveAllComments/:documentId', authMiddleware, resolveAllComments);
router.post('/closeReview/:documentId', authMiddleware, closeReview);

module.exports = router;




