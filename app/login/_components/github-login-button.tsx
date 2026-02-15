"use client";

import { FirebaseError } from "firebase/app";
import { GithubAuthProvider, linkWithCredential, signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-client";
import { ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL, DASHBOARD_PATH } from "@/constants";
import { createSession } from "@/lib";

import { getCustomTokenForExistingAccount } from "../_actions/link-account.actions";

const GithubLoginButton = () => {
  const router = useRouter();

  const handleGithubLogin = async () => {
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
      let errorMessage = "An unknown error occurred";

      if (e instanceof FirebaseError) {
        if (e.code === ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL) {
          try {
            const email = e.customData?.email as string | undefined;
            if (!email) {
              throw new Error("Unable to retrieve email from authentication error");
            }

            const credential = GithubAuthProvider.credentialFromError(e);
            if (!credential) {
              throw new Error("Unable to retrieve credential from authentication error");
            }

            const linkResult = await getCustomTokenForExistingAccount(email);
            if (!linkResult.success) {
              throw new Error(linkResult.error || "Failed to link account");
            }

            if (!linkResult.customToken) {
              throw new Error("Failed to get authentication token for existing account");
            }

            const customTokenResult = await signInWithCustomToken(auth, linkResult.customToken);

            await linkWithCredential(customTokenResult.user, credential);

            const idToken = await customTokenResult.user.getIdToken(true);
            await createSession(idToken);

            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get("redirect") || DASHBOARD_PATH;

            router.replace(redirect);
          } catch (linkError) {
            errorMessage = linkError instanceof Error ? linkError.message : "Failed to link account. Please try again.";
          }
        } else {
          errorMessage = e.message;
        }
      }

      toast.error("Login failed", { description: errorMessage });
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={handleGithubLogin}>
      <Github />
      Login with Github
    </Button>
  );
};

export default GithubLoginButton;
