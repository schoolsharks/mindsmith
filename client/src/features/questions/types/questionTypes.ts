// questionTypes.ts
export enum QuestionType {
  OPTIONS = "OPTIONS",
  SEMICIRCLE_METER = "SEMICIRCLE_METER",
  LINEAR_METER = "LINEAR_METER",
  MULTIPLE_CHOICE_GROUP = "MULTIPLE_CHOICE_GROUP", // Frontend-only type for grouping
}

export interface QuestionOption {
  text: string;
  score: number;
  _id?: string;
}

export interface Question {
  _id: string;
  text: string;
  options: QuestionOption[];
  type: QuestionType;
  rawOptions?: QuestionOption[];
  onSelect?: (option: string) => void;
  onSelectWithIndex?: (optionIndex: number, optionText: string) => void;
  category?: string;
  order?: number;
}

// Frontend-only interface for grouping existing questions for display
export interface QuestionGroup {
  _id: string; // Generated group ID
  title: string; // Group title
  questions: Question[]; // Array of actual questions from DB
  type: QuestionType.MULTIPLE_CHOICE_GROUP;
  selectedQuestions: Set<string>; // Track which questions are "experienced"
}