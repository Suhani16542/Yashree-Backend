import { Request, Response, NextFunction } from 'express';
import { GalleryService } from './gallery.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { StorageService } from '../../services/storage/storage.service.js';

export class GalleryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await GalleryService.getGalleryItems(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Gallery items retrieved successfully',
        data: result.items,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Image file is required (JPG, PNG, WebP up to 5MB)');
      }

      const media = await StorageService.handleImageUpload(req.file, 'gallery');
      const item = await GalleryService.createGalleryItem(req.body, media.url);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'Gallery item uploaded successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await GalleryService.deleteGalleryItem(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Gallery item deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
