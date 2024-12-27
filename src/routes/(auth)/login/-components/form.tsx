import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginInput } from "./schema";
import { Button } from "@/components/ui/button";
import { setCookie } from "typescript-cookie";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ApiResponse } from "@/lib/api/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { User } from "@/lib/user/types";
import { JSX } from "react";
import { useAuth } from "@/lib/auth/context";

export function LoginForm(): JSX.Element {
	const auth = useAuth();
	const navigate = useNavigate({ from: "/login" });
	const form = useForm<LoginInput>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: "",
			password: ""
		}
	});

	async function onSubmit(value: LoginInput): Promise<void> {
		let toastId = toast.loading("Logging in...");

		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/login`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include"
			}
		);

		const result: ApiResponse<User> = await response.json();

		if (!response.ok) {
			toast.error(result.message, { id: toastId });
			return;
		}

		setCookie("session", result.data.user_id);
		await auth.validateSession();

		toast.success(result.message, { id: toastId });

		await navigate({ to: "/" });
	}

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>Enter your credentials below.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
				</Form>

				<p className="text-center text-sm">
					Don't have an account?{" "}
					<Link href="/register" className="text-primary underline">
						Register
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
