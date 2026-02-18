"use client";

import { FirebaseError } from "firebase/app";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-client";
import { DASHBOARD_PATH } from "@/constants";
import { createSession } from "@/lib";

const LoginButton = () => {
  const router = useRouter();

  const handleLogin = async () => {
    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope("user:email");

    try {
      const result = await signInWithPopup(auth, githubProvider);
      if (!result) return;

      const idToken = await result.user.getIdToken(true);

      await createSession(idToken);

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") || DASHBOARD_PATH;

      router.replace(redirect);
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      toast.error("Login failed", { description: errorMessage });
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={handleLogin}>
      <Github />
      Login with Github
    </Button>
  );
};

export default LoginButton;
