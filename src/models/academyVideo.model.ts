import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademyVideo extends Document {
  id: string;
  title: string;
  videoUrl: string;
  category: string;
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
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
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
