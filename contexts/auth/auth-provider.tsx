"use client";

import { Loader2 } from "lucide-react";
import { useState, useEffect, PropsWithChildren } from "react";

import { User } from "@/types/user";

import { AuthContext, AuthContextType } from "./auth-context";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithPopup } from "firebase/auth";
import firebaseClient from "@/config/firebase-client";
import { GithubAuthProvider } from "firebase/auth/web-extension";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getMe = async () => {
    try {
      const result = await fetch("/api/me");
      const data = await result.json();
      setUser(data.user);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getMe();
      setIsLoading(false);
    };

    init();
  }, []);

  const handleLogin = async () => {
    try {
      const auth = getAuth(firebaseClient);

      const githubProvider = new GithubAuthProvider();
      githubProvider.addScope("user:email");

      const result = await signInWithPopup(auth, githubProvider);

      if (!result) return;

      const idToken = await result.user.getIdToken(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        await getMe();
      }
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        await getMe();
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    handleLogin,
    handleLogout,
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <Loader2 className="size-8 animate-spin" />
      </main>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
