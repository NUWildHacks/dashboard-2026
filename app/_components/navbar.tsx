"use server";

import Image from "next/image";

// moved "Continue to Dashboard" button as the main CTA for closed
// for ongoing, this needs to be added back
// for completed, this shouldn't matter

const Navbar = async () => {
  return (
    <nav className="w-full h-[72px] px-6 sm:px-12 flex justify-between items-center">
      <div className="flex justify-between w-full items-center gap-2">
        <Image src="/wildhacks.svg" alt="Navigation Logo" width={39} height={50.74} />
      </div>
    </nav>
  );
};

export default Navbar;
