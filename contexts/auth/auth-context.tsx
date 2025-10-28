"use client";

import { createContext } from "react";

import { User } from "@/types/user";

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
