import { Typography, Box, Stack } from "@mui/material";
import { useState } from "react";
import DOMPurify from "dompurify";
import { Game } from "../../../games/data/allGames";
import { Question } from "../../types/questionTypes";

interface QuestionProps {
  game?: Game;
  question: Question & { 
    onSelect?: (option: string) => void;
    onSelectWithIndex?: (optionIndex: number, optionText: string) => void;
  };
  onSelect?: (option: string) => void;
  selectedOptionIndex?: number; // For showing previously selected option
}

const OptionsQuestion: React.FC<QuestionProps> = ({ 
  game, 
  question, 
  onSelect, 
  selectedOptionIndex 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    selectedOptionIndex ?? null
  );

  // Handle option selection
  const handleOptionSelect = (index: number, optionText: string) => {
    setSelectedOption(index);
    onSelect?.(optionText);
    question.onSelect?.(optionText);
    question.onSelectWithIndex?.(index, optionText);
  };

  return (
    <Stack flex={1}>
      <Typography
        fontSize={"18px"}
        fontWeight={"500"}
        minHeight={"75px"}
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(question.text) 
        }}
      />
      <Stack>
        {question.options?.map((option, index) => (
          <Stack
            direction={"row"}
            key={index}
            onClick={() => handleOptionSelect(index, option.text)}
            sx={{
              flex: 1,
              border: `1px solid ${game?.theme.primary.main}`,
              bgcolor: "#fff",
              borderRadius: "10px",
              padding: "10px",
              marginTop: "10px",
              cursor: "pointer",
              opacity: selectedOption === index ? 1 : 0.7,
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
              {selectedOption === index && (
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
            <Typography 
              fontSize={"16px"} 
              fontWeight={"500"}
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(option.text) 
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default OptionsQuestion;