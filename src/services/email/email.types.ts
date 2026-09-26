export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

export interface InquiryEmailPayload {
  name: string;
  phone: string;
  course: string;
  mode: string;
  message?: string | null;
  createdAt?: Date;
}

export interface InternshipEmailPayload {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  education: string;
  areaOfInterest: string;
  preferredArea: string;
  message?: string | null;
  resumeUrl: string;
  createdAt?: Date;
}
