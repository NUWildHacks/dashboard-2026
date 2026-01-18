"use server";

import Image from "next/image";

const Navbar = async () => {
  return (
    <nav className="w-full h-[72px] px-6 sm:px-12 flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <Image src="/wildhacks.svg" alt="Navigation Logo" width={39} height={50.74} />
        <h1 className="text-2xl sm:block hidden text-nowrap sr-only">WildHacks Dashboard</h1>
      </div>
    </nav>
  );
};

export default Navbar;
