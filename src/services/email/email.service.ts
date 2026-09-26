import { logger } from '../../utils/logger.js';
import { getBrevoConfig, isBrevoConfigured } from './email.config.js';
import {
  SendEmailOptions,
  EmailSendResult,
  InquiryEmailPayload,
  InternshipEmailPayload,
} from './email.types.js';
import { renderNewInquiryTemplate } from './templates/newInquiry.template.js';
import { renderNewInternshipTemplate } from './templates/newInternship.template.js';

export class EmailService {
  /**
   * Universal email dispatcher via Brevo API v3
   */
  static async sendEmail(options: SendEmailOptions): Promise<EmailSendResult> {
    const config = getBrevoConfig();

    if (!config.apiKey) {
      logger.info('Email notification skipped: BREVO_API_KEY is not configured.');
      return { success: false, skipped: true, error: 'BREVO_API_KEY missing' };
    }

    const senderEmail = options.fromEmail || config.senderEmail;
    const senderName = options.fromName || config.senderName;

    if (!senderEmail) {
      logger.warn('Email notification skipped: Sender email (BREVO_SENDER_EMAIL) is not configured.');
      return { success: false, skipped: true, error: 'Sender email missing' };
    }

    const recipients = Array.isArray(options.to)
      ? options.to.map((email) => ({ email: email.trim() }))
      : [{ email: options.to.trim() }];

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: recipients,
          subject: options.subject,
          htmlContent: options.html,
          textContent: options.text,
        }),
      });

      const responseData: any = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorDetail = responseData?.message || `Brevo API HTTP status ${response.status}`;
        logger.error(`Brevo email dispatch failed: ${errorDetail}`);
        return {
          success: false,
          error: errorDetail,
        };
      }

      logger.info(`Email sent successfully via Brevo: ${responseData?.messageId || 'OK'}`);
      return {
        success: true,
        messageId: responseData?.messageId,
      };
    } catch (error: any) {
      logger.error(`Failed to send email via Brevo: ${error?.message || 'Network error'}`);
      return {
        success: false,
        error: error?.message || 'Network error',
      };
    }
  }

  /**
   * Safe Admin Notification for New Admission / Enquiry
   */
  static async sendInquiryNotification(payload: InquiryEmailPayload): Promise<void> {
    const config = getBrevoConfig();
    const recipient = config.notificationEmail;

    if (!recipient) {
      logger.info('Inquiry email notification skipped: NOTIFICATION_EMAIL is not configured.');
      return;
    }

    try {
      const { html, text } = renderNewInquiryTemplate(payload);
      await this.sendEmail({
        to: recipient,
        subject: `🔔 [New Enquiry] ${payload.name} - ${payload.course}`,
        html,
        text,
      });
    } catch (err: any) {
      // Safe fallback - caller never throws
      logger.error('Unexpected error in sendInquiryNotification:', err?.message || err);
    }
  }

  /**
   * Safe Admin Notification for New Internship Application
   */
  static async sendInternshipNotification(payload: InternshipEmailPayload): Promise<void> {
    const config = getBrevoConfig();
    const recipient = config.notificationEmail;

    if (!recipient) {
      logger.info('Internship email notification skipped: NOTIFICATION_EMAIL is not configured.');
      return;
    }

    try {
      const { html, text } = renderNewInternshipTemplate(payload);
      await this.sendEmail({
        to: recipient,
        subject: `🔔 [New Internship Application] ${payload.fullName} - ${payload.areaOfInterest}`,
        html,
        text,
      });
    } catch (err: any) {
      // Safe fallback - caller never throws
      logger.error('Unexpected error in sendInternshipNotification:', err?.message || err);
    }
  }
}
