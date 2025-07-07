import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInSchema, type SignInInput } from "./schema";
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
import { SignInResponse } from "../-types";
import { setCookie } from "@/lib/cookie";

export function SignInForm(): JSX.Element {
	const navigate = useNavigate({ from: "/sign-in" });
	const form = useForm<SignInInput>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			username: "",
			password: ""
		}
	});

	async function onSubmit(value: SignInInput): Promise<void> {
		let toastId = toast.loading("Signing in...");

		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/sign-in`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include"
			}
		);

		const result: ApiResponse<SignInResponse> = await response.json();
		if (!response.ok) {
			toast.error(result.message, { id: toastId });
			return;
		}

		setCookie("session", result.data.token);
		toast.success(result.message, { id: toastId });
		await navigate({ to: "/" });
	}

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Sign In</CardTitle>
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
							Sign In
						</Button>
					</form>
				</Form>

				<p className="text-center text-sm">
					Don't have an account?{" "}
					<Link to="/sign-up" className="text-primary underline">
						Sign Up
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
