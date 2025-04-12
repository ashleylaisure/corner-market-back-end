const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up storage for profile images
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// Set up storage for listing images
const listingStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/listings/');
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// File filter to accept only images 
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Export multer instances for different upload types 
exports.profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

// Export listing upload middleware
exports.listingUpload = multer({
    storage: listingStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});