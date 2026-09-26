import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

let isConfigured = false;

export const configureCloudinary = () => {
  if (isConfigured) return cloudinary;

  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    logger.debug('Cloudinary credentials not configured in environment.');
    return cloudinary;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  isConfigured = true;
  return cloudinary;
};

export { cloudinary };
