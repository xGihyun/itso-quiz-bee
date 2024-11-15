import { QuizQuestionVariant } from "@/lib/quiz/types";
import {
  type NewAnswerInput,
  type NewQuestionInput,
} from "../-components/schema";

export const DEFAULT_ANSWER = new Map<QuizQuestionVariant, NewAnswerInput[]>([
  [
    QuizQuestionVariant.MultipleChoice,
    [
      {
        content: "Option 1",
        is_correct: false,
      },
    ],
  ],
  [
    QuizQuestionVariant.Written,
    [
      {
        content: "Option 1",
        is_correct: false,
      },
    ],
  ],
  [
    QuizQuestionVariant.Boolean,
    [
      {
        content: "True",
        is_correct: true,
      },
      {
        content: "False",
        is_correct: false,
      },
    ],
  ],
]);

export const DEFAULT_QUESTION: NewQuestionInput = {
  points: 1,
  answers: DEFAULT_ANSWER.get(QuizQuestionVariant.MultipleChoice) || [],
  content: "Untitled Question",
  variant: QuizQuestionVariant.MultipleChoice,
  //order_number: 1,
};
