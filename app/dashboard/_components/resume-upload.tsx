"use client";

import { Download, File, FileX, Loader2, Trash, Upload } from "lucide-react";

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
