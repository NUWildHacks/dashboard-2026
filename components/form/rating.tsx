"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { FieldValues, UseControllerReturn } from "react-hook-form";

import { cn } from "@/lib";

type RatingProps<T extends FieldValues = FieldValues> = {
  fieldName: string;
  field: UseControllerReturn<T>["field"];
};

const Rating = <T extends FieldValues>({ fieldName, field }: RatingProps<T>) => {
  const [hoverRating, setHoverRating] = useState(0);
  const rating = field.value || 0;

  return (
    <div id={`${fieldName}-rating`} className="flex gap-1">
      {[1, 2, 3, 4].map((star) => (
        <button
          className="transition-transform hover:scale-110"
          key={star}
          onClick={() => field.onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          type="button"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default Rating;
