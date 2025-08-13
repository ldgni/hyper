"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export function LoginForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitStatus({ type: null, message: "" });

      const result = await signIn("email", {
        email: values.email,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "AccessDenied") {
          setSubmitStatus({
            type: "error",
            message:
              "Access denied. You need an approved early access request to sign in.",
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: "Failed to send magic link. Please try again.",
          });
        }
      } else {
        setSubmitStatus({
          type: "success",
          message: "Check your email for a magic link to sign in.",
        });
        form.reset();
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={
            form.formState.isSubmitting || submitStatus.type === "success"
          }>
          {form.formState.isSubmitting
            ? "Sending magic link..."
            : "Send Magic Link"}
        </Button>
      </form>
    </Form>
  );
}
