import { JSX, useEffect, useRef, useState } from "react";
import { UMAK_FACTS } from "../quizzes/$quizId/-constants";
import { PuffLoader } from "react-spinners";
import { gsap } from "gsap";

export function Wait(): JSX.Element {
	const [funFact, setFunFact] = useState<string>("");
	const funFactRef = useRef<HTMLSpanElement>(null);
	const titleRef = useRef<HTMLSpanElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
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
		setFunFact(UMAK_FACTS[Math.ceil(Math.random() * UMAK_FACTS.length - 1)]);

		const funfactInterval = setInterval(async () => {
			await gsap.to(funFactRef.current, {
				right: "50px",
				opacity: 0
			});

			setFunFact(UMAK_FACTS[Math.ceil(Math.random() * UMAK_FACTS.length - 1)]);
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
