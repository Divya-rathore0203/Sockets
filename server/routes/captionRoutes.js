const express = require('express');
const multer = require('multer');
const path = require('path');
const { saveCaption } = require('../controllers/captionController');  // Destructure saveCaption

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

// Define the routes
router.post('/upload', upload.single('image'), saveCaption);  // Correctly use saveCaption

router.get('/test', (req, res) => {
    res.send('Test route working');
});

module.exports = router;
