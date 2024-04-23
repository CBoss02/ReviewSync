const express = require('express');
const { uploadDocument, getDocuments, testRoute, deleteComment, deleteReply, addComment, addReply, getComments} = require('../controllers/documentController');
const multer = require('multer');
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/uploadDocument', upload.single('file'), authMiddleware, uploadDocument);
router.post("/addComment", authMiddleware, addComment);
router.post("/addReply", authMiddleware, addReply);
router.delete("/deleteComment", authMiddleware, deleteComment);
router.delete("/deleteReply", deleteReply); //does not need middleware because you access the uid through the data in the request itself: replyData.reply.owner.id
router.post("/getComments", authMiddleware, getComments); //could not get "get" to work with this because we also need the document id
router.get('/', getDocuments);
router.get('/testRoute', authMiddleware, testRoute);

module.exports = router;




