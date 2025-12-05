import * as React from "react";

import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  type?: string;
}

function Input({ className, type, value, onChange, ...props }: InputProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        // For number inputs, allow empty values and handle them properly
        const inputValue = e.target.value;

        // Allow empty string or valid numbers
        if (inputValue === "" || !isNaN(Number(inputValue))) {
          if (onChange) {
            // Create a new event with the same properties but proper value handling
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                value: inputValue,
              },
            };
            onChange(syntheticEvent);
          }
        }
      } else {
        // For non-number inputs, use default behavior
        if (onChange) {
          onChange(e);
        }
      }
    },
    [type, onChange]
  );

  return (
    <input
      type={type}
      data-slot="input"
      value={value}
      onChange={handleChange}
      className={cn(
        // Layout & sizing to match softer marketing form fields
        "flex w-full min-w-0 h-11 rounded-lg border px-4 py-2.5 text-sm md:text-sm",
        // Light, subtle background (#f7f7f7) + border (#e5e5e5)
        "bg-[#f7f7f7] border-[#e5e5e5] dark:bg-input/30 dark:border-input",
        // Placeholder / selection colors
        "placeholder:text-muted-foreground file:text-foreground selection:bg-primary/10 selection:text-primary-foreground",
        // Focus & validation states
        "outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        // File input alignment
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };
