import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { Link } from "@tanstack/react-router";
import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import itsoUmakLogo from "../-images/itso-umak-logo.webp";

export function Navbar(): JSX.Element {
	const auth = useAuth();

	return (
		<nav className="fixed inset-0 z-[998] flex h-16 w-full items-center justify-between border-b border-b-border bg-card px-10">
			<div className="h-full py-2">
				<Link href="/" className="h-full content-center">
					<img
						src={itsoUmakLogo}
						alt="ITSO Logo"
						className="h-full w-full object-cover"
					/>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<Button onClick={auth.signOut}>Logout</Button>

				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
