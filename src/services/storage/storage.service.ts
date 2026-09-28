import fs from 'fs';
import path from 'path';
import { env } from '../../config/env.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { logger } from '../../utils/logger.js';

export interface StoredMediaResult {
  url: string;
  publicId?: string;
}

export class StorageService {
  /**
   * Process uploaded image file according to active STORAGE_PROVIDER
   */
  static async handleImageUpload(
    file: Express.Multer.File,
    categoryFolder: 'gallery' | 'events' | 'videos'
  ): Promise<StoredMediaResult> {
    if (env.STORAGE_PROVIDER === 'cloudinary') {
      try {
        const result = await CloudinaryService.uploadImage(
          file.path,
          `yashree/${categoryFolder}`,
          true
        );
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        // If Cloudinary upload fails, remove temp file and rethrow
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch {
            // ignore
          }
        }
        throw error;
      }
    }

    // Default: Local development storage
    return {
      url: `/uploads/${categoryFolder}/${file.filename}`,
    };
  }

  /**
   * Process uploaded video file according to active STORAGE_PROVIDER
   */
  static async handleVideoUpload(
    file: Express.Multer.File,
    categoryFolder = 'videos'
  ): Promise<StoredMediaResult> {
    if (env.STORAGE_PROVIDER === 'cloudinary') {
      try {
        const result = await CloudinaryService.uploadVideo(
          file.path,
          `yashree/${categoryFolder}`,
          true
        );
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch {
            // ignore
          }
        }
        throw error;
      }
    }

    // Local storage for video
    return {
      url: `/uploads/${categoryFolder}/${file.filename}`,
    };
  }

  /**
   * Safely delete media file from Cloudinary or local disk based on its URL pattern
   */
  static async deleteMedia(url: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    if (!url) return;

    // Skip YouTube and third-party external embeds
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return;
    }

    // Check if Cloudinary URL
    if (url.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL if standard format
        // Example: https://res.cloudinary.com/demo/image/upload/v12345678/yashree/gallery/sample.jpg -> yashree/gallery/sample
        const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
        if (matches && matches[1]) {
          await CloudinaryService.deleteAsset(matches[1], resourceType);
        }
      } catch (error) {
        logger.warn(`Could not delete Cloudinary asset from URL ${url}:`, error);
      }
      return;
    }


    // Local file deletion
    if (url.startsWith('/uploads/')) {
      const relativePath = url.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted local file: ${fullPath}`);
        } catch (error) {
          logger.warn(`Could not delete local file ${fullPath}:`, error);
        }
      }
    }
  }
}
