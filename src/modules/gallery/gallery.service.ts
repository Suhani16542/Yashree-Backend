import { ApiError } from '../../utils/apiError.js';
import { StorageService } from '../../services/storage/storage.service.js';
import { GalleryItem } from '../../models/gallery.model.js';
import { CreateGalleryItemInput, GetGalleryQuery } from './gallery.validation.js';

export class GalleryService {
  static async createGalleryItem(data: CreateGalleryItemInput, imageUrl: string) {
    try {
      const item = await GalleryItem.create({
        image: imageUrl,
        category: data.category,
        caption: data.caption || null,
        featured: data.featured ?? false,
      });

      return item;
    } catch (error) {
      // Clean up uploaded image if DB fails
      await StorageService.deleteMedia(imageUrl, 'image');
      throw error;
    }
  }

  static async getGalleryItems(query: GetGalleryQuery) {
    const { category, featured, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    const [items, total] = await Promise.all([
      GalleryItem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      GalleryItem.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async deleteGalleryItem(id: string) {
    const existing = await GalleryItem.findById(id);

    if (!existing) {
      throw ApiError.notFound(`Gallery item with ID ${id} not found`);
    }

    if (existing.image) {
      await StorageService.deleteMedia(existing.image, 'image');
    }

    await GalleryItem.findByIdAndDelete(id);

    return { id };
  }
}
