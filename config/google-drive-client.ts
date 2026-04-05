import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
  // 'drive.file' scope only allows access to files created by this app —
  // much safer than full 'drive' scope
});

const googleDriveClient = google.drive({ version: "v3", auth });

export default googleDriveClient;
