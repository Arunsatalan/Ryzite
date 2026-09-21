import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'cqpwjere';
const apiKey = process.env.CLOUDINARY_API_KEY || '618832689671566';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'Qsb_NgfNzY7dMY67iAvU-UPBV-U';

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log(`[CLOUDINARY CONFIG] Cloudinary initialized for cloud: "${cloudName}"`);
} else {
  console.warn('[CLOUDINARY CONFIG WARNING] Cloudinary credentials missing in .env. Operating in fallback/mock mode.');
}

export { cloudinary };
