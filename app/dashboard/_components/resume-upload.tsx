"use client";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Download, File, FileX, Loader2, Trash, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib";

import { deleteResume } from "../_actions/delete-resume";
import { uploadResume } from "../_actions/upload-resume";

type ResumeUploadProps = {
  fileName?: string;
};

const ResumeUpload = ({ fileName }: ResumeUploadProps) => {
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
      const result = await uploadResume(file);
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

  const handleDeleteResume = async () => {
    if (!fileName) return;

    const result = await deleteResume();
    const { success } = result;

    if (!success) {
      const { error } = result;
      throw new Error(error);
    }

    toast.success("Resume deleted successfully");
  };

  const handleDownloadResume = async () => {
    if (!fileName) return;

    const storage = getStorage();
    const fileRef = ref(storage, fileName);

    const url = await getDownloadURL(fileRef);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return (
    <Card className="shadow-xs size-full">
      <CardHeader>
        <CardTitle>Resume Upload</CardTitle>
        <CardDescription>Upload your resume for our event sponsors to take a look at!</CardDescription>
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
        <Item variant="outline" className="w-full">
          <ItemMedia variant="icon">{fileName ? <File /> : <FileX />}</ItemMedia>
          <ItemContent>
            <ItemTitle className={cn("text-sm text-muted-foreground", { "italic": !fileName })}>
              {fileName ? fileName : "You currently have no resume uploaded."}
            </ItemTitle>
          </ItemContent>
          {fileName && (
            <ItemActions>
              <Button size="icon" variant="outline" onClick={handleDownloadResume}>
                <Download aria-hidden="true" />
              </Button>
              <Button size="icon" variant="destructive" onClick={handleDeleteResume}>
                <Trash aria-hidden="true" />
              </Button>
            </ItemActions>
          )}
        </Item>
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

export default ResumeUpload;
