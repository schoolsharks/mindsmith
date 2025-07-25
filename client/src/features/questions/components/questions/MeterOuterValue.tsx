import { Box, Stack, Typography } from "@mui/material";
import { QuestionProps } from "../../types/questionTypes";
import SemicircleMeterChart from "../../../../components/ui/SemicircleMeter";

const MeterOuterValue: React.FC<QuestionProps> = ({ question }) => {
  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.text}
      </Typography>
      <Stack alignItems={"center"}>
        <SemicircleMeterChart labels={question.options} />
      </Stack>
    </Box>
  );
};

export default MeterOuterValue;
