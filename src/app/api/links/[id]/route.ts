import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, url } = body;

    // Validate input
    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 },
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the link and verify ownership
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own links" },
        { status: 403 },
      );
    }

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the link and verify ownership
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own links" },
        { status: 403 },
      );
    }

    // Delete the link
    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Link deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
