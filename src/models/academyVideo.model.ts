import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademyVideo extends Document {
  id: string;
  title: string;
  videoUrl: string;
  videoSource: 'youtube' | 'upload';
  videoType: 'youtube' | 'upload';
  category: string;
  description?: string | null;
  duration?: string | null;
  thumbnail?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyVideoSchema = new Schema<IAcademyVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videoSource: {
      type: String,
      enum: ['youtube', 'upload'],
      default: 'youtube',
    },
    videoType: {
      type: String,
      enum: ['youtube', 'upload'],
      default: 'youtube',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    duration: {
      type: String,
      default: null,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        // Backward-compatibility: dynamically infer videoSource / videoType for legacy records
        const isYoutube =
          ret.videoUrl &&
          (ret.videoUrl.includes('youtube.com') || ret.videoUrl.includes('youtu.be'));
        ret.videoSource = ret.videoSource || (isYoutube ? 'youtube' : 'upload');
        ret.videoType = ret.videoType || ret.videoSource;
        ret.description = ret.description ?? null;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        const isYoutube =
          ret.videoUrl &&
          (ret.videoUrl.includes('youtube.com') || ret.videoUrl.includes('youtu.be'));
        ret.videoSource = ret.videoSource || (isYoutube ? 'youtube' : 'upload');
        ret.videoType = ret.videoType || ret.videoSource;
        ret.description = ret.description ?? null;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

AcademyVideoSchema.index({ createdAt: -1 });

export const AcademyVideo: Model<IAcademyVideo> =
  mongoose.models.AcademyVideo ||
  mongoose.model<IAcademyVideo>('AcademyVideo', AcademyVideoSchema);

