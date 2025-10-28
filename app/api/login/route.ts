import { NextRequest, NextResponse } from "next/server";

import firebaseAdmin from "@/config/firebase-admin";

export const POST = async (req: NextRequest) => {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json(
      {
        message: "Missing ID token",
      },
      {
        status: 400,
      }
    );
  }

  const adminAuth = firebaseAdmin.auth();

  try {
    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ message: "Successfully logged in" });

    response.cookies.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create session cookie",
      },
      { status: 500 }
    );
  }
};
