import { Game } from "../../games/data/allGames";

export enum QuestionType {
  OPTIONS = "OPTIONS",
  METER_INNER_VALUE = "METER_INNER_VALUE",
  METER_OUTER_VALUE = "METER_OUTER_VALUE",
  METER_LINEAR = "METER_LINEAR",
}

export interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
}

export interface QuestionProps {
  question: Question;
  game?: Game;
}
