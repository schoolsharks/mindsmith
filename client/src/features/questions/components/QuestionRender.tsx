import { Game } from "../../games/data/allGames";
import { Question, QuestionType } from "../types/questionTypes";
import OptionsQuestion from "./questions/OptionsQuestion";

interface QuestionRenderProps {
  game?: Game;
  question: Question;
}

const QuestionRender: React.FC<QuestionRenderProps> = ({ game, question }) => {
  if (question.type === QuestionType.OPTIONS) {
    return <OptionsQuestion question={question} game={game} />;
  }
};

export default QuestionRender;
