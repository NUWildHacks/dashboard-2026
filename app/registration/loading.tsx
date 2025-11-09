import { Loader2 } from "lucide-react";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";

export default function LoadingRegistration() {
  return (
    <>
      <Navbar />
      <main
        className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12"
        role="status"
        aria-live="polite"
        aria-label="Loading registration form"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Please wait while we load your registration form</span>
      </main>
      <Footer />
    </>
  );
}
