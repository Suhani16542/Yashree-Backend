import fs from 'fs';
import path from 'path';
import { ApiError } from '../../utils/apiError.js';
import { EmailService } from '../../services/email/email.service.js';
import { Internship } from '../../models/internship.model.js';
import {
  CreateInternshipInput,
  UpdateInternshipStatusInput,
  GetInternshipsQuery,
} from './internship.validation.js';

export class InternshipService {
  static async createInternship(data: CreateInternshipInput, resumeFilename: string) {
    const internship = await Internship.create({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      education: data.education,
      areaOfInterest: data.areaOfInterest,
      preferredArea: data.preferredArea,
      message: data.message || null,
      resumeUrl: `/uploads/resumes/${resumeFilename}`,
    });

    // Attempt Brevo email notification non-blockingly
    EmailService.sendInternshipNotification({
      fullName: internship.fullName,
      phone: internship.phone,
      email: internship.email,
      city: internship.city,
      education: internship.education,
      areaOfInterest: internship.areaOfInterest,
      preferredArea: internship.preferredArea,
      message: internship.message,
      resumeUrl: internship.resumeUrl,
      createdAt: internship.createdAt,
    }).catch(() => {
      // Safe fallback - caught inside service
    });

    return internship;
  }

  static async getInternships(query: GetInternshipsQuery) {
    const { search, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { education: searchRegex },
        { areaOfInterest: searchRegex },
      ];
    }

    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [internships, total] = await Promise.all([
      Internship.find(filter).sort(sortOption).skip(skip).limit(limit),
      Internship.countDocuments(filter),
    ]);

    return {
      internships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getInternshipById(id: string) {
    const internship = await Internship.findById(id);

    if (!internship) {
      throw ApiError.notFound(`Internship application with ID ${id} not found`);
    }

    return internship;
  }

  static async updateInternshipStatus(id: string, data: UpdateInternshipStatusInput) {
    const updated = await Internship.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw ApiError.notFound(`Internship application with ID ${id} not found`);
    }

    return updated;
  }

  static async deleteInternship(id: string) {
    const existing = await Internship.findById(id);

    if (!existing) {
      throw ApiError.notFound(`Internship application with ID ${id} not found`);
    }

    // Remove local resume file if exists
    if (existing.resumeUrl) {
      const filename = path.basename(existing.resumeUrl);
      const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore file deletion error
        }
      }
    }

    await Internship.findByIdAndDelete(id);

    return { id };
  }

  static async getResumeFilePath(id: string): Promise<{ filePath: string; filename: string }> {
    const internship = await Internship.findById(id);

    if (!internship) {
      throw ApiError.notFound(`Internship application with ID ${id} not found`);
    }

    if (!internship.resumeUrl) {
      throw ApiError.notFound('No resume associated with this application');
    }

    const filename = path.basename(internship.resumeUrl);
    const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);

    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound('Resume file not found on disk');
    }

    return { filePath, filename };
  }
}
