import { Request, Response, NextFunction } from 'express';
import { AcademyVideoService } from './academyVideo.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { StorageService } from '../../services/storage/storage.service.js';

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
