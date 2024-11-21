import { ApiResponse } from "../api/types";
import {
  GetAnswerRequest,
  GetWrittenAnswerResponse,
  QuizQuestion,
} from "./types";

export async function getCurrentQuestion(
  quizId: string
): Promise<ApiResponse<QuizQuestion | null>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/questions/current`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result: ApiResponse<QuizQuestion | null> = await response.json();

  console.log(result);

  return result;
}

export async function getCurrentAnswer(
  quizId: string
): Promise<ApiResponse<GetWrittenAnswerResponse | null>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/users/answers`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result: ApiResponse<GetWrittenAnswerResponse | null> =
    await response.json();

  console.log(result);

  return result;
}

export async function freezeQuiz(
  quizId: string,
  freezed: boolean
): Promise<ApiResponse<{ quiz_id: string } | null>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/freeze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        freezed,
      }),
    }
  );

  const result: ApiResponse<{ quiz_id: string } | null> = await response.json();

  console.log(result);

  return result;
}

export async function getQuizFreezeState(
  quizId: string
): Promise<ApiResponse<{ quiz_id: string; freezed: boolean } | null>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/frozen`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result: ApiResponse<{ quiz_id: string; freezed: boolean } | null> =
    await response.json();

  console.log(result);

  return result;
}