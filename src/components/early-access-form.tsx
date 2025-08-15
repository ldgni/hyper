"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/hooks";
import { API_ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { type EarlyAccess, earlyAccessSchema } from "@/lib/validations";

export function EarlyAccessForm() {
  const [formState, updateFormState] = useFormState();

  const form = useForm<EarlyAccess>({
    resolver: zodResolver(earlyAccessSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: EarlyAccess) {
    updateFormState({ type: "loading" });

    try {
      const response = await fetch(API_ROUTES.EARLY_ACCESS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request");
      }

      updateFormState({
        type: "success",
        message: "Your early access request has been submitted successfully!",
      });

      form.reset();
    } catch (error) {
      updateFormState({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {formState.type === "success" && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        {formState.type === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why are you interested in early access?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={formState.type === "loading"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={
              formState.type === "loading" || formState.type === "success"
            }>
            {formState.type === "loading" ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
