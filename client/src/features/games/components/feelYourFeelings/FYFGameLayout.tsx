import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import cornerGraphic from "../../../../assets/images/gameLayoutGraphics/feel-your-feeling.webp";
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

const FYFGameLayout = () => {
  const carouselRef = useRef<HorizontalCarouselRef>(null);
  const game = games.find((game) => game.id === "feel-your-feelings");
  const navigate = useNavigateWithSound();
  const handlePrevious = () => {
    if (carouselRef.current?.getCurrentIndex() === 0) {
      return;
    }
    carouselRef.current?.previous();
  };

  const handleNext = () => {
    if (
      carouselRef.current?.getCurrentIndex() ===
      whatLifeBeenLikeQuestions.length - 1
    ) {
      navigate("/user/home");
    }

    carouselRef.current?.next();
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
        value={20}
        variant="determinate"
        sx={{
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#8DD1FF",
          },
          backgroundColor: "#FFA1A2",
        }}
      />
      <Box marginTop={"20px"} flex={1}>
        <HorizontalCarousel
          ref={carouselRef}
          cardStyle={{
            border: `2px solid ${game?.theme.primary.main}`,
            bgcolor: game?.theme.secondary.main,
          }}
          items={whatLifeBeenLikeQuestions.map((question, index) => (
            <Box key={index} padding={"18px"}>
              <QuestionRender question={question} game={game} />
            </Box>
          ))}
        />
      </Box>
      <Stack
        direction={"row"}
        marginTop={"20px"}
        justifyContent={"space-between"}
        alignItems={"center"}
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
    </Page>
  );
};

export default FYFGameLayout;
