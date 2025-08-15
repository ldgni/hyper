import { Resend } from "resend";

import { renderEmailTemplate } from "@/components/email-template";

import { APP_CONFIG } from "./constants";
import {
  getEarlyAccessApprovalContent,
  getEarlyAccessRequestContent,
  getEarlyAccessRevokedContent,
  getLoginEmailContent,
} from "./email-content";

const resend = new Resend(process.env.RESEND_API_KEY);

// Early Access Request Submitted Email
export async function sendEarlyAccessRequestEmail(
  name: string,
  email: string,
): Promise<void> {
  try {
    const html = await renderEmailTemplate({
      previewText: `Early access request received`,
      heading: `Request received`,
      content: getEarlyAccessRequestContent(name),
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: `Early access request received`,
      html,
    });
  } catch (error) {
    console.error("Failed to send early access request email:", error);
    throw new Error("Failed to send email");
  }
}

// Early Access Approved Email
export async function sendEarlyAccessApprovalEmail(
  name: string,
  email: string,
): Promise<void> {
  try {
    const loginUrl = `${APP_CONFIG.url}/login`;

    const html = await renderEmailTemplate({
      previewText: `Your early access has been approved`,
      heading: `Access approved`,
      content: getEarlyAccessApprovalContent(name),
      ctaButton: {
        text: "Sign in",
        url: loginUrl,
      },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: `Your early access has been approved`,
      html,
    });
  } catch (error) {
    console.error("Failed to send early access approval email:", error);
    throw new Error("Failed to send email");
  }
}

// Early Access Revoked Email
export async function sendEarlyAccessRevokedEmail(
  name: string,
  email: string,
): Promise<void> {
  try {
    const html = await renderEmailTemplate({
      previewText: `Your access has been revoked`,
      heading: `Access revoked`,
      content: getEarlyAccessRevokedContent(name),
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: `Your early access has been revoked`,
      html,
    });
  } catch (error) {
    console.error("Failed to send early access revoked email:", error);
    throw new Error("Failed to send email");
  }
}

// Login Magic Link Email
export async function sendLoginEmail(
  email: string,
  url: string,
): Promise<void> {
  try {
    const html = await renderEmailTemplate({
      previewText: `Sign in to ${APP_CONFIG.name}`,
      heading: `Sign in`,
      content: getLoginEmailContent(),
      ctaButton: {
        text: "Sign in",
        url,
      },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: email,
      subject: `Sign in to ${APP_CONFIG.name}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send login email:", error);
    throw new Error("Failed to send email");
  }
}
