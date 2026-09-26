import { InternshipEmailPayload } from '../email.types.js';

export const renderNewInternshipTemplate = (
  payload: InternshipEmailPayload
): { html: string; text: string } => {
  const formattedDate = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const text = `
🔔 New Internship Application – Yashree Institute

Applicant Name: ${payload.fullName}
Phone: ${payload.phone}
Email: ${payload.email}
City: ${payload.city}
Education: ${payload.education}
Area of Interest: ${payload.areaOfInterest}
Preferred Area: ${payload.preferredArea}
Message: ${payload.message || 'None'}
Resume: ${payload.resumeUrl}
Received At: ${formattedDate}
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Internship Application</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.025em; }
    .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 28px 24px; }
    .field-group { margin-bottom: 18px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 16px; font-weight: 500; color: #0f172a; word-break: break-word; }
    .message-box { background: #f1f5f9; padding: 14px; border-radius: 8px; border-left: 4px solid #10b981; font-style: italic; margin-top: 6px; }
    .resume-btn { display: inline-block; background-color: #059669; color: #ffffff !important; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 6px; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🔔 New Internship Application</h1>
      <p>Yashree Institute Career &amp; Training Portal</p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="label">Candidate Name</div>
        <div class="value">${payload.fullName}</div>
      </div>
      <div class="field-group">
        <div class="label">Contact Information</div>
        <div class="value">
          <div>Phone: <a href="tel:${payload.phone}" style="color: #059669; text-decoration: none;">${payload.phone}</a></div>
          <div>Email: <a href="mailto:${payload.email}" style="color: #059669; text-decoration: none;">${payload.email}</a></div>
        </div>
      </div>
      <div class="field-group">
        <div class="label">City / Location</div>
        <div class="value">${payload.city}</div>
      </div>
      <div class="field-group">
        <div class="label">Education Qualification</div>
        <div class="value">${payload.education}</div>
      </div>
      <div class="field-group">
        <div class="label">Area of Interest</div>
        <div class="value">${payload.areaOfInterest}</div>
      </div>
      <div class="field-group">
        <div class="label">Preferred Department / Area</div>
        <div class="value">${payload.preferredArea}</div>
      </div>
      <div class="field-group">
        <div class="label">Message / Cover Note</div>
        <div class="value message-box">${payload.message ? payload.message : 'No additional message provided.'}</div>
      </div>
      <div class="field-group">
        <div class="label">Resume Attachment</div>
        <div class="value">
          <p style="margin: 4px 0 8px 0; font-size: 14px; color: #475569;">Path: ${payload.resumeUrl}</p>
        </div>
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
