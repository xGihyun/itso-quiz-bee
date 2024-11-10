import {
  type NewAnswerInput,
  type NewQuestionInput,
  QuestionVariant,
} from "../-components/schema";

export const DEFAULT_ANSWER = new Map<QuestionVariant, NewAnswerInput[]>([
  [
    QuestionVariant.MultipleChoice,
    [
      {
        content: "Option 1",
        is_correct: false,
      },
    ],
  ],
  [
    QuestionVariant.Written,
    [
      {
        content: "Option 1",
        is_correct: false,
      },
    ],
  ],
  [
    QuestionVariant.Boolean,
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
  answers: DEFAULT_ANSWER.get(QuestionVariant.MultipleChoice) || [],
  content: "Untitled Question",
  variant: QuestionVariant.MultipleChoice,
  //order_number: 1,
};
