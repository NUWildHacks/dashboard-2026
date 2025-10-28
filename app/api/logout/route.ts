import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({ message: "Successfully logged out" });

  response.cookies.delete({
    name: "session",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
};
