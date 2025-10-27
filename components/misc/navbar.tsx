import { CodeXml, Github } from "lucide-react";

import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="w-full sm:px-12 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <CodeXml className="size-8" />
        <h1 className="text-2xl sm:block hidden">WildHacks Dashboard</h1>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="lg">
          <Github />
          Login with Github
        </Button>
      </div>
    </nav>
  );
}
