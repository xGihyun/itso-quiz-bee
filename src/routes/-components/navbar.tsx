import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import { Link, useNavigate } from "@tanstack/react-router";
import { JSX } from "react";
import { removeCookie } from "typescript-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import foo from "../-images/itso-umak-logo.webp";

export function Navbar(): JSX.Element {
	const auth = useAuth();
	const navigate = useNavigate();

	const logout = async () => {
		removeCookie("session");
		await auth.validateSession();
		navigate({ to: "/login" });
	};

	return (
		<nav className="fixed inset-0 z-[998] flex h-16 w-full items-center justify-between border-b border-b-border bg-background px-10">
			<div className="h-full py-2">
				<Link href="/" className="h-full content-center">
					<img
						src={foo}
						alt="ITSO Logo"
						className="h-full w-full object-cover"
					/>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<Button onClick={logout}>Logout</Button>

				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
