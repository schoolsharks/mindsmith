import { Box, Typography } from "@mui/material";
import { QuestionProps } from "../../types/questionTypes";
import SemicircleMeterChart from "../../../../components/ui/SemicircleMeter";

const MeterOuterValue: React.FC<QuestionProps> = ({ question }) => {
  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.question}
      </Typography>
      <SemicircleMeterChart labels={question.options} />
    </Box>
  );
};

export default MeterOuterValue;
