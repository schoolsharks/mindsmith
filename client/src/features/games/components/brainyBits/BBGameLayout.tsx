import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/the-brainy-bits.webp";
import Page from "../../../../components/layout/Page";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import IconButton from "@mui/material/IconButton";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import {
  fetchSectionQuestions,
  submitQuestionResponse,
  getUserProgress,
} from "../../../../services/api/assessment";
import { Question } from "../../../questions/types/questionTypes";
import VerticalCarousel, {
  VerticalCarouselRef,
} from "../../../../components/utility/VerticalCarousel";
import { useDidYouKnow } from "../../../didYouKnow/hooks/useDidYouKnow";
import DidYouKnowOverlay from "../../../didYouKnow/components/DidYouKnowOverlay";
import {
  CircleCheck,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import Loader from "../../../../components/ui/Loader";

const BBGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<
    Record<string, { optionIndex: number; optionText: string }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find((game) => game.id === "the-brainy-bits");
  const navigate = useNavigateWithSound();
  const sectionId = "Comprehensive Brain Health Biomarkers";

  // Helper function to get current index from URL - single source of truth
  const getCurrentIndex = () => {
    const questionIndex = searchParams.get("question");
    const index = questionIndex ? parseInt(questionIndex, 10) : 0;
    return !isNaN(index) && index >= 0 && index < questions.length ? index : 0;
  };

  const currentIndex = getCurrentIndex();

  // Did You Know overlay logic
  const { isOverlayOpen, currentFact, closeOverlay } = useDidYouKnow(
    "the-brainy-bits",
    questions.length,
    currentIndex
  );

  // Set initial question index when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !searchParams.get("question")) {
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

      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("question", targetIndex.toString());
        return newParams;
      }, { replace: true });
    }
  }, [questions, answers, searchParams, setSearchParams]);

  // Sync carousel with URL changes
  useEffect(() => {
    if (questions.length > 0) {
      const targetIndex = getCurrentIndex();
      setTimeout(() => {
        carouselRef.current?.goToSlide(targetIndex);
      }, 100);
    }
  }, [searchParams, questions.length]);

  const handleOptionSelect = async (
    questionId: string,
    optionIndex: number,
    _optionText?: string
  ) => {
    // For YBBS, we need to get the score from the option
    const question = questions.find((q) => q._id === questionId);
    // const score = question?.options[optionIndex]?.score || 0;

    // Update local state immediately
    const optionText = question?.options[optionIndex]?.text || "";
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
          type: q.questionType,
          rawOptions: q.options,
          // onChange: (selectedIndex: number) => {
          //   const score = q.options[selectedIndex].score;
          //   handleScoreChange(q._id, selectedIndex, score);
          // },
          onSelectWithIndex: (optionIndex: number, optionText: string) =>
            handleOptionSelect(q._id, optionIndex, optionText),
          // defaultAnswer: q.options[1].score // Middle option score
        }));

        setQuestions(transformedQuestions);

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

        // const initialAnswers: AnswerRecord = {};
        // transformedQuestions.forEach((q: any) => {
        //   initialAnswers[q._id] = { optionIndex: 1, score: q.defaultAnswer };
        // });

        // if (progressData?.exists && progressData.answeredQuestions) {
        //   progressData.answeredQuestions.forEach((answer: any) => {
        //     const question = transformedQuestions.find(
        //       (q: any) => q._id === answer.questionId
        //     );
        //     if (question && question.rawOptions[answer.optionIndex]) {
        //       initialAnswers[answer.questionId] = {
        //         optionIndex: answer.optionIndex,
        //         score: question.rawOptions[answer.optionIndex].score,
        //       };
        //     }
        //   });
        // }

        // console.log("Initial answers set:", initialAnswers);

        // setAnswers(initialAnswers);

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
    if (currentIndex === 0) return;
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("question", (currentIndex - 1).toString());
      return newParams;
    });
  };

  const handleEnded = () => {
    navigate("/user/home?nextSectionTransition=true", { state: { answers } });
  };

  const handleNext = () => {
    const currentQuestionId = questions[currentIndex]?._id;

    if (!answers[currentQuestionId]) {
      alert("Please select an option before proceeding");
      return;
    }

    if (currentIndex === questions.length - 1) {
      handleEnded();
      return;
    }

    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("question", (currentIndex + 1).toString());
      return newParams;
    });
  };

  const handleCardChange = () => {
    // Update URL when carousel changes (for manual swipe/touch navigation)
    setTimeout(() => {
      const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
      const currentUrlIndex = getCurrentIndex();
      
      // Only update URL if carousel index differs from URL index
      if (currentIdx !== currentUrlIndex) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set("question", currentIdx.toString());
          return newParams;
        });
      }
    }, 0);
  };

  // Function to check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestionId = questions[currentIndex]?._id;
    return !!answers[currentQuestionId];
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) return <div>No questions found</div>;

  return (
    <Page sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Box
        component={"img"}
        src={cornerGraphic}
        width={"200px"}
        sx={{
          position: "absolute",
          top: "0",
          right: "0",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "48px",
          right: "20px",
          borderRadius: "20px",
          alignSelf: "flex-end",
        }}
      >
        <Typography
          fontSize={"30px"}
          fontWeight={"700"}
          color="#FFFFFF"
          sx={{ opacity: 0.4 }}
        >
          {currentIndex + 1}/{questions.length}
        </Typography>
      </Box>
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
          position={"relative"}
          marginTop={"16px"}
          mb={"12px"}
        >
          The Brainy Bits
        </Typography>
        {/* Page Counter */}
      </Stack>

      <LinearProgress
        value={((currentIndex + 1) / questions.length) * 100}
        variant="determinate"
        sx={{
          "& .MuiLinearProgress-bar": { backgroundColor: "#f5fd12" },
          backgroundColor: "#FFA1A2",
        }}
      />

      <Box marginTop={"20px"} id="game-questions-container">
        <VerticalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          disableTouch={!isCurrentQuestionAnswered()}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: "white",
          }}
          items={questions.map((question) => (
            <Stack
              key={question._id}
              padding={"18px"}
              justifyContent={"space-between"}
              flex={1}
            >
              <QuestionRender
                question={question}
                game={game}
                selectedOptionIndex={answers[question._id]?.optionIndex}
              />
              <Stack
                direction={"row"}
                marginTop={"20px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <IconButton
                  onClick={(e) => {
                    e?.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <CircleChevronLeft size={36} color="#8DD1FF" />
                </IconButton>

                <IconButton
                  sx={{
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleNext();
                  }}
                  // disabled={isSubmitting}
                >
                  {currentIndex === questions.length - 1 ? (
                    <CircleCheck size={36} color="#8DD1FF" />
                  ) : (
                    <CircleChevronRight size={36} color="#8DD1FF" />
                  )}
                </IconButton>
              </Stack>
            </Stack>
          ))}
        />
      </Box>

      {/* Did You Know Overlay */}
      <DidYouKnowOverlay
        open={isOverlayOpen}
        onClose={closeOverlay}
        fact={currentFact}
      />
    </Page>
  );
};

export default BBGameLayout;
