"use server";

import Link from "next/link";

import { WILDHACKS_HOME } from "@/constants/routes";

const Footer = async () => {
  return (
    <footer className="w-full px-6 sm:px-12 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-x-4 flex-wrap font-medium text-sm text-nowrap text-muted-foreground">
      <p>Made with ♥︎ by the WildHacks team</p>
      <div className="flex justify-center items-center gap-x-2 flex-wrap">
        <Link href={WILDHACKS_HOME} className="hover:underline underline-offset-4">
          WildHacks Home
        </Link>
        {"•"}
        <Link href="#" className="hover:underline underline-offset-4">
          Admin Dashboard
        </Link>
        {"•"}
        <Link href="#" className="hover:underline underline-offset-4">
          Contact Us
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
