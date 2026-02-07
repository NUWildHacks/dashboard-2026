"use client";

import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase-client";
import { DASHBOARD_PATH } from "@/constants";
import { createSession } from "@/lib";

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
    <Button variant="outline" size="lg" onClick={handleGoogleLogin}>
      <Google />
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
