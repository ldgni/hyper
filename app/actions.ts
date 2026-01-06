"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { deleteBookmark } from "@/db/queries/delete";
import { insertBookmark } from "@/db/queries/insert";
import { getBookmarkById } from "@/db/queries/select";
import { updateBookmark } from "@/db/queries/update";
import { auth } from "@/lib/auth";

const createBookmarkSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  url: z.string().url("Invalid URL format"),
});

const updateBookmarkSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  url: z.string().url("Invalid URL format"),
});

const deleteBookmarkSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export async function createBookmarkAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const parsed = createBookmarkSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, url } = parsed.data;

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

  const parsed = updateBookmarkSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    url: formData.get("url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, name, url } = parsed.data;

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

  const parsed = deleteBookmarkSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id } = parsed.data;

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
