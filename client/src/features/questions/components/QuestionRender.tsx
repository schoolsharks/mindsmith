// QuestionRender.tsx
import { Game } from "../../games/data/allGames";
import { Question, QuestionType, QuestionGroup } from "../types/questionTypes";
import LinearMeter from "./questions/LinearMeter";
import MeterOuterValue from "./questions/MeterOuterValue";
import OptionsQuestion from "./questions/OptionsQuestion";
import MultipleChoiceGroup from "./questions/MultipleChoiceGroup";

interface QuestionRenderProps {
  game?: Game;
  question: Question | QuestionGroup;
  selectedOptionIndex?: number;
  selectedQuestionIds?: string[];
  onSelectionChange?: (selectedQuestionIds: string[]) => void;
}

const QuestionRender: React.FC<QuestionRenderProps> = ({ 
  game, 
  question, 
  selectedOptionIndex,
  selectedQuestionIds,
  onSelectionChange
}) => {
  // Handle grouped questions (multiple choice) - frontend display only
  if (question.type === QuestionType.MULTIPLE_CHOICE_GROUP) {
    const questionGroup = question as QuestionGroup;
    return (
      <MultipleChoiceGroup
        questionGroup={questionGroup}
        game={game}
        selectedQuestionIds={selectedQuestionIds}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  // Handle regular questions (existing logic unchanged)
  const regularQuestion = question as Question;
  
  if (regularQuestion.type === QuestionType.OPTIONS) {
    return (
      <OptionsQuestion
        question={regularQuestion}
        game={game}
        onSelect={regularQuestion.onSelect}
        selectedOptionIndex={selectedOptionIndex}
      />
    );
  } 
  else if (regularQuestion.type === QuestionType.SEMICIRCLE_METER) {
    return (
      <MeterOuterValue 
        question={regularQuestion} 
        game={game} 
        selectedOptionIndex={selectedOptionIndex}
        onSelectWithIndex={regularQuestion.onSelectWithIndex}
      />
    );
  } else if (regularQuestion.type === QuestionType.LINEAR_METER) {
    return (
      <LinearMeter 
        question={regularQuestion} 
        game={game} 
        selectedOptionIndex={selectedOptionIndex}
        onSelectWithIndex={regularQuestion.onSelectWithIndex}
      />
    );
  }
  return null;
};

export default QuestionRender;