export enum QuestionType {
  OPTIONS = "OPTIONS",
}

export interface Question {
  type: QuestionType.OPTIONS;
  question: string;
  options?: string[];
}
