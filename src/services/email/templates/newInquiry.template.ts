import { InquiryEmailPayload } from '../email.types.js';

export const renderNewInquiryTemplate = (
  payload: InquiryEmailPayload
): { html: string; text: string } => {
  const formattedDate = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const text = `
🔔 New Admission Enquiry – Yashree Institute

Name: ${payload.name}
Phone: ${payload.phone}
Course: ${payload.course}
Mode: ${payload.mode}
Message: ${payload.message || 'None'}
Received At: ${formattedDate}
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Admission Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.025em; }
    .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 28px 24px; }
    .field-group { margin-bottom: 18px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 16px; font-weight: 500; color: #0f172a; word-break: break-word; }
    .message-box { background: #f1f5f9; padding: 14px; border-radius: 8px; border-left: 4px solid #6366f1; font-style: italic; margin-top: 6px; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🔔 New Admission Enquiry</h1>
      <p>Yashree Institute of Cosmetology &amp; Aesthetic Academy</p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="label">Candidate Name</div>
        <div class="value">${payload.name}</div>
      </div>
      <div class="field-group">
        <div class="label">Contact Phone</div>
        <div class="value"><a href="tel:${payload.phone}" style="color: #4f46e5; text-decoration: none;">${payload.phone}</a></div>
      </div>
      <div class="field-group">
        <div class="label">Course Interested</div>
        <div class="value">${payload.course}</div>
      </div>
      <div class="field-group">
        <div class="label">Learning Mode</div>
        <div class="value">${payload.mode}</div>
      </div>
      <div class="field-group">
        <div class="label">Message / Notes</div>
        <div class="value message-box">${payload.message ? payload.message : 'No additional message provided.'}</div>
      </div>
      <div class="field-group">
        <div class="label">Submitted At</div>
        <div class="value" style="font-size: 14px; color: #64748b;">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      Automated Notification • Yashree Institute Admin Portal
    </div>
  </div>
</body>
</html>
`.trim();

  return { html, text };
};
