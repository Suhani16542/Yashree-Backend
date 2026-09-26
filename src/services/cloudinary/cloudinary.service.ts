import fs from 'fs';
import { configureCloudinary } from './cloudinary.config.js';
import { CloudinaryUploadResult, CloudinaryDeleteResult } from './cloudinary.types.js';
import { logger } from '../../utils/logger.js';
import { ApiError } from '../../utils/apiError.js';

export class CloudinaryService {
  /**
   * Upload an image to Cloudinary and optionally remove local temp file
   */
  static async uploadImage(
    filePath: string,
    folder = 'yashree/images',
    cleanupLocal = true
  ): Promise<CloudinaryUploadResult> {
    const cloudinary = configureCloudinary();

    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      if (cleanupLocal && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore unlink error
        }
      }

      return {
        secure_url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        resource_type: 'image',
        format: uploadRes.format,
        width: uploadRes.width,
        height: uploadRes.height,
        bytes: uploadRes.bytes,
      };
    } catch (error: any) {
      logger.error('Cloudinary image upload failed:', error?.message || error);
      throw ApiError.internal(`Cloudinary image upload failed: ${error?.message || error}`);
    }
  }

  /**
   * Upload a video to Cloudinary
   */
  static async uploadVideo(
    filePath: string,
    folder = 'yashree/videos',
    cleanupLocal = true
  ): Promise<CloudinaryUploadResult> {
    const cloudinary = configureCloudinary();

    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'video',
      });

      if (cleanupLocal && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore unlink error
        }
      }

      return {
        secure_url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        resource_type: 'video',
        format: uploadRes.format,
        duration: uploadRes.duration,
        bytes: uploadRes.bytes,
      };
    } catch (error: any) {
      logger.error('Cloudinary video upload failed:', error?.message || error);
      throw ApiError.internal(`Cloudinary video upload failed: ${error?.message || error}`);
    }
  }

  /**
   * Safely delete an asset from Cloudinary
   */
  static async deleteAsset(
    publicId: string,
    resourceType: 'image' | 'video' = 'image'
  ): Promise<CloudinaryDeleteResult> {
    const cloudinary = configureCloudinary();

    try {
      const deleteRes = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      logger.info(`Cloudinary asset deleted: ${publicId} (${deleteRes.result})`);
      return { result: deleteRes.result };
    } catch (error: any) {
      logger.warn(`Failed to delete Cloudinary asset ${publicId}:`, error?.message || error);
      return { result: 'error' };
    }
  }
}
