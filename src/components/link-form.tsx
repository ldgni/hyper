"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Spinner } from "@/components/ui/spinner";
import { useFormState } from "@/hooks";
import { API_ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { type Link, linkSchema } from "@/lib/validations";
import type { DbLink } from "@/types";

interface LinkFormProps {
  userId: string;
  initialData?: {
    id: string;
    title: string;
    url: string;
  };
  onSuccess: (link: DbLink) => void;
  onCancel: () => void;
}

export function LinkForm({
  userId,
  initialData,
  onSuccess,
  onCancel,
}: LinkFormProps) {
  const [formState, updateFormState] = useFormState();
  const isEditing = !!initialData;

  const form = useForm<Link>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: initialData?.title || "",
      url: initialData?.url || "",
    },
  });

  async function onSubmit(values: Link) {
    updateFormState({ type: "loading" });

    try {
      const url = isEditing
        ? `${API_ROUTES.LINKS}/${initialData.id}`
        : API_ROUTES.LINKS;
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
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditing ? "update" : "create"} link`,
        );
      }

      const result = await response.json();
      const linkData = result.data || result; // Handle both new and legacy response formats

      updateFormState({
        type: "success",
        message: `Link ${isEditing ? "updated" : "created"} successfully`,
      });

      onSuccess(linkData);

      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      updateFormState({
        type: "error",
        message: getErrorMessage(error),
      });
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

        {formState.type === "error" && (
          <div className="text-destructive text-sm">{formState.message}</div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={formState.type === "loading"}
            className="cursor-pointer">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formState.type === "loading"}
            className="cursor-pointer">
            {formState.type === "loading" ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>{isEditing ? "Updating..." : "Saving..."}</span>
              </div>
            ) : isEditing ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
