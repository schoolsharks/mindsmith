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
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Did You Know overlay logic
  const { isOverlayOpen, currentFact, closeOverlay } = useDidYouKnow(
    "the-brainy-bits",
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

  const handleOptionSelect = async (
    questionId: string,
    optionIndex: number,
    _optionText?: string
  ) => {
    // Get the option text from the question
    const question = questions.find((q) => q._id === questionId);
    const optionText = question?.options[optionIndex]?.text || "";

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
          onSelectWithIndex: (optionIndex: number, optionText: string) =>
            handleOptionSelect(q._id, optionIndex, optionText),
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

        // Navigate to saved index after questions are loaded
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

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/home?nextSectionTransition=true", { state: { answers } });
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion?._id];

    if (!currentAnswer) {
      alert("Please select an option before proceeding");
      return;
    }

    if (currentIndex === questions.length - 1) {
      handleEnded();
      return;
    }

    carouselRef.current?.next();
  };

  const handleCardChange = () => {
    // Update URL when carousel changes (for manual swipe/touch navigation)
    setTimeout(() => {
      const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
      setCurrentIndex(currentIdx);
    }, 0);
  };

  // Function to check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion?._id];
    return !!currentAnswer;
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
