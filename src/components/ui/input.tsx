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
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
