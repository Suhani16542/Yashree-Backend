import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { AcademyVideoService } from './academyVideo.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { StorageService } from '../../services/storage/storage.service.js';
import { ApiError } from '../../utils/apiError.js';

export class AcademyVideoController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AcademyVideoService.getAcademyVideos(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Academy videos retrieved successfully',
        data: result.videos,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const video = await AcademyVideoService.getAcademyVideoById(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Academy video retrieved successfully',
        data: video,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Standalone direct media upload endpoint (video or thumbnail)
   */
  static async uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const file =
        req.file ||
        files?.videoFile?.[0] ||
        files?.video?.[0] ||
        files?.file?.[0] ||
        files?.thumbnail?.[0];

      if (!file) {
        throw ApiError.badRequest('No media file provided for upload.');
      }

      const ext = path.extname(file.originalname).toLowerCase();
      const isVideo =
        file.mimetype.startsWith('video/') ||
        ['.mp4', '.webm', '.mov', '.mkv', '.ogg', '.m4v'].includes(ext);

      const result = isVideo
        ? await StorageService.handleVideoUpload(file, 'videos')
        : await StorageService.handleImageUpload(file, 'videos');

      sendSuccess({
        res,
        statusCode: 200,
        message: `${isVideo ? 'Video' : 'Image'} uploaded successfully`,
        data: {
          url: result.url,
          videoUrl: isVideo ? result.url : undefined,
          videoSource: isVideo ? 'upload' : undefined,
          videoType: isVideo ? 'upload' : undefined,
          filename: file.filename || file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let resolvedVideoUrl: string | undefined;
      let resolvedThumbnailUrl: string | undefined;

      // Check multer fields
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (files?.videoFile?.[0]) {
        const videoMedia = await StorageService.handleVideoUpload(files.videoFile[0], 'videos');
        resolvedVideoUrl = videoMedia.url;
      } else if (files?.video?.[0]) {
        const videoMedia = await StorageService.handleVideoUpload(files.video[0], 'videos');
        resolvedVideoUrl = videoMedia.url;
      } else if (files?.file?.[0]) {
        const videoMedia = await StorageService.handleVideoUpload(files.file[0], 'videos');
        resolvedVideoUrl = videoMedia.url;
      }

      if (files?.thumbnail?.[0]) {
        const thumbMedia = await StorageService.handleImageUpload(files.thumbnail[0], 'videos');
        resolvedThumbnailUrl = thumbMedia.url;
      } else if (req.file) {
        // Fallback for single thumbnail upload
        const thumbMedia = await StorageService.handleImageUpload(req.file, 'videos');
        resolvedThumbnailUrl = thumbMedia.url;
      }

      const video = await AcademyVideoService.createAcademyVideo(
        req.body,
        resolvedVideoUrl,
        resolvedThumbnailUrl
      );

      sendSuccess({
        res,
        statusCode: 201,
        message: 'Academy video added successfully',
        data: video,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AcademyVideoService.deleteAcademyVideo(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Academy video deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

