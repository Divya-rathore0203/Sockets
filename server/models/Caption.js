// server/models/Caption.js

const mongoose = require('mongoose');

// Define the Caption schema
const captionSchema = new mongoose.Schema({
    caption: {type: String, required: true},
    imageUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

// Create and export the Caption model
const Caption = mongoose.model('Caption', captionSchema);
module.exports = Caption;
