import { Box, Stack, Typography } from "@mui/material";
import { QuestionProps } from "../../types/questionTypes";
import LinearMeterChart from "../../../../components/ui/LinearMeterChart";
import { useState } from "react";

const LinearMeter: React.FC<QuestionProps> = ({ 
  question, 
  selectedOptionIndex,
  onSelectWithIndex
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    selectedOptionIndex ?? null
  );

  const handleChange = (index: number) => {
    setSelectedOption(index);
    const optionText = question.options[index]?.text || "";
    onSelectWithIndex?.(index, optionText);
  };

  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.text}
      </Typography>
      <Stack alignItems={"center"}>
        <LinearMeterChart
          labels={question.options.map(option => option.text)}
          selectedIndex={selectedOption !== null ? selectedOption : undefined}
          onChange={handleChange}
        />
      </Stack>
    </Box>
  );
};

export default LinearMeter;
