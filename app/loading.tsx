import { Loader2 } from "lucide-react";

const HomeLoading = async () => {
  return (
    <div
      className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
    </div>
  );
};

export default HomeLoading;
