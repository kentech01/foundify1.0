"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface ComboboxProps {
  options: string[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>();

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setTriggerWidth(width);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-[#f7f7f7] hover:bg-[#f7f7f7] border-[#e5e5e5]",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option === value)
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 bg-white border-2 border-gray-200 rounded-[12px] shadow-lg" 
        align="start"
        sideOffset={4}
        style={{ width: triggerWidth ? `${triggerWidth}px` : '100%' }}
      >
        <Command className="bg-white rounded-[12px]">
          <CommandInput 
            placeholder="Search..." 
            className="bg-white border-0 focus:ring-0" 
          />
          <CommandList className="bg-white max-h-[300px]">
            <CommandEmpty className="bg-white">No results found.</CommandEmpty>
            <CommandGroup className="bg-white p-0">
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  className="bg-white hover:bg-gray-50 data-[selected=true]:bg-gray-50 cursor-pointer"
                  onSelect={(currentValue) => {
                    // Command normalizes values to lowercase, so we need to find the original option
                    const selectedOption = options.find(
                      (opt) => opt.toLowerCase() === currentValue.toLowerCase()
                    );
                    if (selectedOption) {
                      onValueChange(selectedOption === value ? "" : selectedOption);
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
