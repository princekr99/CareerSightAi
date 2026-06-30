const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume } = require('../controllers/resumeController');
const authenticate = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticate, upload.single('resume'), uploadResume);

module.exports = router;
