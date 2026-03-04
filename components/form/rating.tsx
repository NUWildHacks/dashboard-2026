"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";
import { FieldValues, UseControllerReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib";

type RatingProps<T extends FieldValues = FieldValues> = {
  label: string;
  fieldName: string;
} & Pick<UseControllerReturn<T>, "field" | "fieldState">;

const Rating = <T extends FieldValues>({ label, fieldName, field, fieldState }: RatingProps<T>) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSelectRating = (rating: number) => {
    setRating(rating);
    field.onChange(rating);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={`${fieldName}-rating`} className="after:content-['*'] after:ml-0.5 after:text-red-500">
        {label}
      </FieldLabel>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((star) => (
          <button
            className="transition-transform hover:scale-110"
            key={star}
            onClick={() => handleSelectRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            type="button"
          >
            <StarIcon
              className={cn(
                "h-8 w-8 transition-colors",
                (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
    </Field>
  );
};

export default Rating;
