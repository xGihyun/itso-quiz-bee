import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
import { Quiz } from "@/lib/quiz";
import { createDefaultQuestion, createDefaultQuiz } from "../-constants";
import { JSX, useEffect } from "react";

type Props = {
	quiz?: Quiz;
};

export function EditQuizForm(props: Props): JSX.Element {
	const params = useParams({ from: "/_authed/quizzes/$quizId/edit/" });

	// Normalize quiz data to ensure all questions have at least one answer
	const normalizedQuiz = props.quiz ? {
		...props.quiz,
		questions: props.quiz.questions.map((question) => ({
			...question,
			answers: question.answers && question.answers.length > 0 
				? question.answers 
				: [createDefaultAnswer()]
		}))
	} : createDefaultQuiz(params.quizId);

	const form = useForm<CreateQuizInput>({
		resolver: zodResolver(CreateQuizSchema),
		defaultValues: normalizedQuiz
	});

	const formQuestions = useFieldArray({
		control: form.control,
		name: "questions"
	});

	// Debug: Log validation errors
	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.log("Form validation errors:", form.formState.errors);
		}
	}, [form.formState.errors]);

	// Debug: Log form values
	useEffect(() => {
		const subscription = form.watch((value) => {
			console.log("Form values changed:", value);
		});
		return () => subscription.unsubscribe();
	}, [form.watch]);

	async function onSubmit(value: CreateQuizInput): Promise<void> {
		console.log("onSubmit called with:", value);
		let toastId = toast.loading("Creating quiz...");

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

	// Add invalid handler to see what's failing
	function onInvalid(errors: any): void {
		console.log("Form is invalid, errors:", errors);
		toast.error("Please fix the form errors before submitting");
	}

	return (
		<Form {...form}>
			<form 
				onSubmit={form.handleSubmit(onSubmit, onInvalid)} 
				className="space-y-4"
			>
				{/* Debug display */}
				{Object.keys(form.formState.errors).length > 0 && (
					<Card className="border-destructive">
						<CardHeader className="text-destructive">
							<p className="font-bold">Form Errors:</p>
							<pre className="text-xs overflow-auto">
								{JSON.stringify(form.formState.errors, null, 2)}
							</pre>
						</CardHeader>
					</Card>
				)}

				<Card>
					<CardHeader>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quiz Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter quiz title"
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
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Enter quiz description" {...field} />
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
							<CardHeader className="space-y-4">
								<FormField
									control={form.control}
									name={`questions.${i}.content`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Question {i + 1}</FormLabel>
											<FormControl>
												<AutosizeTextarea
													placeholder="Enter your question"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name={`questions.${i}.points`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Points</FormLabel>
												<FormControl>
													<Input 
														placeholder="0" 
														type="number"
														{...field}
														onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`questions.${i}.duration`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Duration (seconds)</FormLabel>
												<FormControl>
													<Input 
														placeholder="30" 
														type="number"
														{...field}
														onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardHeader>

							<CardContent>
								<FormField
									control={form.control}
									name={`questions.${i}.answers.0.content`}
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Correct Answer</FormLabel>
											<FormControl>
												<Input placeholder="Enter the correct answer" {...field} />
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
