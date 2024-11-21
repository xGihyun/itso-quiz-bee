import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export const Route = createFileRoute("/timer/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [time, setTime] = React.useState(30); // Default countdown time in seconds
  const [inputTime, setInputTime] = React.useState(30); // Time input for editing
  const [isCounting, setIsCounting] = React.useState(false); // Whether the timer is counting down
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(
    null
  ); // To store the interval ID
  const timerSpanRef = React.useRef<HTMLSpanElement>(null);
  const timesUpRef = React.useRef<HTMLSpanElement>(null);

  // Start the countdown
  const startCountdown = () => {
    const threshold25 = inputTime * 0.25;
    if (intervalId) {
      clearInterval(intervalId); // Clear any existing intervals
    }
    setIsCounting(true);
    const id = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          setIsCounting(false);
          timesUpRef.current!.textContent = "Timer's Up!";

          // Kill any ongoing animations before starting new ones
          gsap.killTweensOf(timerSpanRef.current);
          gsap.killTweensOf(timesUpRef.current);

          // Animate the "times up" state
          gsap.to(timerSpanRef.current, {
            scale: 0.5,
            opacity: 0,
          });
          gsap
            .fromTo(
              timesUpRef.current,
              {
                opacity: 0,
                scale: 0.5,
              },
              {
                opacity: 1,
                scale: 1,
              }
            )
            .then(() => {
              gsap
                .to(timesUpRef.current, {
                  y: 10,
                  opacity: 0,
                  ease: "expo.in",
                  duration: 3,
                })
                .then(() => {
                  timesUpRef.current!.textContent = "Evaluating Results";
                  gsap.to(timesUpRef.current, {
                    y: 0,
                    opacity: 1,
                    ease: "expo.out",
                  });
                });
            });

          return 0;
        }

        if (prevTime - 1 <= threshold25) {
          gsap
            .to(timerSpanRef.current, {
              scale: 1.1,
              duration: 0.2,
            })
            .then(() => {
              gsap.to(timerSpanRef.current, {
                scale: 1,
                duration: 0.5,
              });
            });
        }

        return prevTime - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  // Reset the timer to the input time
  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId); // Clear any existing intervals
    }
    setTime(inputTime);
    setIsCounting(false);

    // Kill ongoing animations before starting new ones
    gsap.killTweensOf(timesUpRef.current);
    gsap.killTweensOf(timerSpanRef.current);

    gsap.to(timesUpRef.current, {
      opacity: 0,
      scale: 0.5,
    });

    gsap.to(timerSpanRef.current, {
      scale: 1,
      opacity: 1,
    });
  };

  // Handle change in input time
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setInputTime(value);
    if (!isCounting) {
      setTime(value);
    }
  };

  // Calculate the color based on remaining time
  const getTimerColor = () => {
    const threshold75 = inputTime * 0.75;
    const threshold25 = inputTime * 0.25;

    if (time <= threshold25) return "text-red-500"; // Red color when below 25%
    if (time <= threshold75) return "text-orange-300"; // Orange color when below 75%
    return "text-white"; // Default color
  };

  React.useEffect(() => {
    gsap.set(timesUpRef.current, {
      opacity: 0,
    });
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center justify-center">
        <span
          className={`text-[15em] transition-colors font-bold ${getTimerColor()}`}
          ref={timerSpanRef}
        >
          {time}
        </span>
        <span
          className="absolute text-[5em] font-metropolis-black"
          ref={timesUpRef}
        >
          Time's Up!
        </span>
      </div>
      <div className="flex space-x-4">
        <Input
          type="number"
          value={inputTime}
          onChange={handleInputChange}
          className="border p-2 text-xl"
          disabled={isCounting}
        />
        <Button
          onClick={startCountdown}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={isCounting}
        >
          Start
        </Button>
        <Button
          onClick={resetTimer}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
