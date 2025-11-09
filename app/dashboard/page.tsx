"use server";

import Navbar from "@/components/navbar/navbar";

import LogoutButton from "./components/logout-button";

export default async function Dashboard() {
  return (
    <>
      <Navbar>
        <LogoutButton />
      </Navbar>
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px]">Dashboard Page</div>
      </main>
    </>
  );
}
