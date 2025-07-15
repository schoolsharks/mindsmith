import { Box, Typography } from "@mui/material";
import { QuestionProps } from "../../types/questionTypes";
import LinearMeterChart from "../../../../components/ui/LinearMeterChart";
import { useState } from "react";

const LinearMeter: React.FC<QuestionProps> = ({ question }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.question}
      </Typography>
      <LinearMeterChart 
        labels={question.options} 
        selectedIndex={selectedIndex}
        onChange={handleChange}
      />
    </Box>
  );
};

export default LinearMeter;
