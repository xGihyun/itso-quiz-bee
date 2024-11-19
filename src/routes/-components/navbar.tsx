import { Link } from "@tanstack/react-router";

export function Navbar(): JSX.Element {
  return (
    <nav className="fixed inset-0 h-16 bg-background border-b border-b-border w-full px-10 flex z-[999]">
      <Link href="/" className="h-full content-center">
        Home
      </Link>
    </nav>
  );
}
