import { Game } from "../../games/data/allGames";
import { Question, QuestionType } from "../types/questionTypes";
import LinearMeter from "./questions/LinearMeter";
import MeterInnerValue from "./questions/MeterInnerValue";
import MeterOuterValue from "./questions/MeterOuterValue";
import OptionsQuestion from "./questions/OptionsQuestion";

interface QuestionRenderProps {
  game?: Game;
  question: Question;
}

const QuestionRender: React.FC<QuestionRenderProps> = ({ game, question }) => {
  if (question.type === QuestionType.OPTIONS) {
    return <OptionsQuestion question={question} game={game} />;
  } else if (question.type === QuestionType.METER_INNER_VALUE) {
    return <MeterInnerValue question={question} game={game} />;
  } else if (question.type === QuestionType.METER_OUTER_VALUE) {
    return <MeterOuterValue question={question} game={game} />;
  } else if (question.type === QuestionType.METER_LINEAR) {
    return <LinearMeter question={question} game={game} />;
  }
};

export default QuestionRender;
