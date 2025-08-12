"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export function EarlyAccessForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitStatus({ type: null, message: "" });

      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmitStatus({
        type: "success",
        message: "Your early access request has been submitted.",
      });

      form.reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {submitStatus.type === "success" && (
          <Alert>
            <CheckCircle2 />
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}

        {submitStatus.type === "error" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{submitStatus.message}</AlertDescription>
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
                  placeholder="Why are you interested?"
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
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={
              form.formState.isSubmitting || submitStatus.type === "success"
            }>
            {form.formState.isSubmitting ? "Submitting..." : "Request"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
