import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export async function uploadToCloudinary(fileBuffer: Buffer, folder = 'uploads') {
    return new Promise<{ url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error || !result) return reject(error);
            resolve({ url: result.secure_url });
        });

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
}
