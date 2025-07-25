import SemicircleMeter from "../../../../components/ui/SemicircleMeter";
import { QuestionProps } from "../../types/questionTypes";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const MeterInnerValue: React.FC<QuestionProps> = ({ 
  question, 
  selectedOptionIndex,
  onSelectWithIndex
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    selectedOptionIndex ?? null
  );

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const optionText = question.options[index]?.text || "";
    onSelectWithIndex?.(index, optionText);
  };

  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.text}
      </Typography>
      <SemicircleMeter 
        selectedIndex={selectedOption !== null ? selectedOption : undefined}
        onChange={handleOptionSelect}
      />
    </Box>
  );
};

export default MeterInnerValue;
