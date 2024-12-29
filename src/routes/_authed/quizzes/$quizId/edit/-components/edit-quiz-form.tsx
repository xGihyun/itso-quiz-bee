import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateQuizInput, CreateQuizSchema } from "./schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/api/types";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Quiz } from "@/lib/quiz/types";
import { createDefaultQuestion, createDefaultQuiz } from "../-constants";
import { JSX } from "react";

type Props = {
	quiz?: Quiz;
};

export function EditQuizForm(props: Props): JSX.Element {
	const params = useParams({ from: "/_authed/quizzes/$quizId/edit/" });

	const form = useForm<CreateQuizInput>({
		resolver: zodResolver(CreateQuizSchema),
		defaultValues: props.quiz || createDefaultQuiz(params.quizId)
	});

	const formQuestions = useFieldArray({
		control: form.control,
		name: "questions"
	});

	async function onSubmit(value: CreateQuizInput): Promise<void> {
		let toastId = toast.loading("Creating quiz...");

		console.log(value);

		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include"
			}
		);

		const result: ApiResponse = await response.json();

		if (!response.ok) {
			toast.error(result.message, { id: toastId });
			return;
		}

		toast.success(result.message, { id: toastId });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Card>
					<CardHeader>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Insert Title"
											className="h-auto md:text-2xl"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardHeader>

					<CardContent>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Insert description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{formQuestions.fields.map((field, i) => {
					return (
						<Card key={field.id}>
							<CardHeader>
								<FormField
									control={form.control}
									name={`questions.${i}.content`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<AutosizeTextarea
													placeholder="Insert question"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`questions.${i}.points`}
									render={({ field }) => (
										<FormItem className="col-span-1 w-full">
											<FormControl>
												<Input placeholder="Points" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`questions.${i}.duration`}
									render={({ field }) => (
										<FormItem className="col-span-1 w-full">
											<FormControl>
												<Input placeholder="Duration (seconds)" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardHeader>

							<CardContent>
								<FormField
									control={form.control}
									name={`questions.${i}.answers.0.content`}
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input placeholder="Insert answer" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					);
				})}

				<div className="flex flex-col gap-2">
					<Button
						type="button"
						onClick={() => formQuestions.append(createDefaultQuestion())}
						variant="secondary"
					>
						Add Question
					</Button>
					<Button type="submit">Create Quiz</Button>
				</div>
			</form>
		</Form>
	);
}
