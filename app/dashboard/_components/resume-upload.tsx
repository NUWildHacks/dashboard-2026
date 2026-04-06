"use client";

import { Download, File, FileX, Loader2, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib";

import { useResumeUpload } from "../_hooks";

type ResumeUploadProps = {
  fileName?: string;
};

const ResumeUpload = ({ fileName }: ResumeUploadProps) => {
  const {
    fileInputRef,
    isUploading,
    isDeleting,
    handleOpenFileInput,
    handleUploadResume,
    handleDeleteResume,
    handleDownloadResume,
  } = useResumeUpload(fileName);

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
            <ItemTitle className={cn("text-sm text-muted-foreground", { italic: !fileName })}>
              {fileName ? fileName : "You currently have no resume uploaded."}
            </ItemTitle>
          </ItemContent>
          {fileName && (
            <ItemActions>
              <Button size="icon" variant="outline" onClick={handleDownloadResume} disabled={isUploading || isDeleting}>
                <Download aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={handleDeleteResume}
                disabled={isUploading || isDeleting}
              >
                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash aria-hidden="true" />}
              </Button>
            </ItemActions>
          )}
        </Item>
      </CardContent>
      <CardFooter className="justify-end items-center gap-4">
        {fileName && (
          <p className="text-right text-sm text-muted-foreground italic">
            Note: Uploading a new resume will replace your current resume.
          </p>
        )}
        <Button onClick={handleOpenFileInput} disabled={isUploading || isDeleting}>
          {isUploading ? <Loader2 className="animate-spin" /> : "Upload Resume"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeUpload;
