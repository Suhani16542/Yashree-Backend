export interface WhatsAppSendResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  skipped?: boolean;
}

export interface InquiryWhatsAppPayload {
  name: string;
  phone: string;
  course: string;
  mode: string;
  message?: string | null;
  createdAt?: Date;
}

export interface InternshipWhatsAppPayload {
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
