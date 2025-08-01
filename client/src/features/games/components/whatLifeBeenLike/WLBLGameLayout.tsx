// WLBLGameLayout.tsx
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/what-life-been-like.webp";
import Page from "../../../../components/layout/Page";
import HorizontalCarousel, {
  HorizontalCarouselRef,
} from "../../../../components/utility/HorizontalCarousel";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import {
  fetchSectionQuestions,
  submitQuestionResponse,
  getUserProgress,
} from "../../../../services/api/assessment";
import { Question, QuestionType, QuestionGroup } from "../../../questions/types/questionTypes";
import { useDidYouKnow } from "../../../didYouKnow/hooks/useDidYouKnow";
import DidYouKnowOverlay from "../../../didYouKnow/components/DidYouKnowOverlay";

const WLBLGameLayout = () => {
  const carouselRef = useRef<HorizontalCarouselRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayQuestions, setDisplayQuestions] = useState<(Question | QuestionGroup)[]>([]);
  const [setOriginalQuestions] = useState<Question[]>([]); // Store original DB questions
  const [answers, setAnswers] = useState<
    Record<string, { optionIndex?: number; optionText?: string; selectedQuestionIds?: string[] }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find((game) => game.id === "what-life-been-like");
  const navigate = useNavigateWithSound();
  const sectionId = "Life Stress Assessment";

  // Did You Know overlay logic
  const { isOverlayOpen, currentFact, closeOverlay } = useDidYouKnow(
    "what-life-been-like",
    displayQuestions.length,
    currentIndex
  );

  // Function to group questions into sets of 5 for display (Section A only)
  const createQuestionGroups = (questionsArray: Question[]): (Question | QuestionGroup)[] => {
    const groupedQuestions: (Question | QuestionGroup)[] = [];
    const groupSize = 5;
    
    for (let i = 0; i < questionsArray.length; i += groupSize) {
      const questionGroup = questionsArray.slice(i, i + groupSize);
      
      if (questionGroup.length > 1) {
        // Create a grouped question for display
        const questionGroupDisplay: QuestionGroup = {
          _id: `group_${Math.floor(i / groupSize) + 1}`,
          title: `Life Experiences - Group ${Math.floor(i / groupSize) + 1}`,
          questions: questionGroup,
          type: QuestionType.MULTIPLE_CHOICE_GROUP,
          selectedQuestions: new Set<string>()
        };
        groupedQuestions.push(questionGroupDisplay);
      } else if (questionGroup.length === 1) {
        // Single question, keep as is
        groupedQuestions.push(questionGroup[0]);
      }
    }
    
    return groupedQuestions;
  };

  // Initialize current index from URL params
  useEffect(() => {
    const questionIndex = searchParams.get("question");
    if (questionIndex) {
      const index = parseInt(questionIndex, 10);
      if (!isNaN(index) && index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [searchParams]);

  // Set initial index to first unanswered question or last question if all answered
  useEffect(() => {
    const questionIndex = searchParams.get("question");

    if (!questionIndex && displayQuestions.length > 0) {
      let firstUnansweredIndex = -1;
      for (let i = 0; i < displayQuestions.length; i++) {
        if (!answers[displayQuestions[i]._id]) {
          firstUnansweredIndex = i;
          break;
        }
      }

      const targetIndex =
        firstUnansweredIndex !== -1
          ? firstUnansweredIndex
          : displayQuestions.length - 1;

      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
        setTimeout(() => {
          carouselRef.current?.goToSlide(targetIndex);
        }, 100);
      }
    }
  }, [displayQuestions, answers, searchParams, currentIndex]);

  // Update URL when index changes
  useEffect(() => {
    if (displayQuestions.length > 0) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("question", currentIndex.toString());
        return newParams;
      });
    }
  }, [currentIndex, displayQuestions.length, setSearchParams]);

  useEffect(() => {
    const loadQuestionsAndProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load questions from DB (unchanged)
        const questionsResponse = await fetchSectionQuestions(sectionId);
        console.log("Fetched questions:", questionsResponse);

        // Load user progress
        let progressData = null;
        try {
          progressData = await getUserProgress(sectionId);
          console.log("User progress:", progressData);
        } catch (progressError) {
          console.log("No existing progress found, starting fresh");
        }

        // Transform questions (keep original structure)
        const transformedQuestions = questionsResponse.map((q: any) => ({
          _id: q._id,
          text: q.text,
          options: q.options,
          type: q.questionType,
          rawOptions: q.options,
          onSelectWithIndex: (optionIndex: number, optionText: string) =>
            handleOptionSelect(q._id, optionIndex, optionText),
        }));

        setOriginalQuestions(transformedQuestions);

        // For Section A (Life Stress Assessment), group questions for display
        // For other sections, show as individual questions
        const questionsForDisplay = sectionId === "Life Stress Assessment" 
          ? createQuestionGroups(transformedQuestions)
          : transformedQuestions;

        setDisplayQuestions(questionsForDisplay);

        // Set existing answers from progress
        if (progressData?.exists && progressData.answeredQuestions) {
          const existingAnswers: Record<
            string,
            { optionIndex?: number; optionText?: string; selectedQuestionIds?: string[] }
          > = {};
          
          // Handle individual question answers
          progressData.answeredQuestions.forEach((answer: any) => {
            const question = transformedQuestions.find(
              (q: any) => q._id === answer.questionId
            );
            if (question && question.options[answer.optionIndex]) {
              existingAnswers[answer.questionId] = {
                optionIndex: answer.optionIndex,
                optionText: question.options[answer.optionIndex].text,
              };
            }
          });

          // For grouped questions, reconstruct group selections from individual answers
          if (sectionId === "Life Stress Assessment") {
            questionsForDisplay.forEach((displayQ: any) => {
              if (displayQ.type === QuestionType.MULTIPLE_CHOICE_GROUP) {
                const group = displayQ as QuestionGroup;
                const selectedQuestionIds = group.questions
                  .filter(q => existingAnswers[q._id] && existingAnswers[q._id].optionIndex === 0) // "Experienced" option
                  .map(q => q._id);
                
                if (selectedQuestionIds.length > 0) {
                  existingAnswers[group._id] = {
                    selectedQuestionIds
                  };
                }
              }
            });
          }

          setAnswers(existingAnswers);
        }

        // Navigate to saved index after questions are loaded
        const questionIndex = searchParams.get("question");
        if (questionIndex && questionsForDisplay.length > 0) {
          const index = parseInt(questionIndex, 10);
          if (
            !isNaN(index) &&
            index >= 0 &&
            index < questionsForDisplay.length
          ) {
            setTimeout(() => {
              carouselRef.current?.goToSlide(index);
            }, 100);
          }
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionsAndProgress();
  }, [sectionId]);

  const handleOptionSelect = async (
    questionId: string,
    optionIndex: number,
    optionText: string
  ) => {
    // Update local state immediately
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { optionIndex, optionText },
    }));

    // Submit to backend (unchanged - still individual question responses)
    try {
      setIsSubmitting(true);
      await submitQuestionResponse(sectionId, {
        questionId,
        optionIndex,
      });
      console.log(`Successfully submitted answer for question ${questionId}`);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGroupSelection = async (groupId: string, selectedQuestionIds: string[]) => {
    // Update local state immediately
    setAnswers((prev) => ({
      ...prev,
      [groupId]: { selectedQuestionIds },
    }));

    // Submit individual responses to backend for each question in the group
    try {
      setIsSubmitting(true);
      
      const currentGroup = displayQuestions.find(q => q._id === groupId) as QuestionGroup;
      if (currentGroup) {
        // Submit responses for all questions in the group
        const submitPromises = currentGroup.questions.map(async (question) => {
          const isSelected = selectedQuestionIds.includes(question._id);
          const optionIndex = isSelected ? 0 : 1; // 0 = "Experienced", 1 = "Not experienced"
          
          return submitQuestionResponse(sectionId, {
            questionId: question._id,
            optionIndex,
          });
        });
        
        await Promise.all(submitPromises);
        console.log(`Successfully submitted group answers for ${currentGroup.questions.length} questions`);
      }
    } catch (error) {
      console.error("Failed to submit group answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleNext = () => {
    const currentQuestion = displayQuestions[currentIndex];
    const currentAnswer = answers[currentQuestion._id];

    // Check if current question is answered
    if (!currentAnswer || 
        (currentQuestion.type === QuestionType.MULTIPLE_CHOICE_GROUP && 
         (!currentAnswer.selectedQuestionIds || currentAnswer.selectedQuestionIds.length === 0))) {
      alert("Please select at least one option before proceeding");
      return;
    }

    if (currentIndex === displayQuestions.length - 1) {
      navigate("/user/home?nextSectionTransition=true");
      return;
    }

    carouselRef.current?.next();
  };

  const handleCardChange = () => {
    setTimeout(() => {
      const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
      setCurrentIndex(currentIdx);
    }, 0);
  };

  // Function to check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = displayQuestions[currentIndex];
    const currentAnswer = answers[currentQuestion?._id];
    
    if (currentQuestion?.type === QuestionType.MULTIPLE_CHOICE_GROUP) {
      return currentAnswer?.selectedQuestionIds && currentAnswer.selectedQuestionIds.length > 0;
    }
    
    return !!currentAnswer;
  };

  // Show loading spinner
  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (displayQuestions.length === 0) return <div>No questions found</div>;

  return (
    <Page sx={{ padding: "20px 28px", maxWidth: "800px", margin: "0 auto" }}>
      <Box
        component={"img"}
        src={cornerGraphic}
        width={"100px"}
        sx={{
          position: "absolute",
          top: "0",
          right: "0",
        }}
      />
      
      {/* Header with Title and Counter */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="flex-start" 
        position="relative" 
        marginTop="16px"
      >
        <Typography
          fontSize={"25px"}
          fontWeight={"600"}
        >
          What Life's Been <br />
          Like?
        </Typography>
        
        {/* Page Counter */}
        <Box
          sx={{
            borderRadius: "20px",
            padding: "8px 16px",
            paddingBottom: "0px",
            marginTop: "4px",
            alignSelf: "flex-end",
          }}
        >
          <Typography
            fontSize={"30px"}
            fontWeight={"700"}
            color="#A4B56E"
            sx={{ opacity: 0.4 }}
          >
            {currentIndex + 1}/{displayQuestions.length}
          </Typography>
        </Box>
      </Stack>

      <LinearProgress
        value={((currentIndex + 1) / displayQuestions.length) * 100}
        variant="determinate"
        sx={{
          "& .MuiLinearProgress-bar": { backgroundColor: "#94C530" },
          backgroundColor: "#FECA2A",
          marginTop: "10px",
        }}
      />

      <Stack marginTop={"20px"} flex={1}>
        <HorizontalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          disableTouch={!isCurrentQuestionAnswered()}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: game?.theme.secondary.main,
            width: "100%",
            minWidth: "300px",
          }}
          items={displayQuestions.map((question) => {
            const currentAnswer = answers[question._id];
            
            return (
              <Stack flex={1} key={question._id} padding={"18px"} width="100%">
                <QuestionRender
                  question={question}
                  game={game}
                  selectedOptionIndex={currentAnswer?.optionIndex}
                  selectedQuestionIds={currentAnswer?.selectedQuestionIds}
                  onSelectionChange={(selectedQuestionIds: string[]) => 
                    handleGroupSelection(question._id, selectedQuestionIds)
                  }
                />
                <Stack
                  direction={"row"}
                  marginTop={"20px"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  onClick={(e) => e.stopPropagation()}
                  gap={2}
                >
                  {/* Previous Button */}
                  <IconButton
                    sx={{
                      border: `3px solid #A4B56E`, // Updated border color
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={handlePrevious}
                  >
                    <ArrowBackIosNewIcon
                      fontSize="medium"
                      sx={{
                        color: "#A4B56E !important", // Updated arrow color
                        path: { color: "inherit !important" },
                      }}
                    />
                  </IconButton>

                  {/* Next/Finish Button */}
                  <IconButton
                    sx={{
                      border: `3px solid #A4B56E`, // Updated border color
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        opacity: 0.9,
                      },
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onClick={handleNext}
                    // disabled={isSubmitting}
                  >
                    {currentIndex === displayQuestions.length - 1 ? (
                      <CheckIcon
                        fontSize="medium"
                        sx={{
                          color: "#A4B56E !important", // Updated checkmark color
                          path: { color: "inherit !important" },
                        }}
                      />
                    ) : (
                      <ArrowForwardIosIcon
                        fontSize="medium"
                        sx={{
                          color: "#A4B56E !important", // Updated arrow color
                          path: { color: "inherit !important" },
                        }}
                      />
                    )}
                  </IconButton>
                </Stack>
              </Stack>
            );
          })}
        />
      </Stack>

      {/* Did You Know Overlay */}
      <DidYouKnowOverlay
        open={isOverlayOpen}
        onClose={closeOverlay}
        fact={currentFact}
      />
    </Page>
  );
};

export default WLBLGameLayout;