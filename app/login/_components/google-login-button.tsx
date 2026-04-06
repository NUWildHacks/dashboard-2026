"use client";

import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, linkWithCredential, signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-client";
import { ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL } from "@/constants";
import { validateRedirectPath } from "@/lib";

import { createVerifiedSession, getCustomTokenForExistingAccount } from "../_actions";

const Google = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-google"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M15.545 6.558a9.4 9.4 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.7 7.7 0 015.352 2.082l-2.284 2.284A4.35 4.35 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 000 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 001.599-2.431H8v-3.08z" />
    </svg>
  );
};

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result) return;

      const idToken = await result.user.getIdToken(true);

      const sessionResult = await createVerifiedSession(idToken);
      if (!sessionResult.success) {
        toast.error("Registration is closed!", { description: "Check back in the future for WildHacks 2027." });
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = validateRedirectPath(searchParams.get("redirect"));

      router.replace(redirectTo);
    } catch (e) {
      let errorMessage = "An unknown error occurred";

      if (e instanceof FirebaseError) {
        if (e.code === ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL) {
          try {
            const email = e.customData?.email as string | undefined;
            if (!email) {
              throw new Error("Unable to retrieve email from authentication error");
            }

            const credential = GoogleAuthProvider.credentialFromError(e);
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
            const sessionResult = await createVerifiedSession(idToken);
            if (!sessionResult.success) {
              throw new Error(sessionResult.error || "Registration is closed.");
            }

            const searchParams = new URLSearchParams(window.location.search);
            const redirect = validateRedirectPath(searchParams.get("redirect"));

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
    <Button variant="outline" size="lg" onClick={handleGoogleLogin}>
      <Google />
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
