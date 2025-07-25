import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/your-bounce-back-style.webp";
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

interface AnswerRecord {
  [key: string]: number;
}

const YBBSGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Temporary 
  answers;

  const game = games.find((game) => game.id === "your-best-bouncing-self");
  const navigate = useNavigateWithSound();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchSectionQuestions("Resilience & Coping Mechanisms");
        
        const transformedQuestions = response.map((q: any) => ({
          _id: q._id,
          text: q.text,
          options: q.options.map((opt: any) => opt.text),
          type: QuestionType.METER_OUTER_VALUE,
          rawOptions: q.options,
          onChange: (selectedIndex: number) => {
            const score = q.options[selectedIndex].score;
            setAnswers(prev => ({ ...prev, [q._id]: score }));
          },
          defaultAnswer: q.options[1].score // Middle option score
        }));

        // Initialize answers with default values
        const initialAnswers: AnswerRecord = {};
        transformedQuestions.forEach((q: any) => {
          initialAnswers[q._id] = q.defaultAnswer;
        });
        setAnswers(initialAnswers);
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

  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) return;
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/do-you-know");
  };

  const handleNext = () => {
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
          marginTop: "10px"
        }}
      />
      
      <Stack marginTop={"20px"} flex={1}>
        <VerticalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: game?.theme.secondary.main,
          }}
          items={questions.map((question) => (
            <Box key={question._id} padding={"18px"} width="100%">
              <QuestionRender question={question} game={game} />
              
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
                  }}
                  onClick={handleNext}
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