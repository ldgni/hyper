"use client";

import { useCallback, useState } from "react";

import { UI_CONFIG } from "@/lib/constants";
import { copyToClipboard as copyText } from "@/lib/utils";
import type { FormState } from "@/types";

// Generic form state hook
export function useFormState<T = unknown>(): [
  FormState<T>,
  (state: Partial<FormState<T>>) => void,
  () => void,
] {
  const [formState, setFormState] = useState<FormState<T>>({
    type: "idle",
  });

  const updateFormState = useCallback((state: Partial<FormState<T>>) => {
    setFormState((prev) => ({ ...prev, ...state }));
  }, []);

  const resetFormState = useCallback(() => {
    setFormState({ type: "idle" });
  }, []);

  return [formState, updateFormState, resetFormState];
}

// Copy to clipboard hook with feedback
export function useCopyToClipboard() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    const success = await copyText(text);

    if (success) {
      setCopiedItems((prev) => new Set([...prev, id]));

      // Reset after timeout
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, UI_CONFIG.COPY_FEEDBACK_DURATION);
    }

    return success;
  }, []);

  return { copyToClipboard, copiedItems };
}

// Generic loading state hook
export function useLoadingState() {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const setLoading = useCallback((id: string, loading: boolean) => {
    setLoadingItems((prev) => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const isLoading = useCallback(
    (id: string) => {
      return loadingItems.has(id);
    },
    [loadingItems],
  );

  return { setLoading, isLoading, loadingItems };
}
