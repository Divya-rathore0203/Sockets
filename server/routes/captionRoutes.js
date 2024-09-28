const express = require('express');
const multer = require('multer');
const path = require('path');
const { saveCaption, generateCaption } = require('../controllers/captionController');  

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


router.post('/upload', upload.single('image'), saveCaption, generateCaption);  

router.get('/test', (req, res) => {
    res.send('Test route working');
});

module.exports = router;
