const Caption = require('../models/Caption');

// Simulated caption generation function
const generateCaption = (imagePath) => {
    return "Every Picture Tells a story What is yours ?";
};

// Controller function to handle file upload, generate caption, and save to database
const saveCaption = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const generatedCaption = generateCaption(req.file.path);

        const newCaption = new Caption({
            imageUrl: imageUrl,
            caption: generatedCaption
        });

        await newCaption.save();
        console.log('Caption saved to database.');

        req.io.emit('captionSaved', { imageUrl, caption: generatedCaption });

        res.status(200).json({
            message: 'Caption saved successfully',
            caption: generatedCaption,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error saving caption:', error);
        res.status(500).json({ error: 'Error saving caption.' });
    }
};

// Export the `saveCaption` function directly
module.exports = { saveCaption };
