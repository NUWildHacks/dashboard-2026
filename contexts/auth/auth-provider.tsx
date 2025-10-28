"use client";

import { Loader2 } from "lucide-react";
import { useState, useEffect, PropsWithChildren } from "react";

import { login, logout, me } from "@/actions/auth";
import { User } from "@/types/user";

import { AuthContext, AuthContextType } from "./auth-context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getMe = async () => {
    const user = await me();
    setUser(user);
  };

  useEffect(() => {
    const init = async () => {
      await getMe();
      setIsLoading(false);
    };

    init();
  }, []);

  const handleLogin = async () => {
    await login();
    await getMe();
  };

  const handleLogout = async () => {
    await logout();
    await getMe();
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
