import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import { createFileRoute } from "@tanstack/react-router";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PuffLoader } from "react-spinners";
import { JSX } from "react/jsx-runtime";
import { QuizStatus } from "@/lib/quiz/types";

export const Route = createFileRoute("/_authed/quizzes/$quizId/")({
	component: RouteComponent,
});

const UMAK_FACTS = [
	"The University of Makati (UMak) is a public university located in Taguig City, Metro Manila, Philippines.",
	"UMak was founded in 1972 as the Makati Polytechnic Community College.",
	"UMak is the only public university in Metro Manila.",
	"UMak offers a wide range of undergraduate and graduate programs.",
	"The College of Computing and Information Sciences (CCIS) is one of the colleges at UMak.",
	"This system was custom-developed for this competition using Astro, React, Tailwind, and Golang.",
];

// NOTE: This is the waiting room before the quiz starts

function RouteComponent(): JSX.Element {
	const navigate = Route.useNavigate();
	const _ = useWebSocket(WEBSOCKET_URL, {
		onMessage: async (event) => {
			const result: WebSocketRequest = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateStatus:
					{
						const status = result.data as QuizStatus;
						if (status !== QuizStatus.Started) {
							return;
						}

						await gsap.to(contentContainerRef.current, {
							scale: 0,
							ease: "expo.in",
							duration: 0.5,
						});

						await navigate({ to: "answer" });
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		},
		...WEBSOCKET_OPTIONS,
	});

	const [funFact, setFunFact] = useState<string>("");
	const funFactRef = useRef<HTMLSpanElement>(null);
	const titleRef = useRef<HTMLSpanElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.fromTo(
			titleRef.current,
			{
				top: "-50px",
				opacity: 0,
			},
			{
				top: "0px",
				opacity: 1,
			},
		);
		gsap.fromTo(
			funFactRef.current,
			{
				top: "50px",
				opacity: 0,
			},
			{
				top: "0px",
				opacity: 1,
			},
		);

		let time: number = Math.ceil(Math.random() * 5) + 5;
		setFunFact(UMAK_FACTS[Math.ceil(Math.random() * UMAK_FACTS.length - 1)]);

		const funfactInterval = setInterval(async () => {
			await gsap.to(funFactRef.current, {
				right: "50px",
				opacity: 0,
			});

			setFunFact(UMAK_FACTS[Math.ceil(Math.random() * UMAK_FACTS.length - 1)]);
			time = Math.ceil(Math.random() * 5) + 5;

			await gsap
				.fromTo(
					funFactRef.current,
					{
						right: "-50px",
						opacity: 0,
					},
					{
						right: "0",
						opacity: 1,
					},
				)
				.play();
		}, time * 1000);

		return () => clearInterval(funfactInterval);
	}, []);

	return (
		<div className="grid h-full w-full place-items-center">
			<div
				ref={contentContainerRef}
				className="flex flex-col items-center gap-4 *:text-center"
			>
				<PuffLoader color="#95C2FE" />
				<span ref={titleRef} className="relative text-4xl font-bold">
					Wait until the competition starts...
				</span>

				<span className="relative text-sm italic" ref={funFactRef}>
					{funFact}
				</span>
			</div>
		</div>
	);
}
