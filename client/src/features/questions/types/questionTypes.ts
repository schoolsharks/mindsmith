import { Game } from "../../games/data/allGames";

// src/features/questions/types/questionTypes.ts
export interface Question {
  _id: string;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
  type: QuestionType;
}

export enum QuestionType {
  OPTIONS = 'OPTIONS',
  METER_INNER_VALUE = 'METER_INNER_VALUE',
  METER_OUTER_VALUE = 'METER_OUTER_VALUE',
  METER_LINEAR = 'METER_LINEAR'
}

export interface QuestionProps {
  question: Question;
  game?: Game;
  selectedOptionIndex?: number;
  onSelectWithIndex?: (optionIndex: number, optionText: string) => void;
}
