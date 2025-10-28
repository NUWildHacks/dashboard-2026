import { FirebaseError } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

import firebaseClient from "@/config/firebase-client";

export const me = async () => {
  try {
    const result = await fetch("/api/me");
    const data = await result.json();

    return data.user;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);
  }
};

export const login = async () => {
  try {
    const auth = getAuth(firebaseClient);

    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope("user:email");

    const result = await signInWithPopup(auth, githubProvider);

    if (result) {
      const idToken = await result.user.getIdToken(true);

      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    }
  } catch (e) {
    const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);
  }
};
