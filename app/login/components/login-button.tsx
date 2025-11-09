"use client";

import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";

import { createSession } from "@/app/_lib/session";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-client";
import { DASHBOARD_PATH } from "@/constants/routes";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope("user:email");

    const result = await signInWithPopup(auth, githubProvider);
    if (!result) return;

    const idToken = await result.user.getIdToken(true);
    await createSession(idToken);

    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || DASHBOARD_PATH;

    router.replace(redirect);
  };

  return (
    <Button variant="outline" size="lg" onClick={handleLogin}>
      <Github />
      Login with Github
    </Button>
  );
}
