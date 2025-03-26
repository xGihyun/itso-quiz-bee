import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpInput, SignUpSchema } from "./schema";
import { Button } from "@/components/ui/button";
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
import { JSX } from "react";
import { UserRole } from "@/lib/user";

export function SignUpForm(): JSX.Element {
	const navigate = useNavigate({ from: "/register" });
	const form = useForm<SignUpInput>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			username: "",
			password: "",
			name: "",
			role: UserRole.Player
		}
	});

	async function onSubmit(value: SignUpInput) {
		let toastId = toast.loading("Logging in...");

		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/sign-up`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json"
				},
			}
		);

		const result: ApiResponse = await response.json();

		console.log("Result:", result);

		if (!response.ok) {
			toast.error(result.message, { id: toastId });
			return;
		}

		toast.success(result.message, { id: toastId });
		await navigate({ to: "/login" });
	}

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">SignUp</CardTitle>
				<CardDescription>Enter your details below.</CardDescription>
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

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							SignUp
						</Button>
					</form>
				</Form>

				<p className="text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="text-primary underline">
						Login
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
