import { ApiError } from '../../utils/apiError.js';
import { EmailService } from '../../services/email/email.service.js';
import { Inquiry } from '../../models/inquiry.model.js';
import {
  CreateInquiryInput,
  UpdateInquiryStatusInput,
  GetInquiriesQuery,
} from './inquiry.validation.js';

export class InquiryService {
  static async createInquiry(data: CreateInquiryInput) {
    const inquiry = await Inquiry.create({
      name: data.name,
      phone: data.phone,
      course: data.course,
      mode: data.mode,
      message: data.message || null,
    });

    // Attempt Brevo email notification non-blockingly
    EmailService.sendInquiryNotification({
      name: inquiry.name,
      phone: inquiry.phone,
      course: inquiry.course,
      mode: inquiry.mode,
      message: inquiry.message,
      createdAt: inquiry.createdAt,
    }).catch(() => {
      // Safe fallback - caught inside service
    });

    return inquiry;
  }

  static async getInquiries(query: GetInquiriesQuery) {
    const { search, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { course: searchRegex },
        { message: searchRegex },
      ];
    }

    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort(sortOption).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateInquiryStatus(id: string, data: UpdateInquiryStatusInput) {
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw ApiError.notFound(`Inquiry with ID ${id} not found`);
    }

    return updated;
  }

  static async deleteInquiry(id: string) {
    const deleted = await Inquiry.findByIdAndDelete(id);

    if (!deleted) {
      throw ApiError.notFound(`Inquiry with ID ${id} not found`);
    }

    return { id };
  }
}
