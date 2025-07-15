import SemicircleMeter from "../../../../components/ui/SemicircleMeter";
import { QuestionProps } from "../../types/questionTypes";
import { Box, Typography } from "@mui/material";

const MeterInnerValue: React.FC<QuestionProps> = ({ question }) => {
  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.question}
      </Typography>
      <SemicircleMeter />
    </Box>
  );
};

export default MeterInnerValue;
