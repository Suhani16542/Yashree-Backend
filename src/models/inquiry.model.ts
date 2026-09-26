import mongoose, { Schema, Document, Model } from 'mongoose';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';

export interface IInquiry extends Document {
  id: string;
  name: string;
  phone: string;
  course: string;
  mode: string;
  message?: string | null;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'],
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
InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
