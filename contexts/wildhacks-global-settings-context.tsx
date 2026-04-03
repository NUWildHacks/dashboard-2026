"use client";

import { createContext } from "react";

import { WildHacksConfig } from "@/types";

export const WildHacksGlobalSettingsContext = createContext<WildHacksConfig | undefined>(undefined);
