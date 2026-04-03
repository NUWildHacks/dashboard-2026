import { useContext } from "react";

import { WildHacksGlobalSettingsContext } from "@/contexts/wildhacks-global-settings-context";

export const useWildhacksGlobalSettings = () => {
  const wildhacksGlobalSettings = useContext(WildHacksGlobalSettingsContext);

  if (!wildhacksGlobalSettings) {
    throw new Error("useWildhacksGlobalSettings must be used within a WildHacksGlobalSettingsProvider");
  }

  return wildhacksGlobalSettings;
};
