"use client";

import { Loader2, X } from "lucide-react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldError, Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useCreateAnnouncementDialog } from "../_hooks/use-create-announcement-dialog";
import { ANNOUNCEMENT_CATEGORIES } from "../constants";

const CreateAnnouncementDialog = () => {
  const { control, handleSubmit, isSubmitting, onSubmit, isOpen, setIsOpen, fields, append, remove } =
    useCreateAnnouncementDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Create announcement</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create announcement</DialogTitle>
          <DialogDescription>Please enter your announcement details to continue.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="create-announcement-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Enter announcement title"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="body"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Body
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Enter announcement body"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="max-h-40"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Category
                      </FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} tabIndex={0}>
                          <SelectValue placeholder="Select announcement category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ANNOUNCEMENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldSet disabled={isSubmitting}>
                <Field>
                  <FieldLabel>Links</FieldLabel>
                  <FieldGroup className="gap-3">
                    {fields.map((field, index) => (
                      <Controller
                        key={field.id}
                        name={`links.${index}.url`}
                        control={control}
                        render={({ field: linkField, fieldState }) => (
                          <div className="w-full flex-1 flex flex-col items-start">
                            <div className="w-full flex items-center gap-2">
                              <Input
                                {...linkField}
                                id={`links.${index}.url`}
                                placeholder="Enter announcement link"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={isSubmitting}
                                aria-label="Remove link"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} className="w-full text-start" />
                            )}
                          </div>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ url: "" })}
                      disabled={isSubmitting || fields.length >= 4}
                      aria-label="Add link"
                    >
                      Add Link {fields.length >= 4 && "(Limit reached)"}
                    </Button>
                  </FieldGroup>
                </Field>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Go back
            </Button>
          </DialogClose>
          <Button type="submit" form="create-announcement-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Create announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementDialog;
