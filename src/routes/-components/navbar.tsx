import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import itsoUmakLogo from "../-images/itso-umak-logo.webp";

export function Navbar(): JSX.Element {
	const auth = useAuth();
	const navigate = useNavigate();

	async function handleSignOut(): Promise<void> {
		await auth.signOut();
		await navigate({ to: "/sign-in" });
	}

    const initials = `${auth.user?.name[0]}`

	return (
		<nav className="fixed inset-0 z-[998] flex h-16 w-full items-center justify-between border-b border-b-border bg-card px-10">
			<div className="h-full py-2">
				<Link to="/" className="h-full content-center">
					<img
						src={itsoUmakLogo}
						alt="ITSO Logo"
						className="h-full w-full object-cover"
					/>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<Button onClick={handleSignOut}>Logout</Button>

				<Avatar>
					<AvatarImage />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
