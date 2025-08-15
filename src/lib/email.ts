import { Resend } from "resend";

import type { EmailTemplateData } from "@/types";

import { APP_CONFIG } from "./constants";

const resend = new Resend(process.env.RESEND_API_KEY);

function createEmailTemplate({
  name,
  loginUrl,
}: Omit<EmailTemplateData, "email">): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Early Access Approved - ${APP_CONFIG.name}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 Welcome to ${APP_CONFIG.name}!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your early access request has been approved</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 22px;">Hi ${name}!</h2>
            
            <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px;">
              Great news! Your early access request for ${APP_CONFIG.name} has been approved. You now have access to our platform and can start managing your links.
            </p>
            
            <div style="background: #f7fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">What's next?</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 16px;">
                <li style="margin-bottom: 8px;">Click the button below to access your bookmarks</li>
                <li style="margin-bottom: 8px;">You'll receive a magic link in your email to sign in</li>
                <li style="margin-bottom: 8px;">Start saving and organizing your favorite links</li>
                <li>Keep all your important bookmarks in one place</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" style="display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                Sign In Now
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                If you have any questions, just reply to this email. We're here to help!
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f7fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              © ${new Date().getFullYear()} ${APP_CONFIG.name}. Built with ❤️ for better link management.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendEarlyAccessApprovalEmail(
  name: string,
  email: string,
): Promise<void> {
  try {
    const loginUrl = `${APP_CONFIG.url}/login`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: `🎉 Your ${APP_CONFIG.name} Early Access Request is Approved!`,
      html: createEmailTemplate({ name, loginUrl }),
    });
  } catch (error) {
    console.error("Failed to send early access approval email:", error);
    throw new Error("Failed to send email");
  }
}
