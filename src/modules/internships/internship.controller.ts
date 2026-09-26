import { Request, Response, NextFunction } from 'express';
import { InternshipService } from './internship.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';

export class InternshipController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Resume file is required (PDF, DOC, DOCX up to 10MB)');
      }

      const internship = await InternshipService.createInternship(
        req.body,
        req.file.filename
      );

      sendSuccess({
        res,
        statusCode: 201,
        message: 'Internship / Trainer application submitted successfully',
        data: internship,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await InternshipService.getInternships(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Internship applications retrieved successfully',
        data: result.internships,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const internship = await InternshipService.getInternshipById(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Internship application retrieved successfully',
        data: internship,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await InternshipService.updateInternshipStatus(id, req.body);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Internship status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await InternshipService.deleteInternship(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Internship application deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { filePath, filename } = await InternshipService.getResumeFilePath(id);
      res.download(filePath, filename);
    } catch (error) {
      next(error);
    }
  }
}
