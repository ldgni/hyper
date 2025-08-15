"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required").url("Invalid URL"),
});

interface LinkFormProps {
  userId: string;
  initialData?: {
    id: string;
    title: string;
    url: string;
  };
  onSuccess: (link: {
    id: string;
    userId: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }) => void;
  onCancel: () => void;
}

export function LinkForm({
  userId,
  initialData,
  onSuccess,
  onCancel,
}: LinkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      url: initialData?.url || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/links/${initialData.id}` : "/api/links";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || `Failed to ${isEditing ? "update" : "create"} link`,
        );
      }

      const link = await response.json();
      onSuccess(link);
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} link:`,
        error,
      );
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Example" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer">
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update"
                : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
