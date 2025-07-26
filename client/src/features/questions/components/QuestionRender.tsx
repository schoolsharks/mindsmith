// QuestionRender.tsx
import { Game } from "../../games/data/allGames";
import { Question, QuestionType } from "../types/questionTypes";
import LinearMeter from "./questions/LinearMeter";
// import MeterInnerValue from "./questions/MeterInnerValue";
import MeterOuterValue from "./questions/MeterOuterValue";
import OptionsQuestion from "./questions/OptionsQuestion";

interface QuestionRenderProps {
  game?: Game;
  question: Question & { 
    onSelect?: (option: string) => void;
    onSelectWithIndex?: (optionIndex: number, optionText: string) => void;
  };
  selectedOptionIndex?: number;
}

const QuestionRender: React.FC<QuestionRenderProps> = ({ 
  game, 
  question, 
  selectedOptionIndex 
}) => {
  if (question.type === QuestionType.OPTIONS) {
    return (
      <OptionsQuestion
        question={question}
        game={game}
        onSelect={question.onSelect}
        selectedOptionIndex={selectedOptionIndex}
      />
    );
  } 
  // else if (question.type === QuestionType.METER_INNER_VALUE) {
  //   return <MeterInnerValue question={question} game={game} selectedOptionIndex={selectedOptionIndex} />;
  // } 
  else if (question.type === QuestionType.SEMICIRCLE_METER) {
    return (
      <MeterOuterValue 
        question={question} 
        game={game} 
        selectedOptionIndex={selectedOptionIndex}
        onSelectWithIndex={question.onSelectWithIndex}
      />
    );
  } else if (question.type === QuestionType.LINEAR_METER) {
    return (
      <LinearMeter 
        question={question} 
        game={game} 
        selectedOptionIndex={selectedOptionIndex}
        onSelectWithIndex={question.onSelectWithIndex}
      />
    );
  }
  return null;
};

export default QuestionRender;
