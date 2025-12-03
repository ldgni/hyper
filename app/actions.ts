"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { deleteBookmark } from "@/db/queries/delete";
import { insertBookmark } from "@/db/queries/insert";
import { getBookmarkById } from "@/db/queries/select";
import { updateBookmark } from "@/db/queries/update";
import { auth } from "@/lib/auth";

export async function createBookmarkAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!name || !url) {
    return { error: "Name and URL are required" };
  }

  try {
    await insertBookmark({
      id: crypto.randomUUID(),
      name,
      url,
      userId: session.user.id,
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to create bookmark" };
  }
}

export async function updateBookmarkAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!id || !name || !url) {
    return { error: "ID, Name, and URL are required" };
  }

  // Check if the user owns this bookmark
  const bookmark = await getBookmarkById(id);
  if (!bookmark || bookmark.userId !== session.user.id) {
    return { error: "Bookmark not found" };
  }

  try {
    await updateBookmark(id, {
      name,
      url,
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to update bookmark" };
  }
}

export async function deleteBookmarkAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;

  if (!id) {
    return { error: "ID is required" };
  }

  // Check if the user owns this bookmark
  const bookmark = await getBookmarkById(id);
  if (!bookmark || bookmark.userId !== session.user.id) {
    return { error: "Bookmark not found" };
  }

  try {
    await deleteBookmark(id);

    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete bookmark" };
  }
}
