import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full sm:px-12 px-6 py-4 flex justify-between items-center bg-transparent text-sm">
      <p>Made with ♥︎ by the WildHacks team</p>
      <div className="space-x-6">
        <Link href="/wildhacks-home" className="hover:underline underline-offset-4">
          WildHacks Home
        </Link>
        <Link href="#" className="hover:underline underline-offset-4">
          Admin Dashboard
        </Link>
        <Link href="#" className="hover:underline underline-offset-4">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}
