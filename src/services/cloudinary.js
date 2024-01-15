import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const options = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto'
}

export default function (image) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, options, (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(error);
            return reject({ message: error.message });
        });
    });
};

