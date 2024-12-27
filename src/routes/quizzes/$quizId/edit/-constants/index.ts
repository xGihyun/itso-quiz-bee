import { QuizQuestionVariant } from "@/lib/quiz/types";
import {
  type NewAnswerInput,
  type NewQuestionInput,
} from "../-components/schema";
import { v4 as uuidv4 } from "uuid";

//const DEFAULT_ANSWER = new Map<QuizQuestionVariant, NewAnswerInput[]>([
//  [
//    QuizQuestionVariant.MultipleChoice,
//    [
//      {
//        content: "Option 1",
//        is_correct: false,
//        quiz_answer_id: uuidv4(),
//      },
//    ],
//  ],
//  [
//    QuizQuestionVariant.Written,
//    [
//      {
//        content: "Option 1",
//        is_correct: true,
//        quiz_answer_id: uuidv4(),
//      },
//    ],
//  ],
//  [
//    QuizQuestionVariant.Boolean,
//    [
//      {
//        content: "True",
//        is_correct: true,
//        quiz_answer_id: uuidv4(),
//      },
//      {
//        content: "False",
//        is_correct: false,
//        quiz_answer_id: uuidv4(),
//      },
//    ],
//  ],
//]);
//
//const DEFAULT_QUESTION: NewQuestionInput = {
//  quiz_question_id: uuidv4(),
//  points: 1,
//  answers: DEFAULT_ANSWER.get(QuizQuestionVariant.Written) || [],
//  content: "Untitled Question",
//  variant: QuizQuestionVariant.Written,
//  //order_number: 1,
//};

export function createDefaultQuestion(): NewQuestionInput {
  return {
    quiz_question_id: uuidv4(),
    points: 1,
    answers: [createDefaultAnswer()],
    content: "Untitled Question",
    variant: QuizQuestionVariant.Written,
    //order_number: 1,
  };
}

export function createDefaultAnswer(): NewAnswerInput {
  return {
    content: "Option 1",
    is_correct: true,
    quiz_answer_id: uuidv4(),
  };
}
