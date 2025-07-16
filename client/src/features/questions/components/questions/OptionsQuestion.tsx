import { Typography, Box, Stack } from "@mui/material";
import { QuestionProps } from "../../types/questionTypes";
import { useState } from "react";

const OptionsQuestion: React.FC<QuestionProps> = ({ game, question }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Box>
      <Typography fontSize={"18px"} fontWeight={"500"}>
        {question.question}
      </Typography>
      <Stack>
        {question.options?.map((option, index) => (
          <Stack
            direction={"row"}
            key={index}
            onClick={() => setSelectedOption(option)}
            sx={{
              flex: 1,
              border: `1px solid ${game?.theme.primary.main}`,
              bgcolor: "#fff",
              borderRadius: "10px",
              padding: "10px",
              marginTop: "10px",
              cursor: "pointer",
              opacity: selectedOption === option ? 1 : 0.7,
              minHeight: "70px",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            <Stack
              width={"20px"}
              height={"20px"}
              bgcolor={game?.theme.primary.main}
              sx={{
                aspectRatio: "1",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            >
              {selectedOption === option && (
                <Box
                  width={"100%"}
                  height={"100%"}
                  bgcolor={"#fff"}
                  sx={{
                    aspectRatio: "1",
                    scale: 0.5,
                    borderRadius: "50%",
                  }}
                />
              )}
            </Stack>
            <Typography fontSize={"16px"} fontWeight={"500"}>
              {option}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default OptionsQuestion;
