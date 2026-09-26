import { ApiError } from '../../utils/apiError.js';
import { StorageService } from '../../services/storage/storage.service.js';
import { Event } from '../../models/event.model.js';
import { CreateEventInput, UpdateEventInput, GetEventsQuery } from './event.validation.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export class EventService {
  static async createEvent(data: CreateEventInput, bannerUrl: string) {
    let baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!baseSlug) {
      baseSlug = `event-${Date.now()}`;
    }

    // Ensure unique slug
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Event.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    try {
      const event = await Event.create({
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        category: data.category,
        eventDate: new Date(data.eventDate),
        location: data.location,
        bannerImage: bannerUrl,
        published: data.published ?? true,
        featured: data.featured ?? false,
      });

      return event;
    } catch (error) {
      // If DB fails, clean up uploaded banner
      await StorageService.deleteMedia(bannerUrl, 'image');
      throw error;
    }
  }

  static async getPublicEvents(query: GetEventsQuery) {
    const { category, featured, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      published: true,
    };

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ eventDate: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getAllAdminEvents(query: GetEventsQuery) {
    const { category, featured, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ eventDate: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateEvent(id: string, data: UpdateEventInput, newBannerUrl?: string) {
    const existing = await Event.findById(id);

    if (!existing) {
      if (newBannerUrl) {
        await StorageService.deleteMedia(newBannerUrl, 'image');
      }
      throw ApiError.notFound(`Event with ID ${id} not found`);
    }

    const updateData: Record<string, any> = {};

    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.category) updateData.category = data.category;
    if (data.location) updateData.location = data.location;
    if (data.eventDate) updateData.eventDate = new Date(data.eventDate);
    if (data.published !== undefined) updateData.published = data.published;
    if (data.featured !== undefined) updateData.featured = data.featured;

    if (data.slug && data.slug !== existing.slug) {
      const slugCandidate = slugify(data.slug);
      const slugExists = await Event.findOne({ slug: slugCandidate });
      if (slugExists && slugExists.id !== id && slugExists._id.toString() !== id) {
        if (newBannerUrl) {
          await StorageService.deleteMedia(newBannerUrl, 'image');
        }
        throw ApiError.conflict(`Slug "${slugCandidate}" is already in use`);
      }
      updateData.slug = slugCandidate;
    }

    if (newBannerUrl) {
      // Remove old banner
      if (existing.bannerImage) {
        await StorageService.deleteMedia(existing.bannerImage, 'image');
      }
      updateData.bannerImage = newBannerUrl;
    }

    const updated = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  static async deleteEvent(id: string) {
    const existing = await Event.findById(id);

    if (!existing) {
      throw ApiError.notFound(`Event with ID ${id} not found`);
    }

    if (existing.bannerImage) {
      await StorageService.deleteMedia(existing.bannerImage, 'image');
    }

    await Event.findByIdAndDelete(id);

    return { id };
  }
}
