import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEarlyAccessApprovalEmail(
  name: string,
  email: string,
) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: "Your Early Access Request has been Approved!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Early Access Approved</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Hyper!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your early access request has been approved</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
              <h2 style="color: #333; margin-top: 0;">Hi ${name}!</h2>
              <p style="color: #666; line-height: 1.6;">
                Great news! Your early access request for Hyper has been approved. You now have access to our platform and can start managing your links.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What's next?</h3>
                <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Visit our login page to access your dashboard</li>
                  <li>You'll receive a magic link in your email to sign in</li>
                  <li>Start saving and organizing your favorite links</li>
                  <li>Keep all your important bookmarks in one place</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login" style="display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Sign In Now
                </a>
              </div>
              
              <p style="color: #888; font-size: 14px; margin-top: 30px;">
                If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Hyper. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`Approval email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending approval email:", error);
    return { success: false, error };
  }
}
