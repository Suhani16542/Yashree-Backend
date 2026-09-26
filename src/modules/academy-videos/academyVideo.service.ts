import { ApiError } from '../../utils/apiError.js';
import { StorageService } from '../../services/storage/storage.service.js';
import { AcademyVideo } from '../../models/academyVideo.model.js';
import { CreateAcademyVideoInput, GetAcademyVideosQuery } from './academyVideo.validation.js';

function extractYouTubeThumbnail(url: string): string | null {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  } catch {
    // ignore
  }
  return null;
}

export class AcademyVideoService {
  static async createAcademyVideo(
    data: CreateAcademyVideoInput,
    resolvedVideoUrl?: string,
    resolvedThumbnailUrl?: string
  ) {
    const videoUrl = resolvedVideoUrl || data.videoUrl;

    if (!videoUrl) {
      throw ApiError.badRequest('A video URL or uploaded video file is required.');
    }

    let thumbnail: string | null = null;

    if (resolvedThumbnailUrl) {
      thumbnail = resolvedThumbnailUrl;
    } else if (data.thumbnailUrl) {
      thumbnail = data.thumbnailUrl;
    } else {
      // Auto-extract thumbnail for YouTube videos
      thumbnail = extractYouTubeThumbnail(videoUrl);
    }

    try {
      const video = await AcademyVideo.create({
        title: data.title,
        videoUrl,
        category: data.category,
        duration: data.duration || null,
        thumbnail,
        published: data.published ?? true,
      });

      return video;
    } catch (error) {
      // Clean up newly uploaded assets if DB write fails
      if (resolvedVideoUrl) {
        await StorageService.deleteMedia(resolvedVideoUrl, 'video');
      }
      if (resolvedThumbnailUrl) {
        await StorageService.deleteMedia(resolvedThumbnailUrl, 'image');
      }
      throw error;
    }
  }

  static async getAcademyVideos(query: GetAcademyVideosQuery) {
    const { category, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      published: true,
    };

    if (category) {
      filter.category = category;
    }

    const [videos, total] = await Promise.all([
      AcademyVideo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AcademyVideo.countDocuments(filter),
    ]);

    return {
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async deleteAcademyVideo(id: string) {
    const existing = await AcademyVideo.findById(id);

    if (!existing) {
      throw ApiError.notFound(`Academy video with ID ${id} not found`);
    }

    // Clean up video media if locally uploaded or Cloudinary
    if (existing.videoUrl) {
      await StorageService.deleteMedia(existing.videoUrl, 'video');
    }

    // Clean up thumbnail if locally uploaded or Cloudinary
    if (existing.thumbnail && !existing.thumbnail.includes('img.youtube.com')) {
      await StorageService.deleteMedia(existing.thumbnail, 'image');
    }

    await AcademyVideo.findByIdAndDelete(id);

    return { id };
  }
}
