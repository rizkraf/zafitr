"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { FormControl } from "./form";
import {
  type UseFormReturn,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

interface ComboboxProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  field: ControllerRenderProps<TFieldValues>;
  name: Path<TFieldValues>;
  options: { label: string; value: string }[];
  selectPlaceHolder?: string;
}

export function Combobox<TFieldValues extends FieldValues>({
  form,
  field,
  name,
  options,
  selectPlaceHolder = "Select...",
}: ComboboxProps<TFieldValues>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value ? "text-muted-foreground" : "",
            )}
          >
            {field.value
              ? options.find((option) => option.value === field.value)?.label
              : selectPlaceHolder}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    form.setValue(
                      name,
                      option.value as PathValue<
                        TFieldValues,
                        Path<TFieldValues>
                      >,
                    );
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === field.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
