import { NextRequest } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { earlyAccessSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = earlyAccessSchema.parse(body);

    // Check if email already exists
    const existingRequest = await prisma.earlyAccessRequest.findUnique({
      where: { email: validatedData.email },
    });

    if (existingRequest) {
      return createErrorResponse(
        "Your email is already submitted for early access",
        409,
      );
    }

    // Create the early access request
    const earlyAccessRequest = await prisma.earlyAccessRequest.create({
      data: validatedData,
    });

    return createSuccessResponse(
      { id: earlyAccessRequest.id },
      "Early access request submitted successfully",
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
