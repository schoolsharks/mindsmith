import { Question, QuestionType } from "../types/questionTypes";

const whatLifeBeenLikeQuestions: Question[] = [
  {
    type: QuestionType.OPTIONS,
    question:
      "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
    options: [
      "Not at all or rarely",
      "Several days (less than half the time)",
      "More than half the days or nearly every day",
    ],
  },
  {
    type: QuestionType.OPTIONS,
    question: "Have you faced any of the following changes at work recently?",
    options: [
      "I was let go or fired",
      "I recently retired",
      "No major changes",
    ],
  },
  {
    type: QuestionType.OPTIONS,
    question:
      "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
    options: [
      "Someone in the family is pregnant",
      "Welcomed a new family member",
      "No significant changes",
    ],
  },
];

export { whatLifeBeenLikeQuestions };
