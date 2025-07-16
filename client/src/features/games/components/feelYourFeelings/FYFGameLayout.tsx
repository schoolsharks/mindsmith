import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/feel-your-feeling.webp";
import Page from "../../../../components/layout/Page";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import OutlinedButton from "../../../../components/ui/OutlinedButton";
import ContainedButton from "../../../../components/ui/ContainedTextInput";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import { feelYourFeelingsQuestions } from "../../../questions/data/feelYourFeelingsData";
import VerticalCarousel, {
  VerticalCarouselRef,
} from "../../../../components/utility/VerticalCarousel";

const FYFGameLayout = () => {
  const carouselRef = useRef<VerticalCarouselRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const game = games.find((game) => game.id === "feel-your-feelings");
  const navigate = useNavigateWithSound();
  const handlePrevious = () => {
    const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
    if (currentIdx === 0) {
      return;
    }
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/home");
  };
  const handleNext = () => {
    const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
    if (currentIdx === feelYourFeelingsQuestions.length - 1) {
      handleEnded();
      return;
    }

    carouselRef.current?.next();
  };

  const handleCardChange = () => {
    setTimeout(() => {
      const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
      setCurrentIndex(currentIdx);
      if (currentIdx === feelYourFeelingsQuestions.length) {
        handleEnded();
      }
    }, 0);
  };

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
        value={((currentIndex + 1) / feelYourFeelingsQuestions.length) * 100}
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
            // bgcolor: `${game?.theme.secondary.main}60`,
          }}
          items={feelYourFeelingsQuestions.map((question, index) => (
            <Stack
              key={index}
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
                  Next
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
