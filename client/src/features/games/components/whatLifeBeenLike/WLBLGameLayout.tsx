import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/what-life-been-like.webp";
import Page from "../../../../components/layout/Page";
import HorizontalCarousel, {
  HorizontalCarouselRef,
} from "../../../../components/utility/HorizontalCarousel";
import { games } from "../../data/allGames";
import QuestionRender from "../../../questions/components/QuestionRender";
import { whatLifeBeenLikeQuestions } from "../../../questions/data/whatLifeBeenLikeData";
import OutlinedButton from "../../../../components/ui/OutlinedButton";
import ContainedButton from "../../../../components/ui/ContainedTextInput";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";

const WLBLGameLayout = () => {
  const carouselRef = useRef<HorizontalCarouselRef>(null);
  const game = games.find((game) => game.id === "what-life-been-like");
  const navigate = useNavigateWithSound();
  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) {
      return;
    }
    carouselRef.current?.previous();
  };

  const handleEnded = () => {
    navigate("/user/home");
  };

  const handleNext = () => {
    if (
      carouselRef.current?.getCurrentIndex() ===
      whatLifeBeenLikeQuestions.length - 1
    ) {
      handleEnded();
      return;
    }

    carouselRef.current?.next();
  };

  const handleCardChange = () => {
    setTimeout(() => {
      const currentIdx = carouselRef.current?.getCurrentIndex() ?? 0;
      if (currentIdx === whatLifeBeenLikeQuestions.length) {
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
        What Life’s Been <br />
        Like?
      </Typography>
      <LinearProgress
        value={20}
        variant="determinate"
        sx={{
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#94C530",
          },
          backgroundColor: "#FECA2A",
        }}
      />
      <Box marginTop={"20px"} flex={1}>
        <HorizontalCarousel
          ref={carouselRef}
          handleCardChange={handleCardChange}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: game?.theme.secondary.main,
          }}
          items={whatLifeBeenLikeQuestions.map((question, index) => (
            <Box key={index} padding={"18px"}>
              <QuestionRender question={question} game={game} />
              <Stack
                direction={"row"}
                marginTop={"20px"}
                justifyContent={"space-between"}
                alignItems={"center"}
                onClick={(e) => e.stopPropagation()} // Prevent event bubbling to carousel
              >
                <OutlinedButton
                  border={`2px solid ${game?.theme.primary.main}`}
                  sx={{ color: game?.theme.primary.main, padding: "3px 10px" }}
                  onClick={handlePrevious}
                >
                  Previous
                </OutlinedButton>
                <ContainedButton
                  sx={{
                    bgcolor: game?.theme.primary.main,
                    padding: "3px 30px",
                  }}
                  onClick={handleNext}
                >
                  Next
                </ContainedButton>
              </Stack>
            </Box>
          ))}
        />
      </Box>
    </Page>
  );
};

export default WLBLGameLayout;
