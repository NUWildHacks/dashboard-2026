import { useState } from "react";

export type UseClipboardReturn = {
  copied: boolean;
  handleCopy: () => Promise<void>;
};

const useClipboard = (text: string): UseClipboardReturn => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copied, handleCopy };
};

export default useClipboard;
