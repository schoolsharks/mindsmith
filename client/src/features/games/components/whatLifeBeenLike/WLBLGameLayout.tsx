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
import { Question } from "../../../questions/types/questionTypes";
import { useDidYouKnow } from "../../../didYouKnow/hooks/useDidYouKnow";
import DidYouKnowOverlay from "../../../didYouKnow/components/DidYouKnowOverlay";

const WLBLGameLayout = () => {
  const carouselRef = useRef<HorizontalCarouselRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<
    Record<string, { optionIndex: number; optionText: string }>
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
    questions.length,
    currentIndex
  );

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

    // Only set initial index if no query parameter and we have questions and answers
    if (!questionIndex && questions.length > 0) {
      // Find first unanswered question
      let firstUnansweredIndex = -1;
      for (let i = 0; i < questions.length; i++) {
        if (!answers[questions[i]._id]) {
          firstUnansweredIndex = i;
          break;
        }
      }

      // If all questions are answered, go to last question, otherwise go to first unanswered
      const targetIndex =
        firstUnansweredIndex !== -1
          ? firstUnansweredIndex
          : questions.length - 1;

      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
        setTimeout(() => {
          carouselRef.current?.goToSlide(targetIndex);
        }, 100);
      }
    }
  }, [questions, answers, searchParams, currentIndex]);

  // Update URL when index changes
  useEffect(() => {
    if (questions.length > 0) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("question", currentIndex.toString());
        return newParams;
      });
    }
  }, [currentIndex, questions.length, setSearchParams]);

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
          type: q.questionType,
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
        const questionIndex = searchParams.get("question");
        if (questionIndex && transformedQuestions.length > 0) {
          const index = parseInt(questionIndex, 10);
          if (
            !isNaN(index) &&
            index >= 0 &&
            index < transformedQuestions.length
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

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleNext = () => {
    const currentQuestionId = questions[currentIndex]?._id;

    if (!answers[currentQuestionId]) {
      alert("Please select an option before proceeding");
      return;
    }

    if (currentIndex === questions.length - 1) {
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
    const currentQuestionId = questions[currentIndex]?._id;
    return !!answers[currentQuestionId];
  };

  // Show loading spinner with submission status
  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) return <div>No questions found</div>;

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
      <Typography
        fontSize={"25px"}
        fontWeight={"600"}
        position={"relative"}
        marginTop={"16px"}
      >
        What Life's Been <br />
        Like?
      </Typography>

      <LinearProgress
        value={((currentIndex + 1) / questions.length) * 100}
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
          items={questions.map((question) => {
            const currentAnswer = answers[question._id];
            return (
              <Stack flex={1} key={question._id} padding={"18px"} width="100%">
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
                    {currentIndex === questions.length - 1 ? (
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
