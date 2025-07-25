import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/feel-your-feeling.webp";
import Page from "../../../../components/layout/Page";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import OutlinedButton from "../../../../components/ui/OutlinedButton";
import ContainedButton from "../../../../components/ui/ContainedTextInput";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import {
  fetchSectionQuestions,
  submitQuestionResponse,
  getUserProgress,
} from "../../../../services/api/assessment";
import { Question, QuestionType } from "../../../questions/types/questionTypes";
import VerticalCarousel, {
  VerticalCarouselRef,
} from "../../../../components/utility/VerticalCarousel";

const FYFGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<
    Record<string, { optionIndex: number; optionText: string }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find((game) => game.id === "feel-your-feelings");
  const navigate = useNavigateWithSound();
  const sectionId = "Mental Health Screening";


  useEffect(() => {
    const questionIndex = searchParams.get('question');
    if (questionIndex) {
      const index = parseInt(questionIndex, 10);
      if (!isNaN(index) && index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (questions.length > 0) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('question', currentIndex.toString());
        return newParams;
      });
    }
  }, [currentIndex, questions.length, setSearchParams]);

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

    // Submit to backend
    try {
      setIsSubmitting(true);
      await submitQuestionResponse(sectionId, {
        questionId,
        optionIndex,
      });
      console.log(`Successfully submitted answer for question ${questionId}`);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      // Optionally show a toast or error message to user
      // For now, we'll keep the local state but you might want to revert it
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadQuestionsAndProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load questions
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

        // Transform questions and set up handlers
        const transformedQuestions = questionsResponse.map((q: any) => ({
          _id: q._id,
          text: q.text,
          options: q.options,
          type: QuestionType.OPTIONS,
          rawOptions: q.options,
          onSelectWithIndex: (optionIndex: number, optionText: string) =>
            handleOptionSelect(q._id, optionIndex, optionText),
        }));

        setQuestions(transformedQuestions);

        // Set existing answers from progress
        if (progressData?.exists && progressData.answeredQuestions) {
          const existingAnswers: Record<
            string,
            { optionIndex: number; optionText: string }
          > = {};
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

          setAnswers(existingAnswers);
        }

        // After questions are loaded, navigate to the saved index
        const questionIndex = searchParams.get('question');
        if (questionIndex && transformedQuestions.length > 0) {
          const index = parseInt(questionIndex, 10);
          if (!isNaN(index) && index >= 0 && index < transformedQuestions.length) {
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

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/do-you-know", { state: { answers } });
  };

  const handleNext = () => {
    const currentQuestionId = questions[currentIndex]?._id;
    
    if (!answers[currentQuestionId]) {
      alert('Please select an option before proceeding');
      return;
    }

    if (currentIndex === questions.length - 1) {
      handleEnded();
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

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) return <div>No questions found</div>;

  return (
    <Page sx={{ padding: "20px" }}>
      <Box
        component={"img"}
        src={cornerGraphic}
        width={"100px"}
        sx={{
          position: "absolute",
          top: "10%",
          right: "0",
        }}
      />
      <Typography
        fontSize={"25px"}
        fontWeight={"600"}
        position={"relative"}
        marginTop={"16px"}
        mb={"12px"}
      >
        Feel Your
        <br /> Feelings
      </Typography>
      <LinearProgress
        value={((currentIndex + 1) / questions.length) * 100}
        variant="determinate"
        sx={{
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#8DD1FF",
          },
          backgroundColor: "#FFA1A2",
        }}
      />
      <Box marginTop={"20px"} id="game-questions-container">
        <VerticalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          cardStyle={{
            border: `2px solid ${game?.theme.secondary.main}`,
          }}
          items={questions.map((question) => {
            const currentAnswer = answers[question._id];
            return (
              <Stack
                key={question._id}
                padding={"18px"}
                justifyContent={"space-between"}
                flex={1}
              >
                <QuestionRender 
                  question={question} 
                  game={game} 
                  selectedOptionIndex={currentAnswer?.optionIndex}
                />
                <Stack
                  direction={"row"}
                  marginTop={"20px"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <OutlinedButton
                    border={`2px solid ${game?.theme.secondary.main}`}
                    sx={{
                      color: game?.theme.secondary.main,
                      padding: "3px 10px",
                    }}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handlePrevious();
                    }}
                  >
                    Previous
                  </OutlinedButton>
                  <ContainedButton
                    sx={{
                      bgcolor: game?.theme.secondary.main,
                      padding: "3px 30px",
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleNext();
                    }}
                    // disabled={isSubmitting}
                  >
                    {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                  </ContainedButton>
                </Stack>
              </Stack>
            );
          })}
        />
      </Box>
    </Page>
  );
};

export default FYFGameLayout;