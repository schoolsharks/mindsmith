import { Question, QuestionType } from "../types/questionTypes";

const feelYourFeelingsQuestions: Question[] = [
  {
    type: QuestionType.METER_OUTER_VALUE,
    question:
      "Have mood changes significantly impacted your sleep, appetite, or energy levels?",
    options: ["Minimal", "Mild", "Moderate", "Moderately Severe", "Severe"],
  },
  {
    type: QuestionType.METER_OUTER_VALUE,
    question:
      "How would you rate your ability to remember conversations from yesterday?",
    options: ["Very Poor", "Poor", "Good", "Confident", "High"],
  },
  {
    type: QuestionType.METER_LINEAR,
    question: "How often do you forget recent conversations or appointments?",
    options: ["Well", "Sometimes", "Often", "Very Often", "Always"],
  },
];

export { feelYourFeelingsQuestions };
