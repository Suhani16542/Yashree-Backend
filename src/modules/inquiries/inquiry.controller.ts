import { Request, Response, NextFunction } from 'express';
import { InquiryService } from './inquiry.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class InquiryController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await InquiryService.createInquiry(req.body);
      sendSuccess({
        res,
        statusCode: 201,
        message: 'Admission enquiry submitted successfully',
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await InquiryService.getInquiries(req.query as any);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Inquiries retrieved successfully',
        data: result.inquiries,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await InquiryService.updateInquiryStatus(id, req.body);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Inquiry status updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await InquiryService.deleteInquiry(id);
      sendSuccess({
        res,
        statusCode: 200,
        message: 'Inquiry deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
