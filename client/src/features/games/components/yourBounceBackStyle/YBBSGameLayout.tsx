import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/your-bounce-back-style.webp";
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



const YBBSGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  // const [answers, setAnswers] = useState<AnswerRecord>({});

  const [answers, setAnswers] = useState<
    Record<string, { optionIndex: number; optionText: string }>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find((game) => game.id === "your-best-bouncing-self");
  const navigate = useNavigateWithSound();
  const sectionId = "Resilience & Coping Mechanisms";

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
      const targetIndex = firstUnansweredIndex !== -1 ? firstUnansweredIndex : questions.length - 1;
      
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
    setAnswers((prev) => ({ ...prev, [questionId]: { optionIndex, optionText } }));

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

  // const handleScoreChange = async (
  //   questionId: string,
  //   selectedIndex: number,
  //   score: number
  // ) => {
  //   // Update local state immediately
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: { optionIndex: selectedIndex, score },
  //   }));

  //   // Submit to backend
  //   try {
  //     setIsSubmitting(true);
  //     await submitQuestionResponse(sectionId, {
  //       questionId,
  //       optionIndex: selectedIndex,
  //     });
  //     console.log(`Successfully submitted answer for question ${questionId}`);
  //   } catch (error) {
  //     console.error("Failed to submit answer:", error);
  //     // Optionally show a toast or error message to user
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
          type: QuestionType.METER_OUTER_VALUE,
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

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) return <div>No questions found</div>;

  return (
    <Page sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
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
        Your Best Bouncing Self
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
        <VerticalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          disableTouch={!isCurrentQuestionAnswered()}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: game?.theme.secondary.main,
          }}
          items={questions.map((question) => (
            <Box key={question._id} padding={"18px"} width="100%">
              <QuestionRender
                question={question}
                game={game}
                selectedOptionIndex={answers[question._id]?.optionIndex ?? null}
              />

              <Stack
                direction={"row"}
                marginTop={"20px"}
                justifyContent={"space-between"}
                alignItems={"center"}
                onClick={(e) => e.stopPropagation()}
                gap={2}
              >
                <OutlinedButton
                  border={`2px solid ${game?.theme.primary.main}`}
                  sx={{
                    flex: 1,
                    color: game?.theme.primary.main,
                    padding: "8px 12px",
                  }}
                  onClick={handlePrevious}
                >
                  Previous
                </OutlinedButton>

                <ContainedButton
                  sx={{
                    flex: 1,
                    bgcolor: game?.theme.primary.main,
                    padding: "8px 12px",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onClick={handleNext}
                  // disabled={isSubmitting}
                >
                  {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                </ContainedButton>
              </Stack>
            </Box>
          ))}
        />
      </Stack>
    </Page>
  );
};

export default YBBSGameLayout;
