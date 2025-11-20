import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import { createFileRoute } from "@tanstack/react-router";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizStatus } from "@/lib/quiz";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PuffLoader } from "react-spinners";

export const Route = createFileRoute("/_authed/quizzes/$quizId/")({
	component: RouteComponent,
});

const umakFacts = [
	"Founded in 1972 as the Makati Polytechnic Community College, it is now the flagship university of the City of Makati.",
	"UMak pioneered the Dualized University Education System (DUES), creating industry-ready graduates through curriculum co-developed with corporate partners.",
	"The university consistently achieves a 100% passing rate in the Nurse Licensure Examination for first-time takers.",
	"UMak is a top-performing school in the Pharmacist Licensure Examination, often surpassing national passing rates by wide margins.",
	"Ranked 101-200 in the World University Rankings for Innovation (WURI), highlighting its global competitiveness.",
	"In 2025, UMak entered the Times Higher Education (THE) Impact Rankings for its contribution to UN Sustainable Development Goals.",
	"UMak was one of the first institutions in the Philippines to pilot the Senior High School program, years before nationwide implementation.",
	"The College of Computing and Information Sciences (CCIS) integrates industry-standard tech stacks directly into its coursework.",
	"Unlike traditional state universities, UMak is a locally-funded university (LCU) fully supported by the Makati City Government.",
	"The campus features an Olympic-standard track and field oval, home to the UMak Herons and national athletic events."
];

// NOTE: This is like the waiting room before the quiz starts

function RouteComponent() {
	const params = Route.useParams();
	const navigate = Route.useNavigate();
	const socket = useWebSocket(WEBSOCKET_URL, {
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateStatus:
					const status = result.data as QuizStatus;

					console.log("Quiz status updated:", status);

					if (status === QuizStatus.Started) {
						await gsap.to(contentContainerRef.current, {
							scale: 0,
							ease: "expo.in",
							duration: 0.5,
						});

						await navigate({
							to: "/quizzes/$quizId/answer",
							params: { quizId: params.quizId },
						});
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
		let funfactInterval: ReturnType<typeof setInterval>;
		gsap.fromTo(
			titleRef.current,
			{
				top: "-50px",
				opacity: 0
			},
			{
				top: "0px",
				opacity: 1
			}
		);
		gsap.fromTo(
			funFactRef.current,
			{
				top: "50px",
				opacity: 0
			},
			{
				top: "0px",
				opacity: 1
			}
		);

		let time: number = Math.ceil(Math.random() * 5) + 5;
		setFunFact(umakFacts[Math.ceil(Math.random() * umakFacts.length - 1)]);

		funfactInterval = setInterval(async () => {
			await gsap.to(funFactRef.current, {
				right: "50px",
				opacity: 0
			});

			setFunFact(umakFacts[Math.ceil(Math.random() * umakFacts.length - 1)]);
			time = Math.ceil(Math.random() * 5) + 5;

			await gsap
				.fromTo(
					funFactRef.current,
					{
						right: "-50px",
						opacity: 0
					},
					{
						right: "0",
						opacity: 1
					}
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
