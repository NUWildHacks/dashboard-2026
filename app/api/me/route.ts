import { NextRequest, NextResponse } from "next/server";

import firebaseAdmin from "@/config/firebase-admin";

export const GET = async (req: NextRequest) => {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        {
          user: null,
          message: "User not logged in",
        },
        {
          status: 200,
        }
      );
    }

    const claims = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json(
      {
        user: {
          id: claims.uid,
          email: claims.email,
        },
        message: "Successfully retrieved user",
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      {
        user: null,
        message: "Failed to retrieve user",
      },
      {
        status: 401,
      }
    );
  }
};
