const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'yelpcamp',
        allowedFormats: ['jpeg', 'jpg', 'png', 'webp', 'avif'],
    },
});

function uploadFiles(req, res, next) {
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 10, // 3MB
            files: 10,
        },
    }).array('images');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            req.flash('error', 'File upload limit reached: you can add max 10 pictures of max 5MB each.');
            return res.redirect('/campgrounds/new');
        } else if (err) {
            return next(err);
        }
        next();
    });
}

module.exports = {
    cloudinary,
    storage,
    uploadFiles
};