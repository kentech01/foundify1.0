import React from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-xl border-2 shadow-lg",
          title: "font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
}
