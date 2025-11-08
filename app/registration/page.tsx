"use server";

import Navbar from "@/components/navbar/navbar";

import RegistrationForm from "./components/registration-form";

export default async function Registration() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px]">
          <div className="text-center space-y-5">
            <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
            <p>
              Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
              started. This should only take a few minutes!
            </p>
            <RegistrationForm />
          </div>
        </div>
      </main>
    </>
  );
}
