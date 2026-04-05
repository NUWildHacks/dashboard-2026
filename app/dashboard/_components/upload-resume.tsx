"use client";

import { Loader2, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

import { uploadResumeAction } from "../_actions/upload-resume";

type UploadResumeProps = Pick<User, "id" | "first_name" | "last_name">;

const UploadResume = ({ id, first_name, last_name }: UploadResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadResumeAction(first_name, last_name, file);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      toast.success("Resume uploaded successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to upload resume", { description: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="shadow-xs size-full">
      <CardHeader>
        <CardTitle>Resume Upload</CardTitle>
        <CardDescription>Upload your resume for our event sponsors to see!</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-start items-center gap-4">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleUploadResume}
        />
        <p className="text-sm text-muted-foreground italic">You currently have no resume uploaded.</p>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <Button onClick={handleOpenFileInput}>
          {isUploading ? <Loader2 className="animate-spin" /> : <Upload aria-hidden="true" />}
          Upload Resume
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadResume;
