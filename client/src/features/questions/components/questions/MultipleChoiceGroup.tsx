// MultipleChoiceGroup.tsx
import { Typography, Box, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { Game } from "../../../games/data/allGames";
import { Question, QuestionGroup } from "../../types/questionTypes";

interface MultipleChoiceGroupProps {
  game?: Game;
  questionGroup: QuestionGroup;
  selectedQuestionIds?: string[]; // Previously selected question IDs
  onSelectionChange?: (selectedQuestionIds: string[]) => void;
}

const MultipleChoiceGroup: React.FC<MultipleChoiceGroupProps> = ({ 
  game, 
  questionGroup, 
  selectedQuestionIds = [],
  onSelectionChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(selectedQuestionIds)
  );

  // Update local state when props change
  useEffect(() => {
    setSelectedOptions(new Set(selectedQuestionIds));
  }, [selectedQuestionIds]);

  // Handle option selection/deselection
  const handleOptionToggle = (questionId: string) => {
    const newSelected = new Set(selectedOptions);
    
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    
    setSelectedOptions(newSelected);
    
    // Notify parent component
    const selectedArray = Array.from(newSelected);
    onSelectionChange?.(selectedArray);
  };

  return (
    <Stack flex={1}>
      {/* <Typography fontSize={"18px"} fontWeight={"600"} minHeight={"30px"} marginBottom={"8px"}>
        {questionGroup.title}
      </Typography> */}
      
      {/* <Typography fontSize={"14px"} fontWeight={"400"} color={"#666"} marginBottom={"8px"}>
        Select all that apply to your life experiences:
      </Typography> */}
      
      <Stack spacing={2}>
        {questionGroup.questions.map((question) => {
          const isSelected = selectedOptions.has(question._id);
          
          return (
            <Stack
              key={question._id}
              direction={"row"}
              onClick={() => handleOptionToggle(question._id)}
              sx={{
                border: `2px solid ${isSelected ? game?.theme.primary.main : '#E0E0E0'}`,
                bgcolor: "#fff",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                minHeight: "60px",
                opacity: isSelected ? 1 : 0.7,
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: game?.theme.primary.main,
                  bgcolor: `${game?.theme.primary.main}05`,
                },
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
              {isSelected && (
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
                fontSize={"14px"} 
                fontWeight={"600"}
                // sx={{
                //   color: isSelected ? game?.theme.primary.main : "#333",
                // }}
              >
                {question.text}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
      
      {/* <Typography 
        fontSize={"12px"} 
        fontWeight={"400"} 
        color={"#888"} 
        marginTop={"16px"}
        textAlign={"center"}
      >
        {selectedOptions.size} of {questionGroup.questions.length} selected
      </Typography> */}
    </Stack>
  );
};

export default MultipleChoiceGroup;