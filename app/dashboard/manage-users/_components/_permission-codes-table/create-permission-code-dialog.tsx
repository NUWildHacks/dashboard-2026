"use client";

import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PERMISSION_CODE_TYPE_MAP, PERMISSION_CODE_TYPES } from "../../_constants";
import { useCreatePermissionCodeDialog } from "../../_hooks";

const CreatePermissionCodeDialog = () => {
  const { control, handleSubmit, isSubmitting, onSubmit, isOpen, setIsOpen } = useCreatePermissionCodeDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Create permission code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create permission code</DialogTitle>
          <DialogDescription>Please enter the email and type to create a new permission code.</DialogDescription>
        </DialogHeader>
        <form id="create-permission-code-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FieldSet disabled={isSubmitting}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="Enter email address"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />
            </FieldSet>
            <FieldSet disabled={isSubmitting}>
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Type
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} tabIndex={0}>
                        <SelectValue placeholder="Select permission code type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERMISSION_CODE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {PERMISSION_CODE_TYPE_MAP[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-full text-start" />}
                  </Field>
                )}
              />
            </FieldSet>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="create-permission-code-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Create permission code"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePermissionCodeDialog;
