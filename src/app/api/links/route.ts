import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createErrorResponse("Authentication required", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const body = await request.json();
    const validatedData = linkSchema.parse(body);

    // Create the link
    const link = await prisma.link.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return createSuccessResponse(link, "Link created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
