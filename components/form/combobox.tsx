"use client";

import { ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { FieldValues, UseControllerReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils.lib";

type ComboboxProps<T extends FieldValues = FieldValues> = {
  options: string[];
  placeholder: string;
  emptyText: string;
  searchPlaceholder: string;
  minSearchLength: number;
  maxResults: number;
} & Pick<UseControllerReturn<T>, "field" | "fieldState">;

const Combobox = <T extends FieldValues>({
  options,
  placeholder,
  field,
  fieldState,
  emptyText,
  searchPlaceholder,
  minSearchLength,
  maxResults,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    if (searchLower.length < minSearchLength) {
      return options.slice(0, maxResults);
    }

    return options.filter((option) => option.toLowerCase().includes(searchLower)).slice(0, maxResults);
  }, [options, search, minSearchLength, maxResults]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={field.name} aria-invalid={fieldState.invalid} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background hover:bg-background",
            field.value ? "text-foreground hover:text-foreground" : "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          {field.value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} className="h-9" />
          <CommandList>
            {minSearchLength > 0 && search.length < minSearchLength ? (
              <CommandEmpty>Type {minSearchLength} or more characters to search</CommandEmpty>
            ) : filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      field.onChange(option);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
