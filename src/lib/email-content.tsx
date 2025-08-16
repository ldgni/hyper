import { Text } from "@react-email/components";
import React from "react";

import { APP_CONFIG } from "./constants";

export function getEarlyAccessRequestContent(name: string) {
  return (
    <>
      <Text className="m-0 text-base text-black">Hi {name},</Text>
      <Text className="mt-4 text-base text-gray-600">
        Thanks for your interest in {APP_CONFIG.name}. We&apos;ve received your
        early access request.
      </Text>
      <Text className="mt-4 text-base text-gray-600">
        We&apos;ll review it and get back to you soon.
      </Text>
    </>
  );
}

export function getEarlyAccessApprovalContent(name: string) {
  return (
    <>
      <Text className="m-0 text-base text-black">Hi {name},</Text>
      <Text className="mt-4 text-base text-gray-600">
        Your early access request has been approved. You can now sign in to{" "}
        {APP_CONFIG.name}.
      </Text>
    </>
  );
}

export function getEarlyAccessRevokedContent(name: string) {
  return (
    <>
      <Text className="m-0 text-base text-black">Hi {name},</Text>
      <Text className="mt-4 text-base text-gray-600">
        Your access to {APP_CONFIG.name} has been revoked.
      </Text>
    </>
  );
}

export function getLoginEmailContent() {
  return (
    <>
      <Text className="m-0 text-base text-black">
        Click the button below to sign in.
      </Text>
      <Text className="mt-4 text-sm text-gray-500">
        This link expires in 10 minutes.
      </Text>
    </>
  );
}
