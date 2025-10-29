"use client";

import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { Github } from "lucide-react";

import { createSession } from "@/app/_lib/session";
import firebaseClient from "@/config/firebase-client";

import { Button } from "../ui/button";

export default function LoginButton() {
  const handleLogin = async () => {
    const auth = getAuth(firebaseClient);

    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope("user:email");

    const result = await signInWithPopup(auth, githubProvider);
    if (!result) return;

    const idToken = await result.user.getIdToken(true);
    await createSession(idToken);
  };

  return (
    <Button variant="outline" size="lg" onClick={handleLogin}>
      <Github />
      Login with Github
    </Button>
  );
}
