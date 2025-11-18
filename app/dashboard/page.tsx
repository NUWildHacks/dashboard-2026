"use server";

import "@/config/firebase-admin";

export default async function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-background aspect-video rounded-xl border" />
        <div className="bg-background aspect-video rounded-xl border" />
        <div className="bg-background aspect-video rounded-xl border" />
      </div>
    </div>
  );
}
