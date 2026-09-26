import twilio from 'twilio';
import { logger } from '../../utils/logger.js';
import { getWhatsAppConfig, formatWhatsAppNumber } from './whatsapp.config.js';
import {
  WhatsAppSendResult,
  InquiryWhatsAppPayload,
  InternshipWhatsAppPayload,
} from './whatsapp.types.js';

export class WhatsAppService {
  /**
   * Format message for New Inquiry
   */
  static buildInquiryMessage(payload: InquiryWhatsAppPayload): string {
    const messageContent = payload.message?.trim() ? payload.message.trim() : 'N/A';
    return (
      `🔔 New Enquiry – Yashree Institute\n\n` +
      `Name: ${payload.name}\n` +
      `Phone: ${payload.phone}\n` +
      `Course: ${payload.course}\n` +
      `Mode: ${payload.mode}\n` +
      `Message: ${messageContent}`
    );
  }

  /**
   * Format message for New Internship Application
   */
  static buildInternshipMessage(payload: InternshipWhatsAppPayload): string {
    const messageContent = payload.message?.trim() ? payload.message.trim() : 'N/A';
    return (
      `🔔 New Internship Application – Yashree Institute\n\n` +
      `Name: ${payload.fullName}\n` +
      `Phone: ${payload.phone}\n` +
      `Email: ${payload.email}\n` +
      `City: ${payload.city}\n` +
      `Education: ${payload.education}\n` +
      `Area of Interest: ${payload.areaOfInterest}\n` +
      `Preferred Area: ${payload.preferredArea}\n` +
      `Message: ${messageContent}\n` +
      `Resume: ${payload.resumeUrl}`
    );
  }

  /**
   * Send WhatsApp message via Twilio API
   */
  static async sendWhatsAppMessage(
    message: string,
    recipientNumber?: string
  ): Promise<WhatsAppSendResult> {
    const config = getWhatsAppConfig();

    if (!config.enabled) {
      logger.info('WhatsApp notification skipped: WHATSAPP_ENABLED is set to false.');
      return { success: false, skipped: true, error: 'WHATSAPP_ENABLED is false' };
    }

    if (!config.accountSid || !config.authToken) {
      logger.warn(
        'WhatsApp notification skipped: Twilio credentials (TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN) are missing.'
      );
      return { success: false, skipped: true, error: 'Twilio credentials missing' };
    }

    if (!config.fromNumber) {
      logger.warn(
        'WhatsApp notification skipped: TWILIO_WHATSAPP_FROM is not configured.'
      );
      return { success: false, skipped: true, error: 'TWILIO_WHATSAPP_FROM missing' };
    }

    const targetRecipient = recipientNumber || config.recipientNumber;
    if (!targetRecipient) {
      logger.warn(
        'WhatsApp notification skipped: Recipient number is not configured.'
      );
      return { success: false, skipped: true, error: 'Recipient number missing' };
    }

    const fromFormatted = formatWhatsAppNumber(config.fromNumber);
    const toFormatted = formatWhatsAppNumber(targetRecipient);

    if (!fromFormatted || !toFormatted) {
      logger.warn('WhatsApp notification skipped: Invalid phone number formatting.');
      return { success: false, skipped: true, error: 'Invalid phone number formatting' };
    }

    try {
      const client = twilio(config.accountSid, config.authToken);

      const twilioMessage = await client.messages.create({
        from: fromFormatted,
        to: toFormatted,
        body: message,
      });

      logger.info(`WhatsApp notification dispatched successfully: ${twilioMessage.sid}`);
      return {
        success: true,
        messageSid: twilioMessage.sid,
      };
    } catch (err: any) {
      // Safe error logging without exposing any sensitive tokens
      logger.error(`Twilio WhatsApp dispatch failed: ${err?.message || 'Unknown Twilio error'}`);
      return {
        success: false,
        error: err?.message || 'Twilio dispatch error',
      };
    }
  }

  /**
   * Non-blocking notification dispatcher for inquiries
   */
  static async sendInquiryNotification(payload: InquiryWhatsAppPayload): Promise<void> {
    try {
      const message = this.buildInquiryMessage(payload);
      await this.sendWhatsAppMessage(message);
    } catch (error: any) {
      // Safe error handling to ensure caller never breaks
      logger.error('Unexpected error in WhatsApp inquiry notification:', error?.message || error);
    }
  }

  /**
   * Non-blocking notification dispatcher for internships
   */
  static async sendInternshipNotification(payload: InternshipWhatsAppPayload): Promise<void> {
    try {
      const message = this.buildInternshipMessage(payload);
      await this.sendWhatsAppMessage(message);
    } catch (error: any) {
      // Safe error handling to ensure caller never breaks
      logger.error('Unexpected error in WhatsApp internship notification:', error?.message || error);
    }
  }
}
