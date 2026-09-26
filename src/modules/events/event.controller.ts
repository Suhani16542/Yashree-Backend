import { Request, Response, NextFunction } from 'express';
import { EventService } from './event.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { StorageService } from '../../services/storage/storage.service.js';

export class EventController {
  static async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await EventService.getPublicEvents(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Events retrieved successfully',
        data: result.events,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await EventService.getAllAdminEvents(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'All events retrieved successfully (admin)',
        data: result.events,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Event banner image is required (JPG, PNG, WebP up to 5MB)');
      }

      const media = await StorageService.handleImageUpload(req.file, 'events');
      const event = await EventService.createEvent(req.body, media.url);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let newBannerUrl: string | undefined;

      if (req.file) {
        const media = await StorageService.handleImageUpload(req.file, 'events');
        newBannerUrl = media.url;
      }

      const event = await EventService.updateEvent(id, req.body, newBannerUrl);

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Event updated successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await EventService.deleteEvent(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Event deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
