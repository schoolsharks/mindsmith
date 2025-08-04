import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
// import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-graphic.webp";
// import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-animation.webm";
import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-animation.gif";
import { useEffect } from "react";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";

const FYFSplashScreen = () => {
  const navigate = useNavigateWithSound();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/games/feel-your-feelings/game");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Page sx={{ overflow: "hidden" }}>
      {/* <Box component={"img"} src={mainGraphic} width={"100%"} /> */}
      {/* <Box
        component={"video"}
        src={mainAnimation}
        autoPlay
        muted
        width={"100%"}
        sx={{ position: "absolute", top: -100, left: 0 }}
        // height={"100%"}
      /> */}
      <Box
        component={"img"}
        src={mainAnimation}
        width={"100%"}
        sx={{ position: "absolute", top: -100, left: 0 }}
      />
      <Box
        margin={"auto 0 10px"}
        position={"relative"}
        zIndex={1}
        textAlign={"center"}
        padding={"24px"}
      >
        <Typography color="#FF8F91" lineHeight={"20px"}>
          Think about the last 2 weeks and answer the questions in this section.{" "}
        </Typography>
        <Typography fontSize={"12px"} marginTop={"8px"} color="#00000080">
          Note: Substances include Tobacco, Alcohol, Cannabis along with other
          recreational drugs.
        </Typography>
      </Box>
    </Page>
  );
};

export default FYFSplashScreen;
