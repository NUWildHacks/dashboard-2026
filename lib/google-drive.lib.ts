import { Readable } from "stream";

import googleDriveClient from "@/config/google-drive-client";

/** Find a file by exact name within the target folder */
const findExistingFile = async (filename: string): Promise<string | null> => {
  const response = await googleDriveClient.files.list({
    q: `name = '${filename}' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  const files = response.data.files;
  return files && files.length > 0 ? files[0].id! : null;
};

/** Delete a file by ID */
const deleteFile = async (fileId: string): Promise<void> => {
  await googleDriveClient.files.delete({ fileId });
};

/** Upload a new file to the target folder */
const createFile = async (buffer: Buffer, filename: string): Promise<void> => {
  const response = await googleDriveClient.files.create({
    requestBody: {
      name: filename,
      mimeType: "application/pdf",
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: "application/pdf",
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
  });
};

/** Main export: delete existing resume if found, then upload the new one */
const uploadUserResume = async (buffer: Buffer, username: string): Promise<void> => {
  const filename = `${username}-Resume.pdf`;

  const existingFileId = await findExistingFile(filename);

  if (existingFileId) {
    await deleteFile(existingFileId);
  }

  await createFile(buffer, filename);
};

export { uploadUserResume };
