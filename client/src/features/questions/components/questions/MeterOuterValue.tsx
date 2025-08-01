import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { QuestionProps } from "../../types/questionTypes";
import SemicircleMeterChart from "../../../../components/ui/SemicircleMeter";

const MeterOuterValue: React.FC<QuestionProps> = ({
  question,
  selectedOptionIndex,
  onSelectWithIndex,
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
      <Typography fontSize={"18px"} fontWeight={"500"} minHeight={"50px"}>
        {question.text}
      </Typography>
      <Stack alignItems={"center"}>
        <SemicircleMeterChart
          labels={question.options.map((option: { text: string }) => option.text)}
          selectedIndex={selectedOption !== null ? selectedOption : undefined}
          onChange={handleOptionSelect}
        />
      </Stack>
    </Box>
  );
};

export default MeterOuterValue;
