import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/feel-your-feeling.webp";
import Page from "../../../../components/layout/Page";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import OutlinedButton from "../../../../components/ui/OutlinedButton";
import ContainedButton from "../../../../components/ui/ContainedTextInput";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import { fetchSectionQuestions } from "../../../../services/api/assessment";
import { Question, QuestionType } from "../../../questions/types/questionTypes";
import VerticalCarousel, {
  VerticalCarouselRef,
} from "../../../../components/utility/VerticalCarousel";

const FYFGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const game = games.find((game) => game.id === "feel-your-feelings");
  const navigate = useNavigateWithSound();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchSectionQuestions("Mental Health Screening");
        
        const transformedQuestions = response.map((q: any) => ({
          _id: q._id,
          text: q.text,
          options: q.options.map((opt: any) => opt.text),
          type: QuestionType.OPTIONS,
          rawOptions: q.options,
          onSelect: (optionText: string) => handleOptionSelect(q._id, optionText)
        }));
        
        setQuestions(transformedQuestions);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleOptionSelect = (questionId: string, optionText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionText }));
  };

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/do-you-know");
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
          items={questions.map((question) => (
            <Stack
              key={question._id}
              padding={"18px"}
              justifyContent={"space-between"}
              flex={1}
            >
              <QuestionRender question={question} game={game} />
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
                  }}
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleNext();
                  }}
                >
                  {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                </ContainedButton>
              </Stack>
            </Stack>
          ))}
        />
      </Box>
    </Page>
  );
};

export default FYFGameLayout;