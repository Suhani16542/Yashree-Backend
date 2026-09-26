import mongoose, { Schema, Document, Model } from 'mongoose';

export type InternshipStatus =
  | 'NEW'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'CLOSED';

export interface IInternship extends Document {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  education: string;
  areaOfInterest: string;
  preferredArea: string;
  message?: string | null;
  resumeUrl: string;
  status: InternshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    areaOfInterest: {
      type: String,
      required: true,
      trim: true,
    },
    preferredArea: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: null,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'NEW',
        'REVIEWING',
        'SHORTLISTED',
        'INTERVIEW',
        'SELECTED',
        'REJECTED',
        'CLOSED',
      ],
      default: 'NEW',
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

// Indexes
InternshipSchema.index({ createdAt: -1 });
InternshipSchema.index({ status: 1, createdAt: -1 });

export const Internship: Model<IInternship> =
  mongoose.models.Internship ||
  mongoose.model<IInternship>('Internship', InternshipSchema);
